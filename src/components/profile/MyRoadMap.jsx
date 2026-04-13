import React, { useContext, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Map } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import { deleteRoadmap, getRoadmaps } from '../../services/roadmapApi'

const MyRoadMap = ({ onCreate, onEdit }) => {
	const { user } = useContext(AuthContext)
	const [roadmaps, setRoadmaps] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const creatorId = user?.id || user?._id || null

	const loadRoadmaps = async () => {
		if (!creatorId) {
			setRoadmaps([])
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError('')
			const data = await getRoadmaps(creatorId)
			setRoadmaps(Array.isArray(data) ? data : [])
		} catch (e) {
			setError(e?.response?.data || 'Không thể tải danh sách roadmap của bạn.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadRoadmaps()
	}, [creatorId])

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
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">Roadmap của tôi</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý các roadmap bạn đã tạo và lưu</p>
				</div>
				<button
					onClick={onCreate}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Thêm roadmap
				</button>
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
							className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-white/5"
						>
							<div className="flex items-center justify-between gap-4">
								<div className="min-w-0">
									<h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{roadmap.title}</h3>
									<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
										Tạo lúc: {roadmap.createdAt ? new Date(roadmap.createdAt).toLocaleString('vi-VN') : 'N/A'}
									</p>
								</div>

								<div className="flex items-center gap-2 shrink-0">
									<button
										onClick={() => onEdit(roadmap.id)}
										className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10"
									>
										<Pencil size={14} /> Sửa
									</button>
									<button
										onClick={() => handleDelete(roadmap.id)}
										className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-700/50 text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20"
									>
										<Trash2 size={14} /> Xóa
									</button>
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