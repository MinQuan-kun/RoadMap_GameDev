import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Eye, Pencil, Map, Loader2, BookOpen, ShieldCheck, Globe, Save } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import { getAllPathways, deletePathway, createPathway, updatePathway, approvePathway } from '../../services/adminApi'
import toast from 'react-hot-toast'

const PathwayManager = () => {
  const navigate = useNavigate()
  const [pathways, setPathways] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ title: '', slug: '', description: '', difficulty: 'beginner', isOfficial: true })
  const [saving, setSaving] = useState(false)

  const fetchPathways = async () => {
    setLoading(true)
    try {
      const data = await getAllPathways()
      setPathways(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch pathways:', e)
      setPathways([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPathways()
  }, [])

  const handleOpenEdit = (pathway = null) => {
    if (pathway) {
      setEditTarget(pathway)
      setForm({
        title: pathway.title || '',
        slug: pathway.slug || '',
        description: pathway.description || '',
        difficulty: pathway.difficulty || 'beginner',
        isOfficial: pathway.isOfficial ?? true
      })
    } else {
      setEditTarget(null)
      setForm({ title: '', slug: '', description: '', difficulty: 'beginner', isOfficial: true })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editTarget) {
        await updatePathway(editTarget.id, form)
        toast.success('Đã cập nhật Pathway')
      } else {
        await createPathway(form)
        toast.success('Đã tạo Pathway mới')
      }
      fetchPathways()
      setEditTarget(null)
    } catch (err) {
      toast.error('Thao tác thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePathway(deleteTarget.id || deleteTarget._id)
      toast.success('Đã xóa Pathway')
      fetchPathways()
    } catch (e) {
      toast.error('Xóa thất bại')
    }
    setDeleteTarget(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Tiêu đề',
      width: 220,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={16} style={{ color: '#818cf8' }} />
          </div>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--admin-text)', display: 'block' }}>{val || '—'}</span>
            <span style={{ fontSize: 10, color: 'var(--admin-text-dim)' }}>/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      label: 'Độ khó',
      width: 120,
      render: (val) => (
        <span className={`admin-badge ${val === 'beginner' ? 'admin-badge-success' : val === 'intermediate' ? 'admin-badge-primary' : 'admin-badge-warning'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'isOfficial',
      label: 'Loại',
      width: 120,
      render: (val) => (
        val ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: 12, fontWeight: 600 }}>
            <ShieldCheck size={14} /> Chính thức
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--admin-text-dim)', fontSize: 12 }}>
            <Globe size={14} /> Cộng đồng
          </span>
        )
      ),
    },
    {
      key: 'isApproved',
      label: 'Phê duyệt',
      width: 160,
      render: (val, row) => {
        if (row.isOfficial) {
          return (
            <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>
              Tự động duyệt
            </span>
          )
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`admin-badge ${val ? 'admin-badge-success' : 'admin-badge-warning'}`}>
              {val ? 'Đã duyệt' : 'Chưa duyệt'}
            </span>
            <button
              onClick={async () => {
                try {
                  const targetApproved = !val
                  await approvePathway(row.id || row._id, targetApproved)
                  toast.success(targetApproved ? 'Đã phê duyệt lộ trình!' : 'Đã hủy phê duyệt!')
                  fetchPathways()
                } catch (e) {
                  toast.error('Cập nhật trạng thái duyệt thất bại!')
                }
              }}
              style={{
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                background: val ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: val ? '#f87171' : '#34d399',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {val ? 'Hủy' : 'Duyệt'}
            </button>
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      width: 150,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(`/roadmap/${row.slug}`)} title="Xem đồ thị">
            <Map size={14} />
          </button>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => navigate(`/admin/pathways/edit/${row.id || row._id}`)} title="Chỉnh sửa chuyên sâu">
            <Pencil size={14} />
          </button>
          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(row)} title="Xóa">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Loader2 size={32} className="animate-spin" style={{ color: '#6366f1' }} />
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Lộ Trình Học Tập</h1>
          <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', marginTop: 6 }}>Quản lý {pathways.length} Pathways</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/pathways/create')}>
          <Plus size={16} /> Tạo Pathway mới
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={pathways}
        searchPlaceholder="Tìm theo tiêu đề, slug..."
        searchKeys={['title', 'slug', 'description']}
        pageSize={10}
        emptyMessage="Chưa có lộ trình nào"
      />

      {/* Edit Modal */}
      <AdminModal isOpen={!!editTarget || (saving && !editTarget)} onClose={() => setEditTarget(null)} title={editTarget ? 'Chỉnh sửa Pathway' : 'Tạo Pathway mới'}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="admin-label">Tiêu đề</label>
            <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Slug (đường dẫn)</label>
            <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Mô tả</label>
            <textarea className="admin-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="admin-label">Độ khó</label>
              <select className="admin-input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
              <input type="checkbox" id="isOfficial" checked={form.isOfficial} onChange={(e) => setForm({ ...form, isOfficial: e.target.checked })} />
              <label htmlFor="isOfficial" className="admin-label" style={{ margin: 0 }}>Lộ trình chính thức</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditTarget(null)}>Hủy</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editTarget ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete confirmation */}
      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Xác nhận xóa">
        <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', margin: '0 0 20px' }}>
          Bạn có chắc chắn muốn xóa pathway <strong style={{ color: '#f87171' }}>"{deleteTarget?.title}"</strong>?
          Tất cả dữ liệu khóa học liên quan vẫn sẽ tồn tại nhưng không còn thuộc về lộ trình này.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteTarget(null)}>Hủy</button>
          <button className="admin-btn admin-btn-danger" onClick={handleDelete}><Trash2 size={14} /> Xóa</button>
        </div>
      </AdminModal>
    </div>
  )
}

export default PathwayManager
