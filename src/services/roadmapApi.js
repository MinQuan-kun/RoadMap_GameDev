import apiClient from './apiClient'

// =========================
// PATHWAY LAYER (High Level)
// =========================

export const getPathways = async () => {
  const response = await apiClient.get('/Pathways')
  return response.data
}

export const getPathwayBySlug = async (slug) => {
  const response = await apiClient.get(`/Pathways/${slug}`)
  return response.data
}

// =========================
// ROADMAP GRAPH LAYER (Visualization)
// =========================

export const getRoadmapGraph = async (graphId) => {
  const response = await apiClient.get(`/RoadmapGraphs/${graphId}`)
  return response.data
}

export const createRoadmapGraph = async (payload) => {
  const response = await apiClient.post('/RoadmapGraphs', payload)
  return response.data
}

export const updateRoadmapGraph = async (id, payload) => {
  const response = await apiClient.put(`/RoadmapGraphs/${id}`, payload)
  return response.data
}

export const deleteRoadmapGraph = async (id) => {
  const response = await apiClient.delete(`/RoadmapGraphs/${id}`)
  return response.data
}

export const getAvailableNodes = async (params = {}) => {
  const response = await apiClient.get('/admin/nodes', { params })
  return response.data
}

// =========================
// LEARNING LAYER (Content)
// =========================

export const getLesson = async (lessonId) => {
  const response = await apiClient.get(`/Lesson/${lessonId}`)
  return response.data
}

export const completeLesson = async (lessonId) => {
  const response = await apiClient.post(`/Lesson/complete/${lessonId}`)
  return response.data
}

// =========================
// UTILS & MAPPING
// =========================

export const buildRoadmapPayload = ({ title, creatorId, nodes, connections }) => {
  return {
    title,
    creatorId,
    nodes: nodes.map((n) => ({
      id: n.id,
      title: n.content,
      nodeType: n.type || 'default',
      positionX: n.x,
      positionY: n.y,
      referenceId: n.referenceId,
    })),
    edges: connections.map((c) => ({
      sourceNodeId: c.from,
      targetNodeId: c.to,
    })),
  }
}

export const mapRoadmapDetailToBuilderState = (roadmap) => {
  if (!roadmap) return null

  return {
    title: roadmap.title || 'Untitled Roadmap',
    nodes: (roadmap.nodes || []).map((n) => ({
      id: n.id,
      content: n.title,
      type: n.nodeType || 'topic',
      x: n.positionX,
      y: n.positionY,
      referenceId: n.referenceId,
    })),
    connections: (roadmap.edges || []).map((e, idx) => ({
      id: `c-${idx}`,
      from: e.sourceNodeId,
      to: e.targetNodeId,
    })),
  }
}

export const mapGraphToFlow = (graph) => {
  if (!graph) return { nodes: [], edges: [] }

  const nodes = (graph.nodes ?? []).map((node) => ({
    id: node.id,
    type: node.nodeType || 'default',
    position: { x: node.positionX, y: node.positionY },
    data: {
      label: node.title,
      referenceId: node.referenceId,
      nodeType: node.nodeType
    },
  }))

  const edges = (graph.edges ?? []).map((edge) => ({
    id: edge.id || `e-${edge.sourceNodeId}-${edge.targetNodeId}`,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
  }))

  return { nodes, edges }
}

// LEGACY SUPPORT & ALIASES
export const getRoadmaps = getPathways
export const getRoadmapById = getRoadmapGraph
export const createRoadmap = createRoadmapGraph
export const updateRoadmap = updateRoadmapGraph
export const deleteRoadmap = deleteRoadmapGraph
