import React, { useEffect, useState, useContext } from 'react'
import { Map, Pencil, Trash2, Link, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getRoadmaps, deleteRoadmap } from '../../services/roadmapApi'
import { getMyJobPosts } from '../../services/recruiterApi'
import AuthContext from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

const RecruiterRoadmaps = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [roadmaps, setRoadmaps] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const loadRoadmapsAndJobs = async () => {
    try {
      setLoading(true)
      const creatorId = user?.id || user?._id || null
      const [roadmapsData, jobsData] = await Promise.all([
        getRoadmaps({ creatorId, includeOfficial: false }),
        getMyJobPosts()
      ])
      setRoadmaps(Array.isArray(roadmapsData) ? roadmapsData : [])
      setJobs(jobsData?.data ?? [])
    } catch (e) {
      console.error('Error loading roadmaps and jobs for recruiter:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmapsAndJobs()
  }, [user])

  const handleDelete = async (roadmapId) => {
    if (!window.confirm('Bạn có chắc muốn xóa lộ trình này?')) return
    try {
      await deleteRoadmap(roadmapId)
      toast.success('Xóa lộ trình thành công!')
      loadRoadmapsAndJobs()
    } catch {
      toast.error('Xóa thất bại.')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--admin-text)', margin: 0 }}>Lộ trình tuyển dụng</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            Quản lý các lộ trình học tập của công ty và gắn kèm cho các tin tuyển dụng
          </p>
        </div>
        <button
          onClick={() => navigate('/profile', { state: { activeTab: 'CreateRoadmap' } })}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={16} /> Tạo lộ trình mới
        </button>
      </div>

      {loading ? (
        <div className="admin-empty" style={{ padding: 40 }}><div className="admin-loader" /></div>
      ) : roadmaps.length === 0 ? (
        <div className="admin-card" style={{ padding: 40, textAlign: 'center', background: 'var(--admin-card)' }}>
          <Map size={40} className="text-slate-400 mx-auto" style={{ color: 'var(--admin-text-dim)', marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: 'var(--admin-text-muted)' }}>Chưa có lộ trình tuyển dụng nào được tạo.</p>
          <button
            onClick={() => navigate('/profile', { state: { activeTab: 'CreateRoadmap' } })}
            className="admin-btn admin-btn-primary"
            style={{ marginTop: 16 }}
          >
            Tạo lộ trình tuyển dụng đầu tiên
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {roadmaps.map(roadmap => {
            const linkedJobs = jobs.filter(j => j.targetRoadmapId === roadmap.id || j.roadmapGraphId === roadmap.id)
            return (
              <div
                key={roadmap.id}
                className="admin-card animate-fade-in-up"
                style={{
                  background: 'var(--admin-card)',
                  padding: 24,
                  border: '1px solid var(--admin-border)',
                  borderRadius: 16,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                      {roadmap.title}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      marginTop: 8,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#60a5fa',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      Lộ trình tuyển dụng
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => navigate('/profile', { state: { activeTab: 'CreateRoadmap', editingRoadmapId: roadmap.id } })}
                      className="p-2 rounded-xl"
                      style={{
                        padding: 8, borderRadius: 8, border: '1px solid var(--admin-border)',
                        background: 'transparent', color: 'var(--admin-text)', cursor: 'pointer'
                      }}
                      title="Sửa"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(roadmap.id)}
                      className="p-2 rounded-xl"
                      style={{
                        padding: 8, borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.2)',
                        background: 'transparent', color: '#f87171', cursor: 'pointer'
                      }}
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--admin-border)' }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em', color: 'var(--admin-text-dim)',
                    display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 10px 0'
                  }}>
                    <Link size={12} /> Công việc được gắn kèm ({linkedJobs.length})
                  </p>
                  {linkedJobs.length === 0 ? (
                    <p style={{ fontSize: 12, color: '#fbbf24', fontStyle: 'italic', margin: 0, fontWeight: 600 }}>
                      Chưa được gắn với công việc nào.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {linkedJobs.map(job => (
                        <div
                          key={job.id}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontSize: 12, padding: '8px 12px', borderRadius: 8,
                            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--admin-border)'
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{job.title}</span>
                          <span style={{ fontSize: 10, color: 'var(--admin-text-dim)' }}>{job.location || 'Remote'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecruiterRoadmaps
