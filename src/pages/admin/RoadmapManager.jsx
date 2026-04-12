import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Eye, Pencil, Map, Loader2 } from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import { getAllRoadmaps, deleteRoadmap } from '../../services/adminApi'

const RoadmapManager = () => {
  const navigate = useNavigate()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchRoadmaps = async () => {
    setLoading(true)
    try {
      const data = await getAllRoadmaps()
      setRoadmaps(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch roadmaps:', e)
      setRoadmaps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteRoadmap(deleteTarget.id || deleteTarget._id)
      setRoadmaps((prev) =>
        prev.filter(
          (r) =>
            (r.id || r._id) !== (deleteTarget.id || deleteTarget._id)
        )
      )
    } catch (e) {
      console.error('Failed to delete roadmap:', e)
      alert('Xóa thất bại. Vui lòng thử lại.')
    }
    setDeleteTarget(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Tiêu đề',
      width: 220,
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{val || '—'}</span>
      ),
    },
    {
      key: 'engine',
      label: 'Engine',
      width: 120,
      render: (val) =>
        val ? (
          <span className="admin-badge admin-badge-info">{val}</span>
        ) : (
          <span style={{ color: 'var(--admin-text-dim)' }}>—</span>
        ),
    },
    {
      key: 'description',
      label: 'Mô tả',
      render: (val) => (
        <span
          style={{
            color: 'var(--admin-text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: 300,
          }}
        >
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: 130,
      render: (val) => (
        <span style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
          {val ? new Date(val).toLocaleDateString('vi-VN') : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      width: 120,
      render: (_, row) => (
        <div
          style={{ display: 'flex', gap: 6 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => navigate(`/roadmap/${row.id || row._id}`)}
            title="Xem"
          >
            <Eye size={14} />
          </button>
          <button
            className="admin-btn admin-btn-danger admin-btn-sm"
            onClick={() => setDeleteTarget(row)}
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
        }}
      >
        <Loader2
          size={32}
          style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#f1f5f9',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Roadmaps
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--admin-text-muted)',
              marginTop: 6,
            }}
          >
            Quản lý {roadmaps.length} lộ trình học tập
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/roadmap/builder')}
        >
          <Plus size={16} />
          Tạo roadmap mới
        </button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={roadmaps}
        searchPlaceholder="Tìm theo tiêu đề, engine..."
        searchKeys={['title', 'engine', 'description']}
        pageSize={10}
        emptyMessage="Chưa có roadmap nào"
      />

      {/* Delete confirmation modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xác nhận xóa"
      >
        <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', margin: '0 0 20px' }}>
          Bạn có chắc chắn muốn xóa roadmap{' '}
          <strong style={{ color: '#f87171' }}>
            "{deleteTarget?.title}"
          </strong>
          ? Hành động này không thể hoàn tác.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => setDeleteTarget(null)}
          >
            Hủy
          </button>
          <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
            <Trash2 size={14} />
            Xóa
          </button>
        </div>
      </AdminModal>
    </div>
  )
}

export default RoadmapManager
