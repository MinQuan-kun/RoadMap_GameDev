import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

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

const HomePage = ({ onOpenLogin, onOpenRegister }) => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleStartQuiz = () => {
    if (isAuthenticated) {
      alert('Quiz functionality coming soon!')
    } else {
      onOpenLogin()
    }
  }

  const handleBrowseJobs = () => {
    navigate('/jobs')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#2b2b2b,#171717_55%)] text-slate-900">
      <div className="min-h-screen w-full overflow-hidden bg-white shadow-2xl shadow-black/20">

          <section className="border-b border-slate-200 bg-[#dfeaf8] px-4 py-10 sm:px-6 lg:px-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-slate-900">
                  Website Title
                </h1>
                {isAuthenticated ? (
                  <p className="mb-8 max-w-lg text-base text-slate-600">
                    Chào {user?.fullName || user?.username || 'bạn'}, tiếp tục khám phá việc làm phù hợp với roadmap bạn đang theo đuổi.
                  </p>
                ) : (
                  <p className="mb-8 max-w-lg text-base text-slate-600">
                    Bắt đầu bằng bài quiz định hướng, nhận lộ trình học cá nhân hoá rồi tìm công việc game dev phù hợp.
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {!isAuthenticated && (
                    <button
                      type="button"
                      onClick={handleStartQuiz}
                      className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Start Carrer Quiz
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleBrowseJobs}
                    className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Browse Jobs
                  </button>
                  {!isAuthenticated && (
                    <button
                      type="button"
                      onClick={onOpenRegister}
                      className="rounded-md bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Create Account
                    </button>
                  )}
                </div>
              </div>

              <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_35%),linear-gradient(135deg,#cfe0fa,#b9d1f8)] p-6">
                <div className="absolute right-10 top-8 rounded-2xl bg-[#365fd6] px-6 py-3 text-2xl font-bold text-white shadow-lg rotate-[-6deg]">
                  Unity
                </div>
                <div className="absolute right-4 top-24 rounded-xl bg-[#5f7ee8] px-4 py-2 text-sm font-semibold text-white shadow">
                  Learn C#
                </div>
                <div className="absolute right-12 top-40 rounded-xl bg-[#3ea8c5] px-4 py-2 text-sm font-semibold text-white shadow">
                  Build a Game
                </div>
                <div className="absolute right-6 bottom-8 rounded-xl bg-[#3f5ea8] px-4 py-2 text-sm font-semibold text-white shadow">
                  Apply for Jobs
                </div>
                <div className="absolute left-10 bottom-0 h-20 w-20 rounded-full bg-emerald-200/70 blur-sm" />
                <div className="absolute left-16 top-14 text-7xl">🎧</div>
                <div className="absolute left-20 top-28 text-8xl">👨‍💻</div>
              </div>
            </div>
          </section>

          {!isAuthenticated && (
            <section className="border-b border-slate-200 px-4 py-8 sm:px-6 lg:px-10">
              <div className="grid grid-cols-3 gap-6 text-center text-slate-700">
                {['1. Take the Quiz', '2. Get Your Roadmap', '3. Find Your Job'].map((item) => (
                  <div key={item} className="border-b border-slate-200 pb-4 text-3xl font-extrabold tracking-tight text-slate-700 md:text-4xl">
                    <span className="block text-lg md:text-[2rem]">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="px-4 py-8 sm:px-6 lg:px-10">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-2xl font-extrabold text-slate-700">Example Roadmaps:</h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {roadmapSamples.map((roadmap) => (
                <article
                  key={roadmap.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${roadmap.accent}`} />
                  <h3 className="mb-2 text-lg font-bold text-slate-800">{roadmap.title}</h3>
                  <p className="mb-4 text-sm leading-6 text-slate-500">{roadmap.description}</p>
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View roadmap →
                  </button>
                </article>
              ))}
            </div>
          </section>

          <footer className="px-4 py-10 text-sm font-semibold text-slate-500 sm:px-6 lg:px-10">
            
          </footer>
      </div>
    </div>
  )
}

export default HomePage