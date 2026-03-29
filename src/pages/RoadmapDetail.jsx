import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'
import apiClient from '../services/apiClient'
import ModulePanel from '../components/Roadmap/ModulePanel'
import NodeDetailPanel from '../components/Roadmap/NodeDetailPanel'
import { Loader2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'

/* ═══ Constants ═══════════════════════════════════ */
const NODE_W = 200
const NODE_H = 52
const MODULE_W = 220
const MODULE_H = 56

/* ═══ Color Map ═══════════════════════════════════ */
const CAT = {
  module:      { bg: '#fbbf24', border: '#f59e0b', text: '#1a1a2e', glow: '#fbbf2440' },
  language:    { bg: '#6366f1', border: '#818cf8', text: '#e0e7ff', glow: '#6366f120' },
  engine:      { bg: '#3b82f6', border: '#60a5fa', text: '#dbeafe', glow: '#3b82f620' },
  math:        { bg: '#14b8a6', border: '#2dd4bf', text: '#ccfbf1', glow: '#14b8a620' },
  gameplay:    { bg: '#10b981', border: '#34d399', text: '#d1fae5', glow: '#10b98120' },
  ai:          { bg: '#22d3ee', border: '#67e8f9', text: '#cffafe', glow: '#22d3ee20' },
  deploy:      { bg: '#f97316', border: '#fb923c', text: '#ffedd5', glow: '#f9731620' },
  network:     { bg: '#ef4444', border: '#f87171', text: '#fee2e2', glow: '#ef444420' },
  default:     { bg: '#64748b', border: '#94a3b8', text: '#e2e8f0', glow: '#64748b20' },
}

const getTheme = (category = '', isModule = false) => {
  if (isModule) return CAT.module
  const c = category.toLowerCase()
  for (const [key, theme] of Object.entries(CAT)) {
    if (c.includes(key)) return theme
  }
  if (c.includes('oop') || c.includes('syntax') || c.includes('logic') || c.includes('data') || c.includes('advanced')) return CAT.language
  if (c.includes('editor') || c.includes('lifecycle')) return CAT.engine
  if (c.includes('physics') || c.includes('animation') || c.includes('audio') || c.includes('ui')) return CAT.gameplay
  if (c.includes('pattern') || c.includes('architecture') || c.includes('technical') || c.includes('performance')) return { ...CAT.default, bg: '#8b5cf6', border: '#a78bfa', text: '#ede9fe', glow: '#8b5cf620' }
  return CAT.default
}

/* ═══ Custom Module Node ═════════════════════════ */
const ModuleNode = ({ data }) => {
  const theme = getTheme(data.category, data.isModule)
  const isExpanded = data.isExpanded
  const hasChildren = data.hasChildren

  return (
    <div
      style={{
        background: data.isModule
          ? `linear-gradient(135deg, ${theme.bg}, ${theme.bg}dd)`
          : `linear-gradient(135deg, ${theme.bg}30, ${theme.bg}15)`,
        border: `2px solid ${data.isModule ? theme.border : theme.bg + '66'}`,
        borderRadius: data.isModule ? 16 : 10,
        padding: data.isModule ? '12px 20px' : '8px 14px',
        color: data.isModule ? theme.text : '#e2e8f0',
        fontSize: data.isModule ? 14 : 12,
        fontWeight: data.isModule ? 700 : 500,
        width: data.isModule ? MODULE_W : NODE_W,
        textAlign: 'center',
        cursor: hasChildren ? 'pointer' : 'default',
        boxShadow: data.isSelected
          ? `0 0 24px ${theme.bg}50, 0 0 0 3px ${theme.bg}30`
          : `0 4px 16px ${theme.glow}`,
        transition: 'all .25s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <span style={{ flex: 1 }}>{data.label}</span>
      {hasChildren && data.isModule && (
        isExpanded
          ? <ChevronDown size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
          : <ChevronRight size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  )
}

/* ═══ Root Node ═════════════════════════════════ */
const RootNode = ({ data }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      border: '2px solid #60a5fa',
      borderRadius: 20,
      padding: '14px 28px',
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 800,
      textAlign: 'center',
      boxShadow: data.isSelected
        ? '0 0 30px rgba(59,130,246,0.5), 0 0 0 4px rgba(59,130,246,0.2)'
        : '0 8px 32px rgba(59,130,246,0.25)',
      letterSpacing: '0.5px',
      minWidth: 240,
    }}
  >
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    {data.label}
  </div>
)

/* ═══ Dagre Layout ═══════════════════════════════ */
const doLayout = (nodes, edges) => {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 80 })
  nodes.forEach(n => {
    const w = n.data?.isRoot ? 260 : n.data?.isModule ? MODULE_W : NODE_W
    const h = n.data?.isRoot ? 56 : n.data?.isModule ? MODULE_H : NODE_H
    g.setNode(n.id, { width: w, height: h })
  })
  edges.forEach(e => g.setEdge(e.source, e.target))
  dagre.layout(g)

  return nodes.map(n => {
    const pos = g.node(n.id)
    const w = n.data?.isRoot ? 260 : n.data?.isModule ? MODULE_W : NODE_W
    const h = n.data?.isRoot ? 56 : n.data?.isModule ? MODULE_H : NODE_H
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } }
  })
}

