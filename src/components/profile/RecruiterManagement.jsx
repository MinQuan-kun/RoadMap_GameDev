import React, { useEffect, useState, useContext } from 'react'
import { Briefcase, Users, LayoutGrid, Map, Pencil, Trash2, Link } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getRecruiterStats, getMyJobPosts } from '../../services/recruiterApi'
import { getRoadmaps, deleteRoadmap } from '../../services/roadmapApi'
import AuthContext from '../../context/AuthContext'
import RecruiterJobManager from '../../pages/recruiter/RecruiterJobManager'
import RecruiterApplicants from '../../pages/recruiter/RecruiterApplicants'
import ErrorBoundary from '../ErrorBoundary'
import { toast } from 'react-hot-toast'

const RecruiterManagement = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('jobs')
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, activeJobs: 0 })

  // Roadmaps and linked jobs states
  const [roadmaps, setRoadmaps] = useState([])
  const [jobs, setJobs] = useState([])
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(false)

  const loadStats = async () => {
    try {
      const data = await getRecruiterStats()
      setStats(data)
    } catch {
      setStats({ totalJobs: 0, totalApplicants: 0, activeJobs: 0 })
    }
  }

  const loadRoadmapsAndJobs = async () => {
    try {
      setLoadingRoadmaps(true)
      const creatorId = user?.id || user?._id || null
      const [roadmapsData, jobsData] = await Promise.all([
        getRoadmaps({ creatorId, includeOfficial: false }),
        getMyJobPosts()
      ])
      setRoadmaps(Array.isArray(roadmapsData) ? roadmapsData : [])
      setJobs(jobsData?.data ?? [])
    } catch (e) {
      console.error('Error loading roadmaps and jobs for recruiter:', e)
    } finally {
      setLoadingRoadmaps(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'roadmaps') {
      loadRoadmapsAndJobs()
    } else {
      loadStats()
    }
  }, [activeTab, user])

  const tabItems = [
    { id: 'jobs', label: 'Bài đăng', icon: Briefcase },
    { id: 'applicants', label: 'Đơn ứng tuyển', icon: Users },
    { id: 'roadmaps', label: 'Lộ trình tuyển dụng', icon: Map },
  ]

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
            <LayoutGrid size={14} /> Quản lý tuyển dụng
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Trang nhà tuyển dụng
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
            Quản lý bài đăng, xem đơn ứng tuyển, xây dựng và quản lý các lộ trình đính kèm cho từng vị trí.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[2rem] p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng bài đăng</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.totalJobs}</p>
        </div>
        <div className="rounded-[2rem] p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng ứng viên</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.totalApplicants}</p>
        </div>
        <div className="rounded-[2rem] p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bài đăng đang hoạt động</p>
          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{stats.activeJobs}</p>
        </div>
      </div>

      <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
        {tabItems.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] p-4 md:p-6">
        <ErrorBoundary>
          {activeTab === 'jobs' && <RecruiterJobManager />}
          {activeTab === 'applicants' && <RecruiterApplicants />}
          {activeTab === 'roadmaps' && (
            <div>
              {loadingRoadmaps ? (
                <div className="admin-empty"><div className="admin-loader" /></div>
              ) : roadmaps.length === 0 ? (
                <div className="admin-empty" style={{ padding: 40, textAlign: 'center' }}>
                  <Map size={40} className="text-slate-400 mx-auto" />
                  <p className="text-sm mt-3 text-slate-500">Chưa có lộ trình tuyển dụng nào được tạo.</p>
                  <button 
                    onClick={() => navigate('/profile', { state: { activeTab: 'CreateRoadmap' } })}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Tạo lộ trình tuyển dụng đầu tiên
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmaps.map(roadmap => {
                    const linkedJobs = jobs.filter(j => j.targetRoadmapId === roadmap.id || j.roadmapGraphId === roadmap.id)
                    return (
                      <div key={roadmap.id} className="rounded-2xl border border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">{roadmap.title}</h3>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                              Công ty / Lộ trình tuyển dụng
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate('/profile', { state: { activeTab: 'CreateRoadmap', editingRoadmapId: roadmap.id } })}
                              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10"
                              title="Sửa"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm('Bạn có chắc muốn xóa lộ trình này?')) return
                                try {
                                  await deleteRoadmap(roadmap.id)
                                  toast.success('Xóa lộ trình thành công!')
                                  loadRoadmapsAndJobs()
                                } catch {
                                  toast.error('Xóa thất bại.')
                                }
                              }}
                              className="p-2 rounded-xl border border-rose-200 dark:border-rose-700/50 text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                            <Link size={12} /> Công việc được gắn kèm ({linkedJobs.length})
                          </p>
                          {linkedJobs.length === 0 ? (
                            <p className="text-xs text-amber-500 font-semibold italic">Chưa được gắn với công việc nào.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {linkedJobs.map(job => (
                                <div key={job.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">{job.title}</span>
                                  <span className="text-[10px] text-slate-400">{job.location || 'Remote'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default RecruiterManagement
