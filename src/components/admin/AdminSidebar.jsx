import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Palette,
  Map,
  Boxes,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Plus
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/appearance', icon: Palette, label: 'Giao diện' },
  { to: '/admin/roadmaps', icon: Map, label: 'Quản lý lộ trình' },
  { to: '/admin/pathways/create', icon: Plus, label: 'Thiết kế lộ trình' },
  { to: '/admin/users', icon: Users, label: 'Quản lý tài khoản' },
]

const AdminSidebar = ({ collapsed, onToggle }) => {
  return (
    <aside
      className="admin-sidebar admin-scroll"
      style={{
        width: collapsed ? 68 : 240,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 20px',
          borderBottom: '1px solid var(--admin-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 64,
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg overflow-hidden"
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
          }}
        >
          <img
            src="/Img/logo.png"
            alt="GameNode Logo"
            className="object-contain"
            style={{
              width: 44,
              height: 44,
            }}
          />
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--admin-text)',
                letterSpacing: '-0.02em',
              }}
            >
              GameNode
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? '16px 10px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `admin-sidebar-item ${isActive ? 'active' : ''}`
            }
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px' : '10px 16px',
            }}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid var(--admin-border)',
        }}
      >
        <button
          onClick={onToggle}
          className="admin-sidebar-item"
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px' : '10px 16px',
          }}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside >
  )
}

export default AdminSidebar
