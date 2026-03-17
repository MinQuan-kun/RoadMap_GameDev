import React, { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

const mockJobs = [
  {
    id: 1,
    title: 'Role',
    company: 'Company',
    salary: 'Salary',
    required: 'Match score: 70%',
    badge: 'Check',
    score: 70
  },
  {
    id: 2,
    title: 'Gameplay Programmer',
    company: 'Studio North',
    salary: '$900 - $1,400',
    required: 'Match score: 64%',
    badge: 'Check',
    score: 64
  }
]

const JobSearch = ({ onOpenLogin, onOpenRegister }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [experienceLevel, setExperienceLevel] = useState('')

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => (
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    ))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#2b2b2b,#171717_55%)] text-slate-900">
      <div className="min-h-screen w-full overflow-hidden bg-white shadow-2xl shadow-black/20">

        <div className="border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-3 md:grid-cols-[160px_1fr_110px]">
              <button type="button" className="flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">
                <span>☰</span>
                <span>Danh mục</span>
              </button>

              <div className="flex items-center rounded-md border border-slate-300 bg-white px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm việc làm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-0 px-3 py-3 text-sm outline-none"
                />
              </div>

              <button type="button" className="rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Tìm kiếm
              </button>
            </div>
          </div>

        <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
            <aside className="border-r border-slate-200 px-4 py-5">
              <button type="button" className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </button>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold text-slate-700">Skills</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  {['Unity', 'Unreal'].map((skill) => (
                    <label key={skill} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-3.5 w-3.5 rounded border-slate-300"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">Experiences</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  {['5 năm', '3 năm', 'Mới bắt đầu'].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="experience"
                        value={level}
                        checked={experienceLevel === level}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="h-3.5 w-3.5 border-slate-300"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            <main className="space-y-4 px-4 py-5 sm:px-6 lg:px-8">
              {mockJobs.map((job) => (
                <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-[88px_1fr_120px] md:items-start">
                    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-500">
                      Image
                    </div>

                    <div>
                      <h2 className="text-[1.65rem] font-extrabold leading-none text-slate-800">{job.company}</h2>
                      <p className="mt-2 text-2xl font-bold text-slate-800">{job.title}</p>
                      <p className="mt-2 text-base font-semibold text-amber-500">{job.salary}</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-500">
                        <p>Required:</p>
                        <p>{job.required}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 w-56 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-green-600" style={{ width: `${job.score}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-12">
                      <button type="button" className="rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                        {job.badge}
                      </button>
                      <button type="button" className="text-base font-semibold text-blue-600 hover:underline">
                        Apply
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <div className="min-h-[130px] rounded-2xl border border-slate-200 bg-white shadow-sm" />

              <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
                <span>Trang 10</span>
                <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">1</button>
                <span>...</span>
                <button type="button" className="font-semibold text-slate-700">10</button>
              </div>
            </main>
        </div>
      </div>
    </div>
  )
}

export default JobSearch