import React, { useState, useEffect } from 'react'
import {
  Loader2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Save,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react'
import { getAllRoadmaps, getRoadmapById } from '../../services/adminApi'
import { updateNode } from '../../services/adminApi'

const LessonManager = () => {
  const [roadmaps, setRoadmaps] = useState([])
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)
  const [roadmapDetail, setRoadmapDetail] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable fields
  const [editDesc, setEditDesc] = useState('')
  const [editResources, setEditResources] = useState([])
  const [newResource, setNewResource] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllRoadmaps()
        setRoadmaps(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const loadRoadmapDetail = async (roadmap) => {
    setSelectedRoadmap(roadmap)
    setSelectedNode(null)
    setLoadingDetail(true)
    try {
      const data = await getRoadmapById(roadmap.id || roadmap._id)
      setRoadmapDetail(data)
    } catch (e) {
      console.error(e)
      setRoadmapDetail(null)
    } finally {
      setLoadingDetail(false)
    }
  }

  const selectNode = (node) => {
    setSelectedNode(node)
    setEditDesc(node.data?.description || node.data?.label || '')
    setEditResources(node.data?.resources || [])
    setNewResource('')
    setSaved(false)
  }

  const addResource = () => {
    if (newResource.trim()) {
      setEditResources((prev) => [...prev, newResource.trim()])
      setNewResource('')
    }
  }

  const removeResource = (idx) => {
    setEditResources((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    if (!selectedNode) return
    setSaving(true)
    try {
      await updateNode(selectedNode.id, {
        description: editDesc,
        resources: editResources,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
      alert('Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  // Build tree from flat nodes + edges
  const buildTree = () => {
    if (!roadmapDetail) return []
    const nodes = roadmapDetail.nodes || []
    const edges = roadmapDetail.edges || []

    const childMap = {}
    edges.forEach((e) => {
      if (!childMap[e.source]) childMap[e.source] = []
      childMap[e.source].push(e.target)
    })

    const targetIds = new Set(edges.map((e) => e.target))
    const roots = nodes.filter((n) => !targetIds.has(n.id))

    return { roots, childMap, nodeMap: Object.fromEntries(nodes.map((n) => [n.id, n])) }
  }

  const TreeNode = ({ node, childMap, nodeMap, depth = 0 }) => {
    const [open, setOpen] = useState(depth < 1)
    const children = (childMap[node.id] || []).map((id) => nodeMap[id]).filter(Boolean)
    const isSelected = selectedNode?.id === node.id

    return (
      <div>
        <button
          onClick={() => {
            selectNode(node)
            if (children.length > 0) setOpen(!open)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: '100%',
            padding: '8px 12px',
            paddingLeft: 12 + depth * 20,
            background: isSelected
              ? 'rgba(99, 102, 241, 0.12)'
              : 'transparent',
            border: 'none',
            borderLeft: isSelected
              ? '3px solid #6366f1'
              : '3px solid transparent',
            color: isSelected ? '#e2e8f0' : 'var(--admin-text-muted)',
            fontSize: 13,
            fontWeight: isSelected ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.background = 'transparent'
          }}
        >
          {children.length > 0 ? (
            open ? (
              <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
            ) : (
              <ChevronRight size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
            )
          ) : (
            <span style={{ width: 14, flexShrink: 0 }} />
          )}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {node.data?.label || 'Untitled'}
          </span>
        </button>
        {open &&
          children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              childMap={childMap}
              nodeMap={nodeMap}
              depth={depth + 1}
            />
          ))}
      </div>
    )
  }

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
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#f1f5f9',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Bài học / Nội dung Node
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--admin-text-muted)',
            marginTop: 6,
          }}
        >
          Chọn roadmap rồi click vào node để chỉnh sửa nội dung bài học
        </p>
      </div>

      {/* Roadmap selector */}
      {!selectedRoadmap && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {roadmaps.map((rm, idx) => (
            <button
              key={rm.id || rm._id || idx}
              className="admin-card animate-fade-in-up"
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                animationDelay: `${idx * 0.05}s`,
              }}
              onClick={() => loadRoadmapDetail(rm)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={18} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#e2e8f0',
                      margin: 0,
                    }}
                  >
                    {rm.title}
                  </p>
                  {rm.engine && (
                    <p
                      style={{
                        fontSize: 11,
                        color: 'var(--admin-text-dim)',
                        margin: '2px 0 0',
                      }}
                    >
                      {rm.engine}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
          {roadmaps.length === 0 && (
            <div className="admin-empty">
              <BookOpen size={40} />
              <p style={{ marginTop: 8 }}>Chưa có roadmap nào</p>
            </div>
          )}
        </div>
      )}

      {/* Roadmap detail */}
      {selectedRoadmap && (
        <div>
          {/* Back button */}
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => {
              setSelectedRoadmap(null)
              setRoadmapDetail(null)
              setSelectedNode(null)
            }}
            style={{ marginBottom: 16 }}
          >
            ← Chọn roadmap khác
          </button>

          {loadingDetail ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 60,
              }}
            >
              <Loader2
                size={32}
                style={{
                  animation: 'spin 1s linear infinite',
                  color: '#6366f1',
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 20, minHeight: 500 }}>
              {/* Tree sidebar */}
              <div
                className="admin-card admin-scroll"
                style={{
                  width: 300,
                  padding: 0,
                  overflow: 'auto',
                  maxHeight: 'calc(100vh - 240px)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--admin-border)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#e2e8f0',
                  }}
                >
                  {selectedRoadmap.title}
                </div>
                {(() => {
                  const { roots, childMap, nodeMap } = buildTree()
                  return roots.map((root) => (
                    <TreeNode
                      key={root.id}
                      node={root}
                      childMap={childMap}
                      nodeMap={nodeMap}
                    />
                  ))
                })()}
              </div>

              {/* Edit panel */}
              <div className="admin-card" style={{ flex: 1, padding: 28 }}>
                {selectedNode ? (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#e2e8f0',
                          margin: 0,
                        }}
                      >
                        {selectedNode.data?.label || 'Untitled'}
                      </h3>
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2
                            size={14}
                            style={{ animation: 'spin 1s linear infinite' }}
                          />
                        ) : (
                          <Save size={14} />
                        )}
                        {saved ? 'Đã lưu ✓' : 'Lưu'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: 20 }}>
                      <div>
                        <label className="admin-label">
                          Nội dung / Mô tả bài học
                        </label>
                        <textarea
                          className="admin-textarea"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          rows={6}
                          placeholder="Viết nội dung bài học chi tiết ở đây..."
                          style={{ minHeight: 150 }}
                        />
                      </div>

                      <div>
                        <label className="admin-label">
                          Tài liệu tham khảo ({editResources.length})
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {editResources.map((res, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 8,
                                border: '1px solid var(--admin-border)',
                              }}
                            >
                              <ExternalLink
                                size={14}
                                style={{
                                  color: 'var(--admin-text-dim)',
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  flex: 1,
                                  fontSize: 13,
                                  color: '#93c5fd',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {res}
                              </span>
                              <button
                                onClick={() => removeResource(idx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#f87171',
                                  cursor: 'pointer',
                                  padding: 2,
                                  flexShrink: 0,
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}

                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              className="admin-input"
                              value={newResource}
                              onChange={(e) => setNewResource(e.target.value)}
                              placeholder="Thêm URL tài liệu..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addResource()
                                }
                              }}
                            />
                            <button
                              className="admin-btn admin-btn-ghost"
                              onClick={addResource}
                              style={{ flexShrink: 0 }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Node info */}
                      <div
                        style={{
                          padding: 16,
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 10,
                          border: '1px solid var(--admin-border)',
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--admin-text-dim)',
                            textTransform: 'uppercase',
                            margin: '0 0 8px',
                          }}
                        >
                          Thông tin Node
                        </p>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 8,
                            fontSize: 12,
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--admin-text-dim)' }}>
                              ID:{' '}
                            </span>
                            <span style={{ color: 'var(--admin-text-muted)' }}>
                              {selectedNode.id}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--admin-text-dim)' }}>
                              Category:{' '}
                            </span>
                            <span style={{ color: 'var(--admin-text-muted)' }}>
                              {selectedNode.data?.category || '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="admin-empty" style={{ minHeight: 300 }}>
                    <BookOpen size={48} />
                    <p style={{ fontSize: 14, marginTop: 12 }}>
                      Chọn một node từ cây bên trái để chỉnh sửa nội dung bài học
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div
          className="admin-toast"
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
          }}
        >
          ✓ Đã lưu nội dung bài học
        </div>
      )}
    </div>
  )
}

export default LessonManager
