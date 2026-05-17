import React, { useContext, useState, useEffect } from 'react'
import {
  Target, Clock, Trophy, ArrowUpRight, Gamepad2, Code2, Star,
  Timer, Map
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AuthContext from "../../context/AuthContext";
import { getRoadmaps } from '../../services/roadmapApi'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  const creatorId = user?.id || user?._id || null

  useEffect(() => {
    const loadRoadmaps = async () => {
      if (!creatorId) { setLoading(false); return }
      try {
        const data = await getRoadmaps(creatorId)
        setRoadmaps(Array.isArray(data) ? data : [])
      } catch { setRoadmaps([]) }
      finally { setLoading(false) }
    }
    loadRoadmaps()
  }, [creatorId])

  const completedCount = user?.completedNodes?.length || 0
  const skillsCount = user?.skills?.length || 0
  const roadmapCount = roadmaps.length

  const stats = [
    { label: 'Roadmaps theo đuổi', value: loading ? '—' : String(roadmapCount).padStart(2, '0'), icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Kỹ năng', value: String(skillsCount).padStart(2, '0'), icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Nodes hoàn thành', value: String(completedCount).padStart(2, '0'), icon: Code2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Tiến độ', value: `${Math.min(completedCount * 5, 100)}%`, icon: Timer, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  // Lấy roadmap gần nhất để hiển thị
  const latestRoadmap = roadmaps.length > 0 ? roadmaps[roadmaps.length - 1] : null
  const progress = completedCount > 0 ? Math.min(completedCount * 5, 100) : 0

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Chào mừng trở lại, {user?.fullName || user?.userName || 'User'}! 👋
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="group p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:border-blue-500/30">
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {latestRoadmap ? 'Đang học' : 'Bắt đầu ngay'}
                  </span>
                  <h3 className="text-2xl font-bold mt-2">
                    {latestRoadmap?.title || 'Chưa có roadmap'}
                  </h3>
                </div>
                {latestRoadmap && (
                  <button
                    onClick={() => navigate(`/roadmap/${latestRoadmap.id}`)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:rotate-45"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Tiến độ tổng quát</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <p className="text-xs text-blue-100 font-semibold uppercase tracking-tighter">Nodes hoàn thành</p>
                  <p className="text-sm font-bold mt-1">{completedCount} nodes</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <p className="text-xs text-blue-100 font-semibold uppercase tracking-tighter">Kỹ năng đã học</p>
                  <p className="text-sm font-bold mt-1">{skillsCount} kỹ năng</p>
                </div>
              </div>
            </div>
            <Gamepad2 className="absolute -right-8 -bottom-8 h-48 w-48 text-white/5 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-7 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={20} /> Gợi ý cho bạn
            </h3>
            <div className="space-y-5">
              {latestRoadmap ? (
                <div className="group cursor-pointer p-1" onClick={() => navigate(`/roadmap/${latestRoadmap.id}`)}>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em]">Lộ trình</p>
                  <p className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1 underline-offset-4 group-hover:underline">
                    {latestRoadmap.title}
                  </p>
                </div>
              ) : (
                <div className="group cursor-pointer p-1" onClick={() => navigate('/quiz')}>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em]">Bắt đầu</p>
                  <p className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1 underline-offset-4 group-hover:underline">
                    Làm khảo sát để nhận roadmap
                  </p>
                </div>
              )}
              <div className="group cursor-pointer p-1" onClick={() => navigate('/Jobs')}>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em]">Việc làm</p>
                <p className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1 underline-offset-4 group-hover:underline">
                  Khám phá cơ hội tuyển dụng
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-[2.5rem] bg-white dark:bg-blue-600/5 border border-slate-200 dark:border-blue-500/20 shadow-inner">
            <h3 className="text-lg font-bold mb-4">Lộ trình của bạn</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">
              {(roadmapCount > 0 || user?.hasCompletedQuiz)
                ? `Bạn đang theo học lộ trình phát triển. Hãy tiếp tục hoàn thành!`
                : 'Bạn chưa có lộ trình nào. Bắt đầu bằng bài khảo sát!'}
            </p>
            <button
              onClick={() => navigate((roadmapCount > 0 || user?.hasCompletedQuiz) ? '/profile' : '/quiz')}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              {(roadmapCount > 0 || user?.hasCompletedQuiz) ? 'XEM ROADMAP' : 'LÀM KHẢO SÁT NGAY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard