import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Boxes,
  Search,
} from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import {
  getAllNodes,
  createNode,
  updateNode,
  deleteNode,
} from '../../services/adminApi'
import { toast } from 'react-hot-toast'

const emptyForm = {
  name: '',
  category: '',
  engine: '',
  description: '',
  parentId: '',
  resources: '',
  prerequisites: '',
}

const NodeManager = () => {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchNodes = async () => {
    setLoading(true)
    try {
      const data = await getAllNodes()
      setNodes(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch nodes:', e)
      setNodes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNodes()
  }, [])

  const openCreate = () => {
    setEditingNode(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (node) => {
    setEditingNode(node)
    setForm({
      name: node.name || '',
      category: node.category || '',
      engine: node.engine || '',
      description: node.description || '',
      parentId: node.parentId || '',
      resources: (node.resources || []).join(', '),
      prerequisites: (node.prerequisites || []).join(', '),
    })
    setModalOpen(true)
  }

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      category: form.category,
      engine: form.engine || null,
      description: form.description,
      parentId: form.parentId || null,
      resources: form.resources
        ? form.resources.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      prerequisites: form.prerequisites
        ? form.prerequisites.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    }

    try {
      if (editingNode) {
        const updated = await updateNode(
          editingNode.id || editingNode._id,
          payload
        )
        setNodes((prev) =>
          prev.map((n) =>
            (n.id || n._id) === (editingNode.id || editingNode._id)
              ? { ...n, ...payload, ...updated }
              : n
          )
        )
        toast.success('Cập nhật node thành công!')
      } else {
        const created = await createNode(payload)
        setNodes((prev) => [...prev, created])
        toast.success('Tạo node mới thành công!')
      }
      setModalOpen(false)
    } catch (e) {
      console.error('Failed to save node:', e)
      toast.error('Lưu thất bại. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteNode(deleteTarget.id || deleteTarget._id)
      setNodes((prev) =>
        prev.filter(
          (n) =>
            (n.id || n._id) !== (deleteTarget.id || deleteTarget._id)
        )
      )
      toast.success('Xóa node thành công!')
    } catch (e) {
      console.error('Failed to delete node:', e)
      toast.error('Xóa thất bại. Vui lòng thử lại.')
    }
    setDeleteTarget(null)
  }

  const categoryColors = {
    language: 'admin-badge-info',
    engine: 'admin-badge-info',
    gameplay: 'admin-badge-success',
    math: 'admin-badge-success',
    ai: 'admin-badge-warning',
    deploy: 'admin-badge-warning',
    network: 'admin-badge-danger',
  }

  const getBadgeClass = (category) => {
    if (!category) return 'admin-badge-info'
    const c = category.toLowerCase()
    for (const [key, cls] of Object.entries(categoryColors)) {
      if (c.includes(key)) return cls
    }
    return 'admin-badge-info'
  }

  const columns = [
    {
      key: 'name',
      label: 'Tên Node',
      width: 200,
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{val || '—'}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      width: 130,
      render: (val) =>
        val ? (
          <span className={`admin-badge ${getBadgeClass(val)}`}>{val}</span>
        ) : (
          <span style={{ color: 'var(--admin-text-dim)' }}>—</span>
        ),
    },
    {
      key: 'engine',
      label: 'Engine',
      width: 100,
      render: (val) => (
        <span style={{ color: val ? '#e2e8f0' : 'var(--admin-text-dim)' }}>
          {val || '—'}
        </span>
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
            maxWidth: 250,
          }}
        >
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'resources',
      label: 'Resources',
      width: 90,
      render: (val) => (
        <span style={{ color: 'var(--admin-text-muted)' }}>
          {Array.isArray(val) ? val.length : 0}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      width: 100,
      render: (_, row) => (
        <div
          style={{ display: 'flex', gap: 6 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => openEdit(row)}
            title="Sửa"
          >
            <Pencil size={14} />
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
            Nodes / Kỹ năng
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--admin-text-muted)',
              marginTop: 6,
            }}
          >
            Quản lý {nodes.length} node kỹ năng trong hệ thống
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Thêm node
        </button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={nodes}
        searchPlaceholder="Tìm theo tên, category, engine..."
        searchKeys={['name', 'category', 'engine', 'description']}
        pageSize={12}
        emptyMessage="Chưa có node nào"
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNode ? 'Chỉnh sửa Node' : 'Thêm Node mới'}
        maxWidth={560}
      >
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="admin-label">Tên Node *</label>
            <input
              className="admin-input"
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              placeholder="VD: C# Basics"
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div>
              <label className="admin-label">Category</label>
              <input
                className="admin-input"
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                placeholder="VD: language"
              />
            </div>
            <div>
              <label className="admin-label">Engine</label>
              <input
                className="admin-input"
                value={form.engine}
                onChange={(e) => handleFormChange('engine', e.target.value)}
                placeholder="VD: Unity"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Mô tả</label>
            <textarea
              className="admin-textarea"
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Mô tả chi tiết về kỹ năng..."
              rows={3}
            />
          </div>
          <div>
            <label className="admin-label">Parent ID</label>
            <input
              className="admin-input"
              value={form.parentId}
              onChange={(e) => handleFormChange('parentId', e.target.value)}
              placeholder="ID của node cha (để trống nếu là root)"
            />
          </div>
          <div>
            <label className="admin-label">
              Resources (phân tách bằng dấu phẩy)
            </label>
            <input
              className="admin-input"
              value={form.resources}
              onChange={(e) => handleFormChange('resources', e.target.value)}
              placeholder="https://link1.com, https://link2.com"
            />
          </div>
          <div>
            <label className="admin-label">
              Prerequisites (phân tách bằng dấu phẩy)
            </label>
            <input
              className="admin-input"
              value={form.prerequisites}
              onChange={(e) =>
                handleFormChange('prerequisites', e.target.value)
              }
              placeholder="node_id_1, node_id_2"
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
              marginTop: 8,
            }}
          >
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2
                    size={14}
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                  Đang lưu...
                </>
              ) : editingNode ? (
                'Cập nhật'
              ) : (
                'Tạo node'
              )}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete confirmation */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xác nhận xóa"
      >
        <p
          style={{
            fontSize: 14,
            color: 'var(--admin-text-muted)',
            margin: '0 0 20px',
          }}
        >
          Bạn có chắc chắn muốn xóa node{' '}
          <strong style={{ color: '#f87171' }}>
            "{deleteTarget?.name}"
          </strong>
          ? Các roadmap liên quan có thể bị ảnh hưởng.
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

export default NodeManager
