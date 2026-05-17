import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Map, Search } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import { deleteRoadmap, getRoadmaps } from '../../services/roadmapApi'
import { toast } from 'react-hot-toast'

const MyRoadMap = ({ onCreate, onEdit }) => {
	const { user } = useContext(AuthContext)
	const [roadmaps, setRoadmaps] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const navigate = useNavigate()
	const creatorId = user?.id || user?._id || null
	const isRecruiter = user?.role === 2;

	const loadRoadmaps = async () => {
		try {
			setLoading(true)
			setError('')
			// Mặc định hiển thị roadmap admin + của bản thân
			// Cho phép tìm kiếm rộng hơn nếu có searchTerm
			// Đối với nhà tuyển dụng, chỉ hiển thị lộ trình của họ tạo ra
			const data = await getRoadmaps({ 
				creatorId, 
				search: searchTerm, 
				includeOfficial: isRecruiter ? false : true 
			})
			setRoadmaps(Array.isArray(data) ? data : [])
		} catch (e) {
			setError(e?.response?.data || 'Không thể tải danh sách roadmap.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadRoadmaps()
	}, [creatorId, searchTerm])

	const handleDelete = async (roadmapId) => {
		if (!window.confirm('Bạn chắc chắn muốn xóa roadmap này?')) {
			return
		}

		try {
			await deleteRoadmap(roadmapId)
			toast.success('Xóa lộ trình thành công!')
			await loadRoadmaps()
		} catch (e) {
			toast.error(e?.response?.data || 'Xóa roadmap thất bại.')
		}
	}

	return (
		<div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">
						{isRecruiter ? 'Lộ trình công ty' : 'Khám phá lộ trình'}
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
						{isRecruiter 
							? 'Quản lý các lộ trình tuyển dụng do công ty tạo ra gắn với các công việc' 
							: 'Tìm kiếm lộ trình học tập từ cộng đồng và các chuyên gia'}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
						<input
							type="text"
							placeholder="Tìm kiếm roadmap..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
						/>
					</div>
					<button
						onClick={onCreate}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shrink-0 shadow-lg shadow-blue-600/20"
					>
						<Plus size={16} />
						Tạo mới
					</button>
				</div>
			</div>

			<div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
				{['Tất cả', 'Unity', 'Unreal'].map((engine) => (
					<button
						key={engine}
						onClick={() => setSearchTerm(engine === 'Tất cả' ? '' : engine)}
						className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
							(searchTerm === engine || (engine === 'Tất cả' && !['Unity', 'Unreal'].includes(searchTerm)))
								? 'bg-blue-600 text-white border-blue-600 shadow-md'
								: 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-500/50'
						}`}
					>
						{engine}
					</button>
				))}
			</div>

			{loading && (
				<div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 text-slate-500 dark:text-slate-400">
					Đang tải roadmap...
				</div>
			)}

			{!loading && error && (
				<div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-6 text-rose-600 dark:text-rose-300 font-semibold">
					{error}
				</div>
			)}

			{!loading && !error && roadmaps.length === 0 && (
				<div className="rounded-2xl border border-slate-200 dark:border-white/10 p-10 text-center">
					<Map className="mx-auto text-slate-400 mb-3" />
					<p className="text-slate-500 dark:text-slate-400 font-semibold">Bạn chưa có roadmap nào.</p>
				</div>
			)}

			{!loading && !error && roadmaps.length > 0 && (
				<div className="grid gap-4">
					{roadmaps.map((roadmap) => (
						<article
							key={roadmap.id}
							className={`rounded-2xl border p-5 bg-white dark:bg-white/5 transition-all relative overflow-hidden group ${
								roadmap.isOfficial 
								? 'border-blue-500/30 dark:border-blue-500/20 shadow-lg shadow-blue-500/5' 
								: 'border-slate-200 dark:border-white/10'
							}`}
						>
							{/* Background Decoration */}
							<div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none`}>
								<Map size={120} />
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
								<div className="min-w-0">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{roadmap.title}</h3>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
											roadmap.isOfficial 
											? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
											: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20'
										}`}>
											{roadmap.isOfficial ? 'Official' : 'Community'}
										</span>
										{roadmap.engine && (
											<span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">
												{roadmap.engine}
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										onClick={() => navigate(`/roadmap/${roadmap.id || roadmap.slug}`)}
										className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity"
									>
										{isRecruiter ? 'XEM LỘ TRÌNH' : 'HỌC NGAY'}
									</button>
									{roadmap.createdBy === creatorId && (
										<>
											<button
												onClick={() => onEdit(roadmap.id)}
												className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 text-xs"
											>
												<Pencil size={12} />
											</button>
											<button
												onClick={() => handleDelete(roadmap.id)}
												className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-700/50 text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs"
											>
												<Trash2 size={12} />
											</button>
										</>
									)}
								</div>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	)
}

export default MyRoadMap