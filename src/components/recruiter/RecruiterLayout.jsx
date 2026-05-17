import React, { useState, useContext } from 'react'
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Users, LogOut,
  ArrowLeft, ChevronLeft, ChevronRight, Building2, Map,
  Sun, Moon
} from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import '../../styles/admin.css'

const menuItems = [
  { to: '/recruiter', icon: LayoutDashboard, label: 'Tổng quan', end: true },
  { to: '/recruiter/jobs', icon: Briefcase, label: 'Quản lý tuyển dụng' },
  { to: '/recruiter/applicants', icon: Users, label: 'Ứng viên' },
  { to: '/recruiter/roadmaps', icon: Map, label: 'Lộ trình tuyển dụng' },
]

const RecruiterLayout = ({ isDarkMode, toggleDarkMode }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  // Guard: require recruiter role (2)
  if (!isAuthenticated || user?.role !== 2) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--admin-bg)', color: 'var(--admin-text)',
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: collapsed ? 68 : 260,
          position: 'fixed', top: 0, left: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          zIndex: 40, overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          borderBottom: '1px solid var(--admin-border)',
          display: 'flex', alignItems: 'center', gap: 12,
          minHeight: 64,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                Trang quản lý
              </p>
              <p style={{ fontSize: 10, color: '#f59e0b', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tuyển dụng
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
              style={{ padding: collapsed ? '10px 12px' : '10px 16px', justifyContent: collapsed ? 'center' : 'flex-start' }}
              title={item.label}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--admin-border)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              border: '1px solid var(--admin-border)', background: 'transparent',
              color: 'var(--admin-text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Thu gọn</>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 68 : 260,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top bar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 56,
          borderBottom: '1px solid var(--admin-border)',
          background: 'var(--admin-header-bg)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => navigate('/')}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <ArrowLeft size={14} /> Về trang chính
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
                transition: 'all 0.15s ease'
              }}
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.userName?.charAt(0)?.toUpperCase() || 'R'}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text)', margin: 0, lineHeight: 1.2 }}>
                  {user?.fullName || user?.userName || 'Recruiter'}
                </p>
                <p style={{ fontSize: 10, color: '#f59e0b', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {user?.isApproved ? 'Đã xác thực' : 'Chờ duyệt'}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="admin-btn admin-btn-danger admin-btn-sm">
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-scroll" style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          {!user?.isApproved && (
            <div style={{
              padding: '16px 20px', marginBottom: 24, borderRadius: 12,
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              color: '#fbbf24', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ Tài khoản của bạn đang chờ Admin phê duyệt. Một số chức năng có thể bị giới hạn.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RecruiterLayout
