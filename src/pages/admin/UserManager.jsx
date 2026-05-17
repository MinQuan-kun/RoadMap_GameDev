import React, { useState, useEffect } from 'react'
import {
  Loader2,
  Trash2,
  Pencil,
  Shield,
  ShieldCheck,
  Users,
  Key,
} from 'lucide-react'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import { getUsers, updateUser, deleteUser, approveRecruiter, rejectRecruiter, resetUserPassword } from '../../services/adminApi'
import { toast } from 'react-hot-toast'

const UserManager = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [resetTarget, setResetTarget] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)

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
      userName: user.userName || '',
      displayName: user.displayName || '',
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
      toast.error('Cập nhật thất bại.')
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
      toast.success('Xóa người dùng thành công!')
    } catch (e) {
      console.error('Failed to delete user:', e)
      toast.error('Xóa thất bại.')
    }
    setDeleteTarget(null)
  }

  const handleApprove = async (user) => {
    try {
      await approveRecruiter(user.id || user._id)
      setUsers((prev) => prev.map((u) => ((u.id || u._id) === (user.id || user._id) ? { ...u, isApproved: true } : u)))
      toast.success('Đã duyệt tài khoản Nhà tuyển dụng!')
    } catch (e) {
      toast.error('Duyệt thất bại.')
    }
  }

  const handleReject = async (user) => {
    try {
      await rejectRecruiter(user.id || user._id)
      setUsers((prev) => prev.map((u) => ((u.id || u._id) === (user.id || user._id) ? { ...u, isApproved: false } : u)))
      toast.success('Đã hủy duyệt tài khoản!')
    } catch (e) {
      toast.error('Hủy duyệt thất bại.')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!resetTarget || !newPassword) return
    if (newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự.')
      return
    }
    setResetting(true)
    try {
      await resetUserPassword(resetTarget.id || resetTarget._id, newPassword)
      toast.success('Đã đặt lại mật khẩu thành công!')
      setResetTarget(null)
      setNewPassword('')
    } catch (e) {
      console.error('Failed to reset password:', e)
      toast.error(e.response?.data || 'Đặt lại mật khẩu thất bại.')
    } finally {
      setResetting(false)
    }
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
        <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
          {val || row.username || '—'}
        </span>
      ),
    },
    {
      key: 'displayName',
      label: 'Tên hiển thị',
      width: 180,
      render: (val) => (
        <span style={{ color: val ? 'var(--admin-text)' : 'var(--admin-text-dim)' }}>
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
      width: 120,
      render: (val, row) => {
        const isAdmin = val === 0 || val === 'Admin'
        const isRecruiter = val === 2 || val === 'Recruiter'
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              className={`admin-badge ${isAdmin ? 'admin-badge-warning' : isRecruiter ? 'admin-badge-primary' : 'admin-badge-success'
                }`}
            >
              {isAdmin ? (
                <><ShieldCheck size={10} style={{ marginRight: 4 }} /> Admin</>
              ) : isRecruiter ? (
                <><Users size={10} style={{ marginRight: 4 }} /> Tuyển dụng</>
              ) : (
                'User'
              )}
            </span>
            {isRecruiter && (
              <span style={{ fontSize: 10, color: row.isApproved ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {row.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
              </span>
            )}
          </div>
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
      width: 130,
      render: (_, row) => {
        const isRecruiter = row.role === 2 || row.role === 'Recruiter'
        return (
          <div
            style={{ display: 'flex', gap: 6 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isRecruiter && !row.isApproved && (
              <button
                className="admin-btn admin-btn-success admin-btn-sm"
                onClick={() => handleApprove(row)}
                title="Duyệt tài khoản"
                style={{ padding: '0 6px', background: '#10b98120', color: '#10b981', borderColor: '#10b98140' }}
              >
                <ShieldCheck size={14} />
              </button>
            )}
            {isRecruiter && row.isApproved && (
              <button
                className="admin-btn admin-btn-warning admin-btn-sm"
                onClick={() => handleReject(row)}
                title="Hủy duyệt"
                style={{ padding: '0 6px', background: '#f59e0b20', color: '#f59e0b', borderColor: '#f59e0b40' }}
              >
                <Shield size={14} />
              </button>
            )}
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => openEdit(row)}
              title="Sửa"
            >
              <Pencil size={14} />
            </button>
            <button
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => {
                setResetTarget(row)
                setNewPassword('')
              }}
              title="Đặt lại mật khẩu"
              style={{ color: '#fbbf24' }}
            >
              <Key size={14} />
            </button>
            <button
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => setDeleteTarget(row)}
              title="Xóa"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )
      },
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
              color: 'var(--admin-text)',
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
            <label className="admin-label">Tên hiển thị</label>
            <input
              className="admin-input"
              value={editForm.displayName}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, displayName: e.target.value }))
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
                className={`admin-btn ${editForm.role === 1 ? 'admin-btn-primary' : 'admin-btn-ghost'
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
                className={`admin-btn ${editForm.role === 2 ? 'admin-btn-primary' : 'admin-btn-ghost'
                  }`}
                onClick={() =>
                  setEditForm((f) => ({ ...f, role: 2 }))
                }
              >
                <Users size={14} />
                Tuyển dụng
              </button>
              <button
                type="button"
                className={`admin-btn ${editForm.role === 0 ? 'admin-btn-primary' : 'admin-btn-ghost'
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

      {/* Reset Password Modal */}
      <AdminModal
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title="Đặt lại mật khẩu"
      >
        <form onSubmit={handleResetPassword} style={{ display: 'grid', gap: 16 }}>
          <p
            style={{
              fontSize: 14,
              color: 'var(--admin-text-muted)',
              margin: '0',
            }}
          >
            Đặt lại mật khẩu cho tài khoản{' '}
            <strong style={{ color: '#38bdf8' }}>
              "{resetTarget?.userName || resetTarget?.username}"
            </strong>.
          </p>
          <div>
            <label className="admin-label">Mật khẩu mới</label>
            <input
              className="admin-input"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
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
              onClick={() => setResetTarget(null)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={resetting || !newPassword}
              style={{ background: '#eab308', color: '#1e293b' }}
            >
              {resetting ? (
                <Loader2
                  size={14}
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              ) : (
                'Đặt lại mật khẩu'
              )}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  )
}

export default UserManager
