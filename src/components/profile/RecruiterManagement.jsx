import React, { useEffect, useState } from 'react'
import { Briefcase, Users, LayoutGrid, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getRecruiterStats } from '../../services/recruiterApi'
import RecruiterJobManager from '../../pages/recruiter/RecruiterJobManager'
import RecruiterApplicants from '../../pages/recruiter/RecruiterApplicants'
import ErrorBoundary from '../ErrorBoundary'

const RecruiterManagement = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('jobs')
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, activeJobs: 0 })

  useEffect(() => {
    let isMounted = true

    const loadStats = async () => {
      try {
        const data = await getRecruiterStats()
        if (isMounted) {
          setStats(data)
        }
      } catch {
        if (isMounted) {
          setStats({ totalJobs: 0, totalApplicants: 0, activeJobs: 0 })
        }
      }
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [])

  const tabItems = [
    { id: 'jobs', label: 'Bài đăng', icon: Briefcase },
    { id: 'applicants', label: 'Đơn ứng tuyển', icon: Users },
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
            Quản lý bài đăng, xem đơn ứng tuyển và xử lý trạng thái ứng tuyển ngay trong khu vực cá nhân.
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
          {activeTab === 'jobs' ? <RecruiterJobManager /> : <RecruiterApplicants />}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default RecruiterManagement
