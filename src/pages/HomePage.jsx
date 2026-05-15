import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import HomeBanner from '../components/home/HomeBanner'
import apiClient from '../services/apiClient'
import { Loader2 } from 'lucide-react'
import { getSiteSettings } from '../services/adminApi'

const accentColors = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-indigo-500',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-orange-400',
  'from-amber-500 to-yellow-400'
];

const fallbackRoadmaps = [
  {
    title: 'Unity Game Developer',
    description: 'Lộ trình từ C#, gameplay systems đến phát hành game indie.',
    accent: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Unreal Gameplay Engineer',
    description: 'Tập trung C++, blueprints, optimization và hệ thống combat.',
    accent: 'from-violet-500 to-indigo-500'
  },
  {
    title: 'Technical Artist',
    description: 'Shader, lighting, animation pipeline và tool hỗ trợ artist.',
    accent: 'from-emerald-500 to-teal-400'
  }
];

const HomePage = ({ onOpenLogin, onOpenRegister, isDarkMode }) => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(getSiteSettings())

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const response = await apiClient.get('/Pathways')
        if (response.data && response.data.length > 0) {
          const mappedPathways = response.data.map((p, idx) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            description: p.description,
            accent: accentColors[idx % accentColors.length]
          }))
          setRoadmaps(mappedPathways)
        } else {
          setRoadmaps(fallbackRoadmaps)
        }
      } catch (error) {
        console.error("Lỗi khi tải Pathways:", error)
        setRoadmaps(fallbackRoadmaps)
      } finally {
        setLoading(false)
      }
    }
    fetchPathways()
  }, [])

  const handleBrowseJobs = () => {
    navigate('/Jobs')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-300">

      {/* BANNER */}
      <HomeBanner
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onBrowseJobs={handleBrowseJobs}
        isDarkMode={isDarkMode}
        settings={settings}
      />

      {!isAuthenticated && (
        <section className="relative border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02] px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { step: '01', title: 'Tham gia khảo sát', desc: 'Khảo sát nhanh về sở thích và trình độ hiện tại của bạn.' },
                { step: '02', title: 'Nhận lộ trình học tập', desc: 'Nhận lộ trình học tập cá nhân hoá dành riêng cho bạn.' },
                { step: '03', title: 'Tìm kiếm công việc', desc: 'Tìm kiếm công việc phù hợp với kỹ năng và lộ trình của bạn.' }
              ].map((item, index) => (
                <div key={index} className="group flex flex-col items-center">
                  <span className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500/60">{item.step}</span>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="mt-6 h-[2px] w-8 bg-slate-200 dark:bg-white/10 group-hover:w-16 group-hover:bg-blue-600 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-32 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Lộ Trình Unity và UnReal Engine</h2>
          </div>
          <div className="hidden md:block h-px flex-1 bg-slate-200 dark:bg-white/10 mx-8 mb-4" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <article
                key={roadmap.id || roadmap.title}
                className="group relative flex flex-col rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] glass overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${roadmap.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className={`mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${roadmap.accent} opacity-80 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/10`} >
                  <div className="h-6 w-6 bg-white/30 rounded-lg blur-sm" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {roadmap.title}
                </h3>

                <p className="mb-10 text-base leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3 font-medium">
                  {roadmap.description}
                </p>

                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (roadmap.slug) {
                        navigate(`/roadmap/${roadmap.slug}`)
                      } else if (roadmap.id) {
                        navigate(`/roadmap/${roadmap.id}`)
                      }
                    }}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group/btn"
                  >
                    View detailed path
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage