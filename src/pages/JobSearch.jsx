import React, { useState } from 'react'
import {
  Search, MapPin, Filter, ChevronRight,
  CheckCircle2, ChevronLeft, ChevronRightSquare,
  ArrowUpDown, Clock, Banknote
} from 'lucide-react'

const JobSearch = ({ isDarkMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [experienceLevel, setExperienceLevel] = useState('')
  const [sortBy, setSortBy] = useState('newest') // State cho bộ lọc sắp xếp

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => (
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    ))
  }

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Unity Developer',
      company: 'GameLoft Vietnam',
      location: 'Hồ Chí Minh',
      salary: '$2,000 - $3,500',
      skills: ['Unity', 'C#', 'Shader'],
      score: 85,
      logo: 'GL',
      postedAt: '2 giờ trước'
    },
    {
      id: 2,
      title: 'Gameplay Programmer',
      company: 'Studio North',
      location: 'Hà Nội (Remote)',
      salary: '$900 - $1,400',
      skills: ['C++', 'Unreal Engine', 'Math'],
      score: 64,
      logo: 'SN',
      postedAt: '1 ngày trước'
    }
  ]

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans transition-colors duration-300`}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#121212] dark:text-slate-100">

        {/* Top Search Bar */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-4 shadow-sm dark:border-white/10 dark:bg-[#1e1e1e]/80">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all dark:border-white/10 dark:bg-white/5">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Vị trí, kỹ năng hoặc công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-0 bg-transparent px-3 py-3.5 text-sm font-medium outline-none dark:text-white"
                />
              </div>
              <button className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

            {/* Sidebar Filter */}
            <aside className="hidden lg:block space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" /> Bộ lọc
                </h2>
                <button className="text-xs font-bold text-blue-600 hover:underline">Xóa tất cả</button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Unity', 'Unreal', 'C#', 'C++'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedSkills.includes(skill)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'
                          }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Kinh nghiệm</h3>
                  <div className="space-y-3">
                    {['Intern/Fresher', '1-3 năm', '3-5 năm'].map((level) => (
                      <label key={level} className="flex cursor-pointer items-center gap-3 group">
                        <input
                          type="radio"
                          name="experience"
                          className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 dark:border-white/20 checked:bg-blue-600 transition-all"
                          onChange={() => setExperienceLevel(level)}
                        />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </aside>

            {/* Main Content */}
            <main className="space-y-6">

              {/* Kết quả tìm kiếm & Bộ lọc sắp xếp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Tìm thấy <span className="text-blue-600 dark:text-blue-400">1,240</span> việc làm phù hợp
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp:</span>
                  <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'newest' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                      <Clock size={14} /> Mới nhất
                    </button>
                    <button
                      onClick={() => setSortBy('salary')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'salary' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                      <Banknote size={14} /> Lương cao nhất
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách Job Cards */}
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <article key={job.id} className="group relative rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-white/5 dark:bg-[#1e1e1e]">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 dark:bg-white/5 dark:text-slate-400 group-hover:text-blue-600 transition-all">
                        {job.logo}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">{job.company}</h3>
                            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h2>
                          </div>
                          <div className="hidden md:block text-right">
                            <p className="text-lg font-black text-emerald-500">{job.salary}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">{job.postedAt}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {job.skills.map(skill => (
                            <span key={skill} className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600 dark:bg-white/5 dark:text-slate-400">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-5">
                          <div className="flex-1 hidden sm:block">
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10">
                              <div className="h-full rounded-full bg-blue-600" style={{ width: `${job.score}%` }} />
                            </div>
                          </div>
                          <button className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-black text-white hover:bg-blue-600 transition-all dark:bg-blue-600 dark:hover:bg-blue-700">
                            Ứng tuyển <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Section */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 py-8 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all disabled:opacity-30">
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${page === 1
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'hover:bg-white dark:hover:bg-white/5 text-slate-500'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <span className="px-2 text-slate-400">...</span>
                    <button className="h-10 w-10 rounded-xl text-sm font-black text-slate-500 hover:bg-white dark:hover:bg-white/5 transition-all">
                      12
                    </button>
                  </div>

                  <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-500 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trang 1 / 12
                </p>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobSearch