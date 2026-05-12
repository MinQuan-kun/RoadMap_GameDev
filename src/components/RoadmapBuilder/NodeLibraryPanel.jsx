import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Search,
  Database,
  ChevronRight,
  ChevronDown,
  Loader2,
  BookOpen,
  Filter,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { getAvailableNodes } from '../../services/roadmapApi'
import { useRoadmap, getDefaultNodeStyle } from '../../context/RoadmapContext.jsx'

const ENGINE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'Unity', label: 'Unity' },
  { value: 'Unreal', label: 'Unreal' },
  { value: 'Custom', label: 'Custom' },
]

const NodeLibraryPanel = () => {
  const { state, actions } = useRoadmap()
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [engineFilter, setEngineFilter] = useState('')
  const [expandedParents, setExpandedParents] = useState(new Set())
  const [addedNodeIds, setAddedNodeIds] = useState(new Set())

  const loadNodes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAvailableNodes({
        engine: engineFilter || undefined,
        search: searchTerm || undefined,
      })
      setNodes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load available nodes:', err)
      setNodes([])
    } finally {
      setLoading(false)
    }
  }, [engineFilter, searchTerm])

  useEffect(() => {
    const debounce = setTimeout(() => loadNodes(), 300)
    return () => clearTimeout(debounce)
  }, [loadNodes])

  useEffect(() => {
    setAddedNodeIds(new Set(state.nodes.map(n => n.id)))
  }, [state.nodes])

  // Build tree structure from flat nodes
  const { roots, childMap } = useMemo(() => {
    const childMap = {}
    const nodeMap = {}
    nodes.forEach((n) => {
      nodeMap[n.id] = n
      if (!childMap[n.id]) childMap[n.id] = []
    })

    nodes.forEach((n) => {
      if (n.parentId && nodeMap[n.parentId]) {
        if (!childMap[n.parentId]) childMap[n.parentId] = []
        childMap[n.parentId].push(n)
      }
    })

    const childIds = new Set(nodes.filter((n) => n.parentId).map((n) => n.id))
    const roots = nodes.filter((n) => !n.parentId || !nodeMap[n.parentId])

    return { roots, childMap }
  }, [nodes])

  const toggleExpand = (nodeId) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const handleAddNode = (dbNode) => {
    const nodeData = {
      id: dbNode.id, // Use the actual DB node ID
      type: 'topic',
      content: dbNode.name,
      x: 200 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      width: 200,
      height: 50,
      link: dbNode.description || null,
      style: getDefaultNodeStyle('topic'),
    }

    actions.addNode(nodeData)
  }

  const handleDragStart = (e, dbNode) => {
    const nodeData = {
      id: dbNode.id,
      type: 'topic',
      content: dbNode.name,
      x: 0,
      y: 0,
      width: 200,
      height: 50,
      link: dbNode.description || null,
      style: getDefaultNodeStyle('topic'),
      fromLibrary: true,
    }
    e.dataTransfer.setData('application/json', JSON.stringify(nodeData))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const renderNode = (node, depth = 0) => {
    const children = childMap[node.id] || []
    const hasChildren = children.length > 0
    const isExpanded = expandedParents.has(node.id)
    const isAdded = addedNodeIds.has(node.id)

    return (
      <div key={node.id}>
        <div
            draggable={!isAdded}
            onDragStart={(e) => {
              if (!isAdded) handleDragStart(e, node)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              paddingLeft: 10 + depth * 16,
              cursor: isAdded ? 'default' : 'grab',
              borderRadius: 6,
              transition: 'all 0.15s ease',
              opacity: isAdded ? 0.5 : 1,
              fontSize: 12,
              color: isAdded ? '#64748b' : '#cbd5e1',
              background: 'transparent',
            }}
          onMouseEnter={(e) => {
            if (!isAdded) e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {/* Expand toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.id)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
          ) : (
            <span style={{ width: 16, flexShrink: 0 }} />
          )}

          {/* Content indicator */}
          {node.hasContent && (
            <BookOpen
              size={11}
              style={{ color: '#34d399', flexShrink: 0 }}
              title="Có nội dung bài học"
            />
          )}

          {/* Name */}
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`${node.name}\n${node.description || ''}`}
          >
            {node.name}
          </span>

          {/* Category badge */}
          {node.category && node.category !== 'default' && (
            <span
              style={{
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 4,
                background: 'rgba(99,102,241,0.12)',
                color: '#818cf8',
                flexShrink: 0,
              }}
            >
              {node.category}
            </span>
          )}

          {/* Add button */}
          {!isAdded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddNode(node)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                opacity: 0.7,
              }}
              title="Thêm vào roadmap"
            >
              <Plus size={14} />
            </button>
          )}
        </div>

        {/* Children */}
        {isExpanded &&
          children.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="p-3" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Database size={14} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Node Library
          </h3>
          <button
            onClick={loadNodes}
            className="ml-auto p-1 text-slate-400 hover:text-slate-200"
            title="Refresh"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Kéo thả hoặc click + để thêm node từ CSDL
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm node..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Engine Filter */}
      <div className="flex items-center gap-1 mb-3">
        <Filter size={11} className="text-slate-500 mr-1" />
        {ENGINE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setEngineFilter(opt.value)}
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              transition: 'all 0.15s ease',
              background:
                engineFilter === opt.value
                  ? 'rgba(99,102,241,0.15)'
                  : 'transparent',
              borderColor:
                engineFilter === opt.value
                  ? 'rgba(99,102,241,0.3)'
                  : 'rgba(148,163,184,0.2)',
              color:
                engineFilter === opt.value ? '#818cf8' : '#94a3b8',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Node List */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          borderTop: '1px solid rgba(148,163,184,0.1)',
          paddingTop: 8,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2
              size={20}
              className="animate-spin text-indigo-400"
            />
          </div>
        ) : roots.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            <Database size={24} className="mx-auto mb-2 opacity-40" />
            <p>Không tìm thấy node nào</p>
          </div>
        ) : (
          <div>{roots.map((node) => renderNode(node, 0))}</div>
        )}
      </div>

      {/* Stats */}
      <div
        className="mt-2 pt-2 text-xs text-slate-500"
        style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}
      >
        {nodes.length} nodes · {addedNodeIds.size} đã thêm
      </div>
    </div>
  )
}

export default NodeLibraryPanel
