import React, { useState, useEffect } from 'react'
import {
  Users, Briefcase, ChevronDown, ChevronRight, Mail,
  CheckCircle2, XCircle, Clock, MessageSquare, Award, User
} from 'lucide-react'
import { getMyJobPosts, getJobApplicants, updateApplicationStatus } from '../../services/recruiterApi'

const STATUS_MAP = {
  Pending: { label: 'Đang chờ', badge: 'admin-badge-warning', icon: Clock },
  Interview: { label: 'Phỏng vấn', badge: 'admin-badge-info', icon: MessageSquare },
  Accepted: { label: 'Chấp nhận', badge: 'admin-badge-success', icon: CheckCircle2 },
  Rejected: { label: 'Từ chối', badge: 'admin-badge-danger', icon: XCircle },
}

const RecruiterApplicants = () => {
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getMyJobPosts()
        const jobList = data?.data ?? []
        setJobs(jobList)
        // Auto-select first job with applicants
        const firstWithApplicants = jobList.find(j => (j.applicantCount || 0) > 0)
        if (firstWithApplicants) {
          setSelectedJobId(firstWithApplicants.id)
        } else if (jobList.length > 0) {
          setSelectedJobId(jobList[0].id)
        }
      } catch (e) {
        console.error('Error loading jobs:', e)
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    const fetchApplicants = async () => {
      setLoadingApplicants(true)
      try {
        const data = await getJobApplicants(selectedJobId)
        setApplicants(data?.data ?? [])
      } catch (e) {
        console.error('Error loading applicants:', e)
        setApplicants([])
      } finally {
        setLoadingApplicants(false)
      }
    }
    fetchApplicants()
  }, [selectedJobId])

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(selectedJobId, applicationId, newStatus)
      setApplicants(prev =>
        prev.map(a => a.applicationId === applicationId ? { ...a, status: newStatus } : a)
      )
    } catch (e) {
      alert(e?.response?.data?.message || 'Cập nhật trạng thái thất bại.')
    } finally {
      setUpdatingId(null)
    }
  }

  const selectedJob = jobs.find(j => j.id === selectedJobId)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Quản lý ứng viên</h1>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>
          Xem và xử lý đơn ứng tuyển cho từng vị trí
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: Job selector */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-text-dim)', margin: 0 }}>
              Chọn vị trí
            </p>
          </div>

          {loadingJobs ? (
            <div className="admin-empty" style={{ padding: '30px 16px' }}>
              <div className="admin-loader" style={{ width: 32, height: 32 }} />
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--admin-text-dim)', fontSize: 13 }}>
              Chưa có bài đăng
            </div>
          ) : (
            <div style={{ maxHeight: 500, overflowY: 'auto' }} className="admin-scroll">
              {jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 20px',
                    cursor: 'pointer', border: 'none',
                    borderBottom: '1px solid var(--admin-border)',
                    borderLeft: selectedJobId === job.id ? '3px solid #f59e0b' : '3px solid transparent',
                    background: selectedJobId === job.id ? 'rgba(245, 158, 11, 0.06)' : 'transparent',
                    transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    color: 'inherit',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, margin: 0,
                      color: selectedJobId === job.id ? '#fbbf24' : '#e2e8f0',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{job.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--admin-text-dim)', margin: '2px 0 0' }}>
                      {job.location || 'N/A'}
                    </p>
                  </div>
                  <span className={`admin-badge ${(job.applicantCount || 0) > 0 ? 'admin-badge-success' : 'admin-badge-warning'}`}
                    style={{ flexShrink: 0, marginLeft: 8 }}>
                    {job.applicantCount || 0}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Applicants list */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden', minHeight: 300 }}>
          {/* Selected job header */}
          {selectedJob && (
            <div style={{
              padding: '16px 24px', borderBottom: '1px solid var(--admin-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{selectedJob.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--admin-text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Briefcase size={11} /> {selectedJob.experienceLevel || '—'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--admin-text-dim)' }}>•</span>
                  <span style={{ fontSize: 11, color: 'var(--admin-text-dim)' }}>{selectedJob.location || '—'}</span>
                </div>
              </div>
              <span className="admin-badge admin-badge-info">
                <Users size={10} style={{ marginRight: 4 }} />{applicants.length} ứng viên
              </span>
            </div>
          )}

          {!selectedJobId ? (
            <div className="admin-empty" style={{ padding: '60px 20px' }}>
              <Briefcase size={40} />
              <p style={{ fontSize: 13, marginTop: 8 }}>Chọn một vị trí để xem ứng viên</p>
            </div>
          ) : loadingApplicants ? (
            <div className="admin-empty" style={{ padding: '40px 20px' }}>
              <div className="admin-loader" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="admin-empty" style={{ padding: '40px 20px' }}>
              <Users size={40} />
              <p style={{ fontSize: 13, marginTop: 8 }}>Chưa có ứng viên cho vị trí này</p>
            </div>
          ) : (
            <div>
              {applicants.map((app, idx) => {
                const statusConfig = STATUS_MAP[app.status] || STATUS_MAP.Pending
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={app.applicationId}
                    className="animate-fade-in-up"
                    style={{
                      padding: '20px 24px',
                      borderBottom: idx < applicants.length - 1 ? '1px solid var(--admin-border)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                      animationDelay: `${idx * 0.03}s`,
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Applicant info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: app.applicant?.avatar
                          ? `url(${app.applicant.avatar}) center/cover`
                          : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#fff',
                        border: '2px solid var(--admin-border)',
                      }}>
                        {!app.applicant?.avatar && (app.applicant?.fullName?.charAt(0)?.toUpperCase() || <User size={18} />)}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.applicant?.fullName || app.applicant?.userName || 'Ứng viên'}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--admin-text-dim)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Mail size={10} /> {app.applicant?.email || '—'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#60a5fa',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            <Award size={10} /> Skills: {app.applicant?.skills?.length || 0}
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-dim)' }}>•</span>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-dim)' }}>
                            Completed: {app.applicant?.completedNodes || 0} nodes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Matching score */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 800,
                        background: app.matchingScore >= 70
                          ? 'rgba(16,185,129,0.12)' : app.matchingScore >= 40
                          ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                        color: app.matchingScore >= 70
                          ? '#34d399' : app.matchingScore >= 40
                          ? '#fbbf24' : '#f87171',
                        border: `2px solid ${app.matchingScore >= 70
                          ? 'rgba(16,185,129,0.3)' : app.matchingScore >= 40
                          ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}>
                        {Math.round(app.matchingScore || 0)}%
                      </div>
                      <p style={{ fontSize: 9, color: 'var(--admin-text-dim)', margin: '4px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Match
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <span className={`admin-badge ${statusConfig.badge}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StatusIcon size={10} /> {statusConfig.label}
                      </span>

                      <div style={{ display: 'flex', gap: 4 }}>
                        {app.status !== 'Accepted' && (
                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'Accepted')}
                            disabled={updatingId === app.applicationId}
                            className="admin-btn admin-btn-sm"
                            style={{
                              background: 'rgba(16,185,129,0.1)', color: '#34d399',
                              border: '1px solid rgba(16,185,129,0.2)', padding: '4px 8px', fontSize: 11,
                            }}
                            title="Chấp nhận"
                          >
                            <CheckCircle2 size={12} />
                          </button>
                        )}
                        {app.status !== 'Interview' && (
                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'Interview')}
                            disabled={updatingId === app.applicationId}
                            className="admin-btn admin-btn-sm"
                            style={{
                              background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                              border: '1px solid rgba(99,102,241,0.2)', padding: '4px 8px', fontSize: 11,
                            }}
                            title="Phỏng vấn"
                          >
                            <MessageSquare size={12} />
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(app.applicationId, 'Rejected')}
                            disabled={updatingId === app.applicationId}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            title="Từ chối"
                          >
                            <XCircle size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecruiterApplicants
