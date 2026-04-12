import React, { useState, useEffect } from 'react'
import {
  Loader2,
  Trash2,
  Pencil,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import { getUsers, updateUser, deleteUser } from '../../services/adminApi'

const UserManager = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch users:', e)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openEdit = (user) => {
    setEditTarget(user)
    setEditForm({
      userName: user.userName || user.username || '',
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role ?? 1,
      bio: user.bio || '',
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editTarget) return
    setSaving(true)
    try {
      await updateUser(editTarget.id || editTarget._id, editForm)
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === (editTarget.id || editTarget._id)
            ? { ...u, ...editForm }
            : u
        )
      )
      setEditTarget(null)
    } catch (e) {
      console.error('Failed to update user:', e)
      alert('Cập nhật thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id || deleteTarget._id)
      setUsers((prev) =>
        prev.filter(
          (u) =>
            (u.id || u._id) !== (deleteTarget.id || deleteTarget._id)
        )
      )
    } catch (e) {
      console.error('Failed to delete user:', e)
      alert('Xóa thất bại.')
    }
    setDeleteTarget(null)
  }

  const columns = [
    {
      key: 'avatar',
      label: '',
      sortable: false,
      width: 40,
      render: (_, row) => (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {(row.userName || row.username || row.fullName || 'U')
            .charAt(0)
            .toUpperCase()}
        </div>
      ),
    },
    {
      key: 'userName',
      label: 'Username',
      width: 150,
      render: (val, row) => (
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
          {val || row.username || '—'}
        </span>
      ),
    },
    {
      key: 'fullName',
      label: 'Họ tên',
      width: 180,
      render: (val) => (
        <span style={{ color: val ? '#e2e8f0' : 'var(--admin-text-dim)' }}>
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: 220,
      render: (val) => (
        <span style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Vai trò',
      width: 100,
      render: (val) => {
        const isAdmin = val === 0 || val === 'admin'
        return (
          <span
            className={`admin-badge ${
              isAdmin ? 'admin-badge-warning' : 'admin-badge-success'
            }`}
          >
            {isAdmin ? (
              <><ShieldCheck size={10} style={{ marginRight: 4 }} /> Admin</>
            ) : (
              'User'
            )}
          </span>
        )
      },
    },
    {
      key: 'createAt',
      label: 'Ngày tạo',
      width: 120,
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
            Tài khoản
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--admin-text-muted)',
              marginTop: 6,
            }}
          >
            Quản lý {users.length} người dùng
          </p>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={users}
        searchPlaceholder="Tìm theo username, email, họ tên..."
        searchKeys={['userName', 'username', 'fullName', 'email']}
        pageSize={10}
        emptyMessage="Chưa có người dùng nào"
      />

      {/* Edit modal */}
      <AdminModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Chỉnh sửa người dùng"
      >
        <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              value={editForm.userName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, userName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="admin-label">Họ tên</label>
            <input
              className="admin-input"
              value={editForm.fullName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, fullName: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="admin-label">Email</label>
            <input
              className="admin-input"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="admin-label">Vai trò</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`admin-btn ${
                  editForm.role === 1 ? 'admin-btn-primary' : 'admin-btn-ghost'
                }`}
                onClick={() =>
                  setEditForm((f) => ({ ...f, role: 1 }))
                }
              >
                <Users size={14} />
                User
              </button>
              <button
                type="button"
                className={`admin-btn ${
                  editForm.role === 0 ? 'admin-btn-primary' : 'admin-btn-ghost'
                }`}
                onClick={() =>
                  setEditForm((f) => ({ ...f, role: 0 }))
                }
              >
                <Shield size={14} />
                Admin
              </button>
            </div>
          </div>
          <div>
            <label className="admin-label">Bio</label>
            <textarea
              className="admin-textarea"
              value={editForm.bio}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, bio: e.target.value }))
              }
              rows={3}
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
              onClick={() => setEditTarget(null)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <Loader2
                  size={14}
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              ) : (
                'Cập nhật'
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
          Bạn có chắc chắn muốn xóa tài khoản{' '}
          <strong style={{ color: '#f87171' }}>
            "{deleteTarget?.userName || deleteTarget?.username}"
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

export default UserManager
