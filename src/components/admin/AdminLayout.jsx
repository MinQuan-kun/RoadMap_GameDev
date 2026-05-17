import React, { useState, useContext } from 'react'
import { Outlet, useNavigate, Navigate } from 'react-router-dom'
import { LogOut, ArrowLeft, Sun, Moon } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import '../../styles/admin.css'

const AdminLayout = ({ isDarkMode, toggleDarkMode }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  // Guard: require authentication and admin role (Role 0 = Admin)
  if (!isAuthenticated || user?.role !== 0) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--admin-bg)',
        color: 'var(--admin-text)',
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? 68 : 240,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            height: 56,
            borderBottom: '1px solid var(--admin-border)',
            background: 'var(--admin-header-bg)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--admin-border)',
              background: 'transparent',
              color: 'var(--admin-text-muted)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--admin-text)'
              e.currentTarget.style.borderColor = 'var(--admin-border-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--admin-text-muted)'
              e.currentTarget.style.borderColor = 'var(--admin-border)'
            }}
          >
            <ArrowLeft size={14} />
            Về trang chính
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
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
                {user?.username?.charAt(0)?.toUpperCase() ||
                  user?.fullName?.charAt(0)?.toUpperCase() ||
                  'A'}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--admin-text)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.fullName || user?.username || 'Admin'}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: '#6366f1',
                    margin: 0,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Administrator
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--admin-border)',
                background: 'transparent',
                color: 'var(--admin-text-muted)',
                transition: 'all 0.15s ease',
                marginRight: 8
              }}
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
              }}
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="admin-scroll"
          style={{
            flex: 1,
            padding: 28,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
