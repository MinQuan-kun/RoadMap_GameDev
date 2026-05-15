import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react'
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
import 'reactflow/dist/style.css'
import apiClient from '../services/apiClient'
import CoursePanel from '../components/Roadmap/CoursePanel'
import NodeDetailPanel from '../components/Roadmap/NodeDetailPanel'
import { Loader2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import AuthContext from '../context/AuthContext'

/* ═══ Custom Module Node ═════════════════════════ */
const ModuleNode = ({ data }) => {
  return (
    <div
      className={`group relative transition-all duration-500 ${data.isSelected ? 'scale-105' : 'hover:scale-102'}`}
      style={{
        background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
        border: '2px solid #3b82f6',
        borderRadius: '24px',
        padding: '20px 40px',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 900,
        textAlign: 'center',
        boxShadow: data.isSelected
          ? '0 20px 50px rgba(30,64,175,0.4), 0 0 0 4px rgba(59,130,246,0.2)'
          : '0 10px 30px rgba(0,0,0,0.3)',
        minWidth: 320,
        cursor: 'pointer',
        letterSpacing: '-0.02em',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#3b82f6', width: 8, height: 8, border: '2px solid #050505', opacity: 0 }} />
      <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Module Lộ trình</div>
      <div className="text-white text-lg font-black tracking-tight">{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#3b82f6', width: 8, height: 8, border: '2px solid #050505', opacity: 0 }} />
    </div>
  )
}

const nodeTypes = {
  moduleNode: ModuleNode,
  rootNode: ModuleNode, // Unified
}
const edgeTypes = {}

/* ═══ Main Component ═════════════════════════════ */
const RoadmapDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  
  const [allNodeData, setAllNodeData] = useState([])
  const [allEdgeData, setAllEdgeData] = useState([])
  const [expandedModules, setExpandedModules] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)
  
  // Metadata state
  const [metadata, setMetadata] = useState({
    title: '',
    engine: '',
    description: '',
    pathwayContent: []
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedNodes, setCompletedNodes] = useState(new Set())
  const [skippedNodes, setSkippedNodes] = useState(new Set())

  useEffect(() => {
    if (user) {
      setCompletedNodes(new Set(user.completedNodes || []))
      setSkippedNodes(new Set(user.skippedNodes || []))
    }
  }, [user])

  /* ─── Fetch data ─── */
  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        const { data: response } = await apiClient.get(`/Pathways/${id}/content`)
        const pathway = response.pathway
        const courses = response.courses || []
        
        setMetadata({
          title: pathway.title || '',
          engine: pathway.difficulty || '',
          description: pathway.description || '',
          pathwayContent: courses
        })

        if (pathway.roadmapGraphId) {
          const { data: graph } = await apiClient.get(`/RoadmapGraphs/${pathway.roadmapGraphId}`)
          
          const nd = (graph.nodes || []).map((n, idx) => {
            // FORCE VERTICAL ALIGNMENT: x is centered (0), y is sequential
            const x = 0
            const y = idx * 250 // Spaced out for a clear path
            return {
              id: n.id,
              data: {
                label: n.title,
                nodeType: n.nodeType,
                referenceId: n.referenceId,
              },
              position: { x, y }
            }
          })

          const ed = (graph.edges || []).map(e => ({
            id: e.id || `e-${e.sourceNodeId}-${e.targetNodeId}`,
            source: e.sourceNodeId,
            target: e.targetNodeId,
          }))

          setAllNodeData(nd)
          setAllEdgeData(ed)
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err)
        setError('Không thể tải lộ trình. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  /* ─── Derive Flow ─── */
  useEffect(() => {
    if (allNodeData.length === 0) return

    const visibleFlow = allNodeData.map(n => ({
      ...n,
      type: 'moduleNode',
      data: {
        ...n.data,
        isExpanded: expandedModules.has(n.id),
        isSelected: selectedNode?.id === n.id,
        isCompleted: completedNodes.has(n.id),
        isSkipped: skippedNodes.has(n.id),
      },
    }))

    const visibleEdgeFlow = allEdgeData.map(e => ({
      ...e,
      type: 'straight',
      animated: true,
      style: { 
        stroke: '#2563eb', 
        strokeWidth: 6, // Thick vertical path
        opacity: 0.3 
      },
    }))

    setNodes(visibleFlow)
    setEdges(visibleEdgeFlow)
  }, [allNodeData, expandedModules, selectedNode, completedNodes, skippedNodes, setNodes, setEdges])

  /* ─── Handlers ─── */
  const handleUpdateProgress = async (nodeId, status) => {
    try {
      const res = await apiClient.post('/users/progress', { nodeId, status })
      if (res.data?.data) {
        setCompletedNodes(new Set(res.data.data.completed || []))
        setSkippedNodes(new Set(res.data.data.skipped || []))
        if (user) {
          setUser({
            ...user,
            completedNodes: res.data.data.completed || [],
            skippedNodes: res.data.data.skipped || []
          })
        }
      }
    } catch (err) {
      console.error('Progress update failed', err)
    }
  }

  const toggleModule = useCallback((nodeId) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  const onNodeClick = useCallback((_e, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  const handleModuleSelect = useCallback((moduleNode) => {
    setSelectedNode(moduleNode)
    if (moduleNode.id) {
      setExpandedModules(prev => new Set(prev).add(moduleNode.id))
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Top Header */}
      <div className="h-16 flex items-center gap-4 px-6 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.06] z-50">
        <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">{metadata.title}</h1>
            {metadata.engine && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                {metadata.engine}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate max-w-md">{metadata.description}</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <CoursePanel
          pathwayContent={metadata.pathwayContent}
          selectedNodeId={selectedNode?.id}
          expandedModules={expandedModules}
          onNodeSelect={handleModuleSelect}
          onToggleModule={toggleModule}
        />

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            fitView
            fitViewOptions={{ padding: 0.4 }}
          >
            <Background color="#1e293b" gap={24} size={1} variant="dots" />
            <Controls position="bottom-left" className="!bg-[#0f0f18] !border-[#1e293b] !fill-slate-400" />
            <MiniMap 
              nodeColor={() => '#1e40af'} 
              maskColor="rgba(0,0,0,0.7)" 
              className="!bg-[#0a0a0f] !border-white/5" 
            />
          </ReactFlow>

          {!selectedNode && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-widest pointer-events-none">
              Chọn một module để xem chi tiết bài học
            </div>
          )}
        </div>

        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdateProgress={handleUpdateProgress}
            isCompleted={completedNodes.has(selectedNode.id)}
            isSkipped={skippedNodes.has(selectedNode.id)}
            isAuthenticated={!!user}
          />
        )}
      </div>
    </div>
  )
}

export default RoadmapDetail
