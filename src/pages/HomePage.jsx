import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import HomeBanner from '../components/home/HomeBanner'

const roadmapSamples = [
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
]

const HomePage = ({ onOpenLogin, onOpenRegister, isDarkMode }) => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleBrowseJobs = () => {
    navigate('/Jobs')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white transition-colors duration-300">
      
      {/* BANNER */}
      <HomeBanner 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
        onBrowseJobs={handleBrowseJobs}
        isDarkMode={isDarkMode}
        lightImage="/Img/ligh_bg.png"
        darkImage="/Img/dark_bg.png"
        className="absolute inset-0 h-full w-full object-cover opacity-90 dark:opacity-40 transition-opacity duration-700"
      />

      {!isAuthenticated && (
        <section className="border-b border-white/5 px-4 py-12 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {['1. Take the Quiz', '2. Get Your Roadmap', '3. Find Your Job'].map((item, index) => (
              <div key={index} className="group flex flex-col items-center">
                <span className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-500">Step {index + 1}</span>
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-200 group-hover:text-white transition-colors">
                  {item.split('. ')[1]}
                </h3>
                <div className="mt-4 h-1 w-12 bg-white/10 group-hover:bg-blue-600 transition-all duration-300" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-20 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="mb-12 flex items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Example Roadmaps</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {roadmapSamples.map((roadmap) => (
            <article
              key={roadmap.title}
              className="group relative rounded-3xl border border-white/5 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className={`mb-6 h-1.5 w-16 rounded-full bg-gradient-to-r ${roadmap.accent}`} />
              
              <h3 className="mb-4 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {roadmap.title}
              </h3>
              
              <p className="mb-8 text-sm leading-relaxed text-slate-400">
                {roadmap.description}
              </p>
              
              <button 
                type="button" 
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                View roadmap 
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage