import React, { useState, useEffect, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  PlusCircle, Pencil, Trash2, Search, X, Save,
  Briefcase, MapPin, DollarSign, Users, ChevronDown, Loader2
} from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import { getMyJobPosts, createJob, updateJob, deleteJob } from '../../services/recruiterApi'
import { getRoadmaps } from '../../services/roadmapApi'
import { toast } from 'react-hot-toast'

const EMPTY_FORM = {
  title: '',
  description: '',
  location: '',
  salary: '',
  skills: [],
  tags: [],
  experienceLevel: '',
  targetRoadmapId: '',
}

const SKILL_OPTIONS = ['Unity', 'C#', 'Unreal', 'C++', 'OOP', 'Shader', 'VFX', 'AI', 'NavMesh', 'UI', 'Networking', 'Git']
const EXP_OPTIONS = ['Intern/Fresher', '1-3 năm', '3-5 năm', '5+ năm']

const RecruiterJobManager = () => {
  const { user } = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'create')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [roadmaps, setRoadmaps] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const navigate = useNavigate()

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await getMyJobPosts()
      setJobs(data?.data ?? [])
    } catch (e) {
      console.error('Error loading jobs:', e)
    } finally {
      setLoading(false)
    }
  }

  const loadRoadmaps = async () => {
    try {
      const data = await getRoadmaps({ creatorId: user?.id || user?._id, includeOfficial: true })
      setRoadmaps(Array.isArray(data) ? data : [])
    } catch { setRoadmaps([]) }
  }

  useEffect(() => { loadJobs(); loadRoadmaps() }, [user])

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleCreate()
      setSearchParams({})
    }
  }, [])

  const handleCreate = () => {
    setForm({ ...EMPTY_FORM })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (job) => {
    setForm({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      salary: job.salary || '',
      skills: job.skills || [],
      tags: job.tags || [],
      experienceLevel: job.experienceLevel || '',
      targetRoadmapId: job.targetRoadmapId || '',
    })
    setEditingId(job.id)
    setShowForm(true)
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bài đăng này? Tất cả đơn ứng tuyển liên quan cũng sẽ bị xóa.')) return
    try {
      await deleteJob(jobId)
      toast.success('Xóa bài đăng thành công!')
      await loadJobs()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề vị trí.'); return }
    // Salary validation: disallow alphabetic characters to avoid accidental text inputs
    if (form.salary && /[a-zA-Z]/.test(form.salary)) {
      toast.error('Mức lương không được chứa chữ cái. Vui lòng nhập số hoặc ký tự hợp lệ (ví dụ: $1,200 - $2,000).')
      return
    }
    setSaving(true)
    setSubmitError('')
    try {
      if (editingId) {
        await updateJob(editingId, form)
        toast.success('Cập nhật bài đăng thành công!')
      } else {
        await createJob(form)
        toast.success('Đăng bài mới thành công!')
      }

      // Reset and reload safely
      setShowForm(false)
      setEditingId(null)
      setForm({ ...EMPTY_FORM })
      try {
        await loadJobs()
      } catch (loadErr) {
        // show non-fatal load error
        console.error('Failed to refresh job list after submit', loadErr)
        setSubmitError('Lưu thành công nhưng không thể làm mới danh sách (vui lòng tải lại trang).')
      }
    } catch (err) {
      console.error('Job save failed', err)
      // Prefer server-provided message when available
      const serverMsg = err?.response?.data?.message || err?.message || 'Lưu thất bại.'
      setSubmitError(serverMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleSkillToggle = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleAddCustomSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }))
    }
    setSkillInput('')
  }

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, t] }))
    }
    setTagInput('')
  }

  const handleRemoveTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const filteredJobs = jobs.filter(j => {
    const title = (j.title || '').toString().toLowerCase()
    const location = (j.location || '').toString().toLowerCase()
    const term = (searchTerm || '').toString().toLowerCase()
    return title.includes(term) || location.includes(term)
  })

  // ─── Form Modal ───
  if (showForm) {
    return (
      <div>
        {submitError && (
          <div style={{ marginBottom: 12 }}>
            <div className="admin-card" style={{ padding: 12, border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.04)', color: '#ef4444' }}>
              <strong>Lỗi:</strong> {submitError}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', margin: 0 }}>
            {editingId ? 'Chỉnh sửa bài đăng' : 'Tạo bài đăng mới'}
          </h1>
          <button onClick={() => { setShowForm(false); setEditingId(null) }} className="admin-btn admin-btn-ghost">
            <X size={16} /> Hủy
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-card" style={{ padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Tiêu đề vị trí *</label>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="VD: Senior Unity Developer"
                />
              </div>

              {/* Location */}
              <div>
                <label className="admin-label">Địa điểm</label>
                <input
                  className="admin-input"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="VD: Hồ Chí Minh"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="admin-label">Mức lương</label>
                <input
                  className="admin-input"
                  value={form.salary}
                  onChange={e => {
                    // allow digits, currency symbols, dots, commas, dashes and spaces; strip other letters
                    const cleaned = e.target.value.replace(/[^0-9\$\.,\-\s]/g, '')
                    setForm(p => ({ ...p, salary: cleaned }))
                  }}
                  placeholder="VD: $1,200 - $2,000"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="admin-label">Kinh nghiệm</label>
                <select
                  className="admin-select"
                  value={form.experienceLevel}
                  onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}
                >
                  <option value="">Chọn cấp độ</option>
                  {EXP_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Target Roadmap */}
              <div>
                <label className="admin-label">Lộ trình đính kèm (Pathway)</label>
                <select
                  className="admin-select"
                  value={form.targetRoadmapId}
                  onChange={e => setForm(p => ({ ...p, targetRoadmapId: e.target.value }))}
                >
                  <option value="">Không đính kèm lộ trình</option>
                  {roadmaps.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} {r.isOfficial ? '(Official)' : '(Company)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="admin-label">Tags (Phân loại)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="admin-input"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag() } }}
                    placeholder="VD: Remote, Urgent..."
                  />
                  <button type="button" onClick={handleAddTag} className="admin-btn admin-btn-ghost admin-btn-sm">
                    Thêm
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {form.tags.map(t => (
                      <span key={t} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        background: 'rgba(245,158,11,0.12)', color: '#fbbf24',
                        border: '1px solid rgba(245,158,11,0.2)',
                      }}>
                        {t}
                        <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemoveTag(t)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Kỹ năng yêu cầu</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {SKILL_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      style={{
                        padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', border: '1px solid',
                        transition: 'all 0.15s ease',
                        background: form.skills.includes(skill) ? 'rgba(59,130,246,0.15)' : 'transparent',
                        borderColor: form.skills.includes(skill) ? 'rgba(59,130,246,0.4)' : 'var(--admin-border)',
                        color: form.skills.includes(skill) ? '#60a5fa' : 'var(--admin-text-muted)',
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="admin-input"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill() } }}
                    placeholder="Thêm kỹ năng khác..."
                    style={{ maxWidth: 260 }}
                  />
                  <button type="button" onClick={handleAddCustomSkill} className="admin-btn admin-btn-ghost admin-btn-sm">
                    Thêm
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {form.skills.map(s => (
                      <span key={s} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                        border: '1px solid rgba(59,130,246,0.2)',
                      }}>
                        {s}
                        <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleSkillToggle(s)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Mô tả công việc</label>
                <textarea
                  className="admin-textarea"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về vị trí, yêu cầu, quyền lợi..."
                  style={{ minHeight: 140 }}
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</> : <><Save size={16} /> {editingId ? 'Cập nhật' : 'Đăng bài'}</>}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="admin-btn admin-btn-ghost">
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  // ─── Job List ───
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', margin: 0 }}>Quản lý tuyển dụng</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            {filteredJobs.length} bài đăng
          </p>
        </div>
        <button onClick={handleCreate} className="admin-btn admin-btn-primary">
          <PlusCircle size={16} /> Tạo bài đăng
        </button>
      </div>

      {/* Search */}
      <div className="admin-search" style={{ marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} className="search-icon" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo vị trí, địa điểm..."
        />
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflowX: 'auto', overflowY: 'hidden' }}>
        {loading ? (
          <div className="admin-empty"><div className="admin-loader" /></div>
        ) : filteredJobs.length === 0 ? (
          <div className="admin-empty">
            <Briefcase size={40} />
            <p style={{ fontSize: 13, marginTop: 8 }}>
              {searchTerm ? 'Không tìm thấy bài đăng phù hợp' : 'Chưa có bài đăng nào'}
            </p>
          </div>
        ) : (
          <table className="admin-table recruiter-tight-table" style={{ minWidth: 838, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                  <th style={{ width: 180, fontSize: 10 }}>Vị trí</th>
                  <th style={{ width: 170, fontSize: 10 }}>Kỹ năng</th>
                  <th style={{ width: 130, fontSize: 10 }}>Địa điểm</th>
                  <th style={{ width: 120, fontSize: 10 }}>Lương</th>
                  <th style={{ width: 110, fontSize: 10 }}>Kinh nghiệm</th>
                  <th style={{ width: 90, fontSize: 10 }}>Ứng viên</th>
                  <th style={{ width: 100, fontSize: 10 }}>Ngày đăng</th>
                <th style={{ width: 120, textAlign: 'right', fontSize: 10 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                    <td style={{ verticalAlign: 'top' }}>
                      <p style={{ fontWeight: 600, color: 'var(--admin-text)', margin: 0, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</p>
                      {job.targetRoadmapId && (
                        <div style={{ marginTop: 4 }}>
                          <span className="admin-badge admin-badge-success" style={{ fontSize: 7, padding: '2px 6px', background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                            📍 Lộ trình: {roadmaps.find(r => r.id === job.targetRoadmapId)?.title || 'Đã liên kết'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: '100%', overflow: 'hidden', fontSize: 9 }}>
                          {(job.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="admin-badge admin-badge-info" style={{ fontSize: 7 }}>{s}</span>
                          ))}
                          {(job.skills || []).length > 3 && (
                          <span style={{ fontSize: 8, color: 'var(--admin-text-dim)' }}>+{job.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                  
                    <td style={{ color: 'var(--admin-text-muted)', verticalAlign: 'top', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 11 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {job.location || '—'}
                    </span>
                  </td>
                  <td style={{ color: '#34d399', fontWeight: 600, fontSize: 11, verticalAlign: 'top', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.salary || '—'}</td>
                  <td style={{ verticalAlign: 'top' }}>
                    <span className="admin-badge admin-badge-warning" style={{ fontSize: 8 }}>{job.experienceLevel || '—'}</span>
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <span className={`admin-badge ${(job.applicantCount || 0) > 0 ? 'admin-badge-success' : 'admin-badge-warning'}`} style={{ fontSize: 8 }}>
                      <Users size={10} style={{ marginRight: 4 }} />{job.applicantCount || 0}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: 10, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{job.postedAt}</td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                      <button onClick={() => handleEdit(job)} className="admin-btn admin-btn-ghost admin-btn-sm" title="Sửa">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="admin-btn admin-btn-danger admin-btn-sm" title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RecruiterJobManager
