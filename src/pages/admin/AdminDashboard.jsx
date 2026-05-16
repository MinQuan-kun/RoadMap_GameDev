import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Map,
  Boxes,
  BookOpen,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Palette,
  Plus,
} from 'lucide-react'
import StatCard from '../../components/admin/StatCard'
import { getDashboardStats } from '../../services/adminApi'

const quickActions = [
  {
    icon: Palette,
    label: 'Chỉnh giao diện',
    desc: 'Thay đổi banner, tiêu đề trang',
    to: '/admin/appearance',
    color: '#8b5cf6',
  },
  {
    icon: BookOpen,
    label: 'Danh sách Lộ trình',
    desc: 'Quản lý các Pathway đã tạo',
    to: '/admin/roadmaps',
    color: '#3b82f6',
  },
  {
    icon: Plus,
    label: 'Thiết kế lộ trình',
    desc: 'Tạo cấu trúc Giai đoạn & Bài học',
    to: '/admin/pathways/create',
    color: '#10b981',
  },
  {
    icon: Users,
    label: 'Quản lý Users',
    desc: 'Xem, phân quyền tài khoản',
    to: '/admin/users',
    color: '#f59e0b',
  },
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPathways: 0,
    totalNodes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (e) {
        console.error('Failed to fetch stats:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: 'var(--admin-text)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--admin-text-muted)',
            marginTop: 6,
          }}
        >
          Tổng quan hệ thống GameNode
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          icon={Users}
          label="Người dùng"
          value={loading ? '—' : stats.totalUsers}
          color="indigo"
          delay={1}
        />
        <StatCard
          icon={BookOpen}
          label="Pathways"
          value={loading ? '—' : stats.totalPathways}
          color="blue"
          delay={2}
        />

      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--admin-text)',
            marginBottom: 16,
          }}
        >
          Hành động nhanh
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
          }}
        >
          {quickActions.map((action, idx) => (
            <button
              key={action.to}
              onClick={() => navigate(action.to)}
              className="admin-card animate-fade-in-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--admin-border)',
                animationDelay: `${idx * 0.05}s`,
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${action.color}15`,
                  border: `1px solid ${action.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--admin-text)',
                    margin: 0,
                  }}
                >
                  {action.label}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--admin-text-muted)',
                    margin: '2px 0 0',
                  }}
                >
                  {action.desc}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                style={{ color: 'var(--admin-text-dim)', flexShrink: 0 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity (placeholder) */}
      <div className="admin-card" style={{ padding: 24 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--admin-text)',
            marginBottom: 16,
            margin: 0,
          }}
        >
          Hoạt động gần đây
        </h2>
        <div
          className="admin-empty"
          style={{ padding: '40px 20px' }}
        >
          <TrendingUp size={40} />
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Chức năng theo dõi hoạt động sẽ được cập nhật sớm
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
