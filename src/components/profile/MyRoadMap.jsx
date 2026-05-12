import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Map, Search } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import { deleteRoadmap, getRoadmaps } from '../../services/roadmapApi'

const MyRoadMap = ({ onCreate, onEdit }) => {
	const { user } = useContext(AuthContext)
	const [roadmaps, setRoadmaps] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const navigate = useNavigate()
	const creatorId = user?.id || user?._id || null

	const loadRoadmaps = async () => {
		try {
			setLoading(true)
			setError('')
			// Mặc định hiển thị roadmap admin + của bản thân
			// Cho phép tìm kiếm rộng hơn nếu có searchTerm
			const data = await getRoadmaps({ 
				creatorId, 
				search: searchTerm, 
				includeOfficial: true 
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
			await loadRoadmaps()
		} catch (e) {
			alert(e?.response?.data || 'Xóa roadmap thất bại.')
		}
	}

	return (
		<div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">Khám phá lộ trình</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tìm kiếm lộ trình học tập từ cộng đồng và các chuyên gia</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
						<input
							type="text"
							placeholder="Tìm kiếm roadmap..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
						/>
					</div>
					<button
						onClick={onCreate}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shrink-0"
					>
						<Plus size={16} />
						Tạo mới
					</button>
				</div>
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
							className={`rounded-2xl border p-5 bg-white dark:bg-white/5 transition-all ${
								(roadmap.engine === 'Unity' || roadmap.engine === 'Unreal') 
								? 'border-blue-500/30 dark:border-blue-500/20 shadow-lg shadow-blue-500/5' 
								: 'border-slate-200 dark:border-white/10'
							}`}
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{roadmap.title}</h3>
										{(roadmap.engine === 'Unity' || roadmap.engine === 'Unreal') && (
											<span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
												Official
											</span>
										)}
									</div>
									<p className="text-xs text-slate-500 dark:text-slate-400">
										{roadmap.engine} • Tạo lúc: {roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleString('vi-VN') : 'N/A'}
									</p>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										onClick={() => navigate(`/roadmap/${roadmap.id}`)}
										className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
									>
										Xem chi tiết
									</button>
									{roadmap.creatorId === creatorId && (
										<>
											<button
												onClick={() => onEdit(roadmap.id)}
												className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 text-xs"
											>
												<Pencil size={12} />
											</button>
											<button
												onClick={() => handleDelete(roadmap.id)}
												className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-700/50 text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs"
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