/* ═══ Main Component ═════════════════════════════ */
const RoadmapDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [allNodeData, setAllNodeData] = useState([])
  const [allEdgeData, setAllEdgeData] = useState([])
  const [expandedModules, setExpandedModules] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const nodeTypes = useMemo(() => ({
    moduleNode: ModuleNode,
    rootNode: RootNode,
  }), [])

  /* ─── Fetch data ─── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.get(`/Roadmap/${id}`)
        setTitle(data.title)

        const nd = (data.nodes || []).map(n => ({
          id: n.id,
          data: {
            label: n.data?.label || 'Untitled',
            description: n.data?.description || '',
            category: n.data?.category || '',
            resources: n.data?.resources || [],
            prerequisites: n.data?.prerequisites || [],
          },
        }))

        const ed = (data.edges || []).map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
        }))

        setAllNodeData(nd)
        setAllEdgeData(ed)
      } catch (err) {
        console.error('Failed to load roadmap:', err)
        setError('Không thể tải roadmap. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  /* ─── Derive visible nodes/edges from expand state ─── */
  useEffect(() => {
    if (allNodeData.length === 0) return

    // Build parent→children map
    const childrenOf = {}
    allEdgeData.forEach(e => {
      if (!childrenOf[e.source]) childrenOf[e.source] = []
      childrenOf[e.source].push(e.target)
    })

    // Find root (no incoming edge)
    const targetIds = new Set(allEdgeData.map(e => e.target))
    const rootId = allNodeData.find(n => !targetIds.has(n.id))?.id

    if (!rootId) return

    // Module-level = direct children of root
    const moduleIds = new Set(childrenOf[rootId] || [])

    // Compute visible node IDs
    const visibleIds = new Set()
    visibleIds.add(rootId)
    moduleIds.forEach(mid => visibleIds.add(mid))

    // For each expanded module, add its descendants recursively
    const addDescendants = (nodeId) => {
      const children = childrenOf[nodeId] || []
      children.forEach(cid => {
        visibleIds.add(cid)
        // Also expand sub-topics if their parent is expanded
        if (expandedModules.has(cid)) {
          addDescendants(cid)
        } else {
          // Always show one level deeper (topics of modules)
          const grandChildren = childrenOf[cid] || []
          grandChildren.forEach(gc => visibleIds.add(gc))
        }
      })
    }

    expandedModules.forEach(mid => addDescendants(mid))

    // Build visible flow nodes
    const visibleFlow = allNodeData
      .filter(n => visibleIds.has(n.id))
      .map(n => {
        const isRoot = n.id === rootId
        const isModule = moduleIds.has(n.id)
        const hasChildren = (childrenOf[n.id] || []).length > 0

        return {
          id: n.id,
          type: isRoot ? 'rootNode' : 'moduleNode',
          position: { x: 0, y: 0 },
          data: {
            ...n.data,
            isRoot,
            isModule,
            hasChildren,
            isExpanded: expandedModules.has(n.id),
            isSelected: selectedNode?.id === n.id,
          },
        }
      })

    // Visible edges = edges where both source and target are visible
    const visibleEdgeFlow = allEdgeData
      .filter(e => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: moduleIds.has(e.target),
        style: {
          stroke: moduleIds.has(e.target) ? '#fbbf2466' : '#3b82f640',
          strokeWidth: moduleIds.has(e.target) ? 3 : 2,
          strokeDasharray: moduleIds.has(e.target) ? undefined : '6 3',
        },
      }))

    const laid = doLayout(visibleFlow, visibleEdgeFlow)
    setNodes(laid)
    setEdges(visibleEdgeFlow)
  }, [allNodeData, allEdgeData, expandedModules, selectedNode, setNodes, setEdges])

  /* ─── Toggle module expand ─── */
  const toggleModule = useCallback((nodeId) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  /* ─── Node click ─── */
  const onNodeClick = useCallback((_e, node) => {
    setSelectedNode(node)
    if (node.data.hasChildren) {
      toggleModule(node.id)
    }
  }, [toggleModule])

  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  /* ─── Module panel select ─── */
  const handleModuleSelect = useCallback((moduleNode) => {
    setSelectedNode(moduleNode)
    if (moduleNode.data?.hasChildren || moduleNode.data?.isModule) {
      toggleModule(moduleNode.id)
    }
  }, [toggleModule])

  const miniMapColor = useCallback(n => {
    if (n?.data?.isRoot) return '#3b82f6'
    if (n?.data?.isModule) return '#fbbf24'
    return getTheme(n?.data?.category).bg
  }, [])

  /* ─── Loading / Error ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-400 text-sm">Đang tải roadmap…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Quay về trang chủ
          </button>
        </div>
      </div>
    )
  }

  /* ─── Render ─── */
  return (
    <div style={{ width: '100vw', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#050505' }}>
      {/* Title Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,18,0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 20, flexShrink: 0,
      }}>
        <button onClick={() => navigate('/')} style={{ padding: 6, borderRadius: 8, color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h1>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#475569' }}>
          {allNodeData.length} nodes · {expandedModules.size} mở
        </span>
      </div>

      {/* 3-Column Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT */}
        <ModulePanel
          nodes={allNodeData}
          edges={allEdgeData}
          selectedNodeId={selectedNode?.id}
          expandedModules={expandedModules}
          onNodeSelect={handleModuleSelect}
        />

        {/* CENTER */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            fitView
            fitViewOptions={{ padding: 0.3, duration: 400 }}
            minZoom={0.1}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={24} size={1} variant="dots" />
            <Controls position="bottom-left" style={{ background: '#0f0f18', borderColor: '#1e293b' }} />
            <MiniMap
              nodeColor={miniMapColor}
              maskColor="rgba(0,0,0,0.75)"
              style={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.08)' }}
              position="bottom-right"
            />
          </ReactFlow>

          {!selectedNode && (
            <div style={{
              position: 'absolute', bottom: 64, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9999, padding: '6px 18px', fontSize: 11, color: '#64748b', pointerEvents: 'none',
            }}>
              Click vào module (màu vàng) để mở rộng nhánh
            </div>
          )}
        </div>

        {/* RIGHT */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  )
}

export default RoadmapDetail
