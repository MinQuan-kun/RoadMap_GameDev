import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Users, TrendingUp, PlusCircle,
  ArrowUpRight, FileText, Eye
} from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import { getMyJobPosts } from '../../services/recruiterApi'

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0 })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyJobPosts()
        const jobs = data?.data ?? []
        const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)
        setStats({ totalJobs: data?.total ?? 0, totalApplicants })
        setRecentJobs(jobs.slice(0, 5))
      } catch (e) {
        console.error('Failed to load recruiter data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Tổng bài đăng', value: stats.totalJobs, icon: Briefcase, color: '#3b82f6' },
    { label: 'Tổng ứng viên', value: stats.totalApplicants, icon: Users, color: '#10b981' },
    { label: 'Tỉ lệ phản hồi', value: '—', icon: TrendingUp, color: '#f59e0b' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--admin-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Xin chào, {user?.fullName || 'Nhà tuyển dụng'}! 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--admin-text-muted)', marginTop: 6 }}>
          Quản lý bài đăng tuyển dụng và ứng viên của bạn
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="stat-card animate-fade-in-up"
            style={{ background: 'var(--admin-card)', animationDelay: `${idx * 0.05}s` }}
          >
            <div className="stat-glow" style={{ background: stat.color }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-text-dim)', margin: 0 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--admin-text)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>
                {loading ? '—' : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => navigate('/recruiter/jobs?action=create')}
          className="admin-card animate-fade-in-up"
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            textAlign: 'left', cursor: 'pointer',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            background: 'rgba(59, 130, 246, 0.05)',
            padding: '18px 20px',
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PlusCircle size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', margin: 0 }}>Đăng tin tuyển dụng</p>
            <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '2px 0 0' }}>Tạo bài đăng mới</p>
          </div>
          <ArrowUpRight size={16} style={{ color: 'var(--admin-text-dim)', flexShrink: 0 }} />
        </button>

        <button
          onClick={() => navigate('/recruiter/applicants')}
          className="admin-card animate-fade-in-up"
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            textAlign: 'left', cursor: 'pointer',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '18px 20px', animationDelay: '0.05s',
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Eye size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', margin: 0 }}>Xem ứng viên</p>
            <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '2px 0 0' }}>Quản lý hồ sơ ứng tuyển</p>
          </div>
          <ArrowUpRight size={16} style={{ color: 'var(--admin-text-dim)', flexShrink: 0 }} />
        </button>
      </div>

      {/* Recent Jobs */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Bài đăng gần đây</h2>
          <button onClick={() => navigate('/recruiter/jobs')} className="admin-btn admin-btn-ghost admin-btn-sm">
            Xem tất cả <ArrowUpRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="admin-empty" style={{ padding: '40px 20px' }}>
            <div className="admin-loader" />
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="admin-empty" style={{ padding: '40px 20px' }}>
            <FileText size={40} />
            <p style={{ fontSize: 13, marginTop: 8 }}>Bạn chưa có bài đăng nào</p>
            <button
              onClick={() => navigate('/recruiter/jobs?action=create')}
              className="admin-btn admin-btn-primary"
              style={{ marginTop: 16 }}
            >
              <PlusCircle size={16} /> Tạo bài đăng đầu tiên
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Địa điểm</th>
                <th>Ứng viên</th>
                <th>Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/recruiter/jobs`)}>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--admin-text)', margin: 0 }}>{job.title}</p>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                        {(job.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="admin-badge admin-badge-info" style={{ fontSize: 9 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{job.location || '—'}</td>
                  <td>
                    <span className={`admin-badge ${job.applicantCount > 0 ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {job.applicantCount || 0}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>{job.postedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard
