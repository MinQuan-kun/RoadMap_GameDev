import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  Search, Filter, ChevronRight,
  ChevronLeft, Clock, Banknote, CheckCircle2
} from 'lucide-react'
import AuthContext from '../context/AuthContext'
import { applyJob, getJobFilters, getJobs } from '../services/jobsApi'

const DEFAULT_SKILLS = ['Unity', 'Unreal', 'C#', 'C++']
const DEFAULT_EXPERIENCE_LEVELS = ['Intern/Fresher', '1-3 năm', '3-5 năm']

const JobSearch = ({ isDarkMode = false, onOpenLogin }) => {
  const { isAuthenticated, user } = useContext(AuthContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [experienceLevel, setExperienceLevel] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterMeta, setFilterMeta] = useState({
    skills: DEFAULT_SKILLS,
    experienceLevels: DEFAULT_EXPERIENCE_LEVELS,
  })
  const [applyingJobId, setApplyingJobId] = useState(null)

  const isRecruiter = user?.role === 2

  const totalPages = useMemo(() => {
    if (!total || !pageSize) return 1
    return Math.max(1, Math.ceil(total / pageSize))
  }, [total, pageSize])

  const pageNumbers = useMemo(() => {
    const maxVisible = 3
    const start = Math.max(1, Math.min(page - 1, totalPages - maxVisible + 1))
    const end = Math.min(totalPages, start + maxVisible - 1)
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [page, totalPages])

  useEffect(() => {
    const loadFilterMeta = async () => {
      try {
        const response = await getJobFilters()
        setFilterMeta({
          skills: response?.skills?.length ? response.skills : DEFAULT_SKILLS,
          experienceLevels: response?.experienceLevels?.length
            ? response.experienceLevels
            : DEFAULT_EXPERIENCE_LEVELS,
        })
      } catch {
        setFilterMeta({
          skills: DEFAULT_SKILLS,
          experienceLevels: DEFAULT_EXPERIENCE_LEVELS,
        })
      }
    }

    loadFilterMeta()
  }, [])

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getJobs({
        search: searchTerm.trim() || undefined,
        skills: selectedSkills.length ? selectedSkills.join(',') : undefined,
        experience: experienceLevel || undefined,
        sortBy,
        page,
        pageSize,
      })

      setJobs(response?.data ?? [])
      setTotal(response?.total ?? 0)
    } catch (e) {
      setJobs([])
      setTotal(0)
      setError(e?.response?.data || 'Không thể tải danh sách việc làm. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedSkills, experienceLevel, sortBy, page, pageSize])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadJobs()
    }, 350)

    return () => clearTimeout(timeout)
  }, [loadJobs])

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => (
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    ))
    setPage(1)
  }

  const handleClearFilters = () => {
    setSelectedSkills([])
    setExperienceLevel('')
    setSearchTerm('')
    setSortBy('newest')
    setPage(1)
  }

  const handleApplyJob = async (jobId) => {
    if (!isAuthenticated) {
      if (onOpenLogin) onOpenLogin()
      return
    }

    if (isRecruiter) {
      alert('Tài khoản nhà tuyển dụng không thể ứng tuyển công việc.')
      return
    }

    setApplyingJobId(jobId)
    try {
      await applyJob(jobId)
      await loadJobs()
      alert('Ứng tuyển thành công!')
    } catch (e) {
      const serverMessage = typeof e?.response?.data === 'string'
        ? e.response.data
        : 'Ứng tuyển thất bại. Vui lòng thử lại.'
      alert(serverMessage)
    } finally {
      setApplyingJobId(null)
    }
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#121212] dark:text-slate-100">

        {/* Top Search Bar */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md px-4 py-4 shadow-sm dark:border-white/10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all dark:border-white/10 dark:bg-white/5">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo vị trí tuyển dụng..."
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1)
                    setSearchTerm(e.target.value)
                  }}
                  className="w-full border-0 bg-transparent px-3 py-3.5 text-sm font-medium outline-none dark:text-white"
                />
              </div>
              <button type="button" className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
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
                <button onClick={handleClearFilters} className="text-xs font-bold text-blue-600 hover:underline">Xóa tất cả</button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Kỹ năng</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterMeta.skills.map((skill) => (
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
                    {filterMeta.experienceLevels.map((level) => (
                      <label key={level} className="flex cursor-pointer items-center gap-3 group">
                        <input
                          type="radio"
                          name="experience"
                          className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-200 dark:border-white/20 checked:bg-blue-600 transition-all"
                          checked={experienceLevel === level}
                          onChange={() => {
                            setExperienceLevel(level)
                            setPage(1)
                          }}
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
                    Tìm thấy <span className="text-blue-600 dark:text-blue-400">{total.toLocaleString('vi-VN')}</span> việc làm phù hợp
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp:</span>
                  <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        setSortBy('newest')
                        setPage(1)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'newest' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                      <Clock size={14} /> Mới nhất
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('salary')
                        setPage(1)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'salary' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                      <Banknote size={14} /> Lương cao nhất
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách Job Cards */}
              <div className="space-y-4">
                {loading && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-[#1e1e1e]">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Đang tải danh sách việc làm...</p>
                  </article>
                )}

                {!loading && error && (
                  <article className="rounded-3xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/60 dark:bg-rose-900/20">
                    <p className="text-sm font-bold text-rose-600 dark:text-rose-300">{error}</p>
                  </article>
                )}

                {!loading && !error && jobs.length === 0 && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-[#1e1e1e]">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Không có công việc phù hợp với bộ lọc hiện tại.</p>
                  </article>
                )}

                {!loading && !error && jobs.map((job) => (
                  <article key={job.id} className="group relative rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-white/5 dark:bg-[#1e1e1e]">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 dark:bg-white/5 dark:text-slate-400 group-hover:text-blue-600 transition-all">
                        {job.companyLogo
                          ? <img src={job.companyLogo} alt={job.companyName} className="h-10 w-10 rounded-lg object-cover" />
                          : (job.companyName || 'UN').slice(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{job.companyName}</h3>
                            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h2>
                            <div className="mt-2 flex items-center gap-3 w-full">
                              <p className="text-xs font-semibold text-slate-400">{job.location}</p>
                              <p className="ml-auto inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                {job.experienceLevel}
                              </p>
                            </div>
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
                              <div
                                className="h-full rounded-full bg-blue-600"
                                style={{ width: `${Math.max(0, Math.min(100, Number(job.matchingRate ?? 0)))}%` }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleApplyJob(job.id)}
                            disabled={applyingJobId === job.id || isRecruiter || job.hasApplied}
                            className={`w-full sm:w-auto flex items-center justify-center gap-1 rounded-xl px-8 py-2.5 text-sm font-black text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                              job.hasApplied 
                              ? 'bg-emerald-500' 
                              : 'bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'
                            }`}
                          >
                            {isRecruiter
                              ? 'Chế độ nhà tuyển dụng'
                              : job.hasApplied
                                ? 'Đã ứng tuyển'
                                : applyingJobId === job.id
                                  ? 'Đang xử lý...'
                                  : 'Ứng tuyển'} {job.hasApplied ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
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
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {pageNumbers.map((itemPage) => (
                      <button
                        key={itemPage}
                        onClick={() => setPage(itemPage)}
                        className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${itemPage === page
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'hover:bg-white dark:hover:bg-white/5 text-slate-500'
                          }`}
                      >
                        {itemPage}
                      </button>
                    ))}
                    {totalPages > 3 && <span className="px-2 text-slate-400">...</span>}
                    {totalPages > 3 && (
                      <button
                        onClick={() => setPage(totalPages)}
                        className="h-10 w-10 rounded-xl text-sm font-black text-slate-500 hover:bg-white dark:hover:bg-white/5 transition-all"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-500 transition-all disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trang {page} / {totalPages}
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