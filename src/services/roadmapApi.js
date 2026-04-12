import apiClient from './apiClient'

const normalizeNode = (node) => ({
  id: node.id,
  type: node.type,
  content: node.content ?? '',
  x: Number(node.x ?? 0),
  y: Number(node.y ?? 0),
  width: Number(node.width ?? 0),
  height: Number(node.height ?? 0),
  link: node.link ?? null,
  style: node.style ?? {},
  createdAt: node.createdAt ?? null,
  updatedAt: node.updatedAt ?? null,
})

const normalizeConnection = (connection) => ({
  id: connection.id,
  fromNodeId: connection.fromNodeId,
  toNodeId: connection.toNodeId,
  fromPoint: connection.fromPoint ?? 'bottom',
  toPoint: connection.toPoint ?? 'top',
})

export const buildRoadmapPayload = ({ title, creatorId, nodes, connections }) => ({
  title,
  creatorId: creatorId ?? null,
  nodes: (nodes ?? []).map(normalizeNode),
  connections: (connections ?? []).map(normalizeConnection),
})

export const createRoadmap = async (payload) => {
  const response = await apiClient.post('/roadmaps', payload)
  return response.data
}

export const updateRoadmap = async (roadmapId, payload) => {
  const response = await apiClient.put(`/roadmaps/${roadmapId}`, payload)
  return response.data
}

export const getRoadmapById = async (roadmapId) => {
  const response = await apiClient.get(`/roadmaps/${roadmapId}`)
  return response.data
}

export const getRoadmaps = async (creatorId) => {
  const response = await apiClient.get('/roadmaps', {
    params: creatorId ? { creatorId } : undefined,
  })
  return response.data
}
