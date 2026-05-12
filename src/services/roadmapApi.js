import apiClient from './apiClient'

const getDefaultStyleByType = (type = 'default') => {
  const base = {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    color: '#111827',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: true,
  }

  switch (type) {
    case 'title':
      return {
        ...base,
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
        fontSize: '20px',
        fontWeight: '700',
      }
    case 'topic':
    case 'start':
      return {
        ...base,
        backgroundColor: '#f5f3ff',
        borderColor: '#8b5cf6',
        fontWeight: '600',
      }
    case 'subtopic':
      return {
        ...base,
        backgroundColor: '#fffbeb',
        borderColor: '#f59e0b',
      }
    case 'button':
    case 'resource_button':
      return {
        ...base,
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
        color: '#ffffff',
        borderRadius: '9999px',
      }
    case 'horizontal_line':
    case 'vertical_line':
      return {
        ...base,
        backgroundColor: '#9ca3af',
        borderColor: '#9ca3af',
        border: false,
      }
    default:
      return base
  }
}

const getDefaultSizeByType = (type = 'default') => {
  switch (type) {
    case 'title':
      return { width: 300, height: 60 }
    case 'topic':
      return { width: 200, height: 50 }
    case 'subtopic':
      return { width: 180, height: 45 }
    case 'horizontal_line':
      return { width: 200, height: 2 }
    case 'vertical_line':
      return { width: 4, height: 100 }
    case 'paragraph':
      return { width: 250, height: 80 }
    case 'checklist':
    case 'list':
      return { width: 200, height: 120 }
    case 'button':
    case 'resource_button':
      return { width: 120, height: 40 }
    default:
      return { width: 150, height: 40 }
  }
}

const normalizeNode = (node) => ({
  id: node.id,
  type: node.type,
  content: node.content ?? '',
  x: Number(node.x ?? 0),
  y: Number(node.y ?? 0),
  width: Number(node.width ?? 0),
  height: Number(node.height ?? 0),
  link: node.link ?? null,
  color: node.color ?? null,
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

export const deleteRoadmap = async (roadmapId) => {
  const response = await apiClient.delete(`/roadmaps/${roadmapId}`)
  return response.data
}

export const getRoadmaps = async ({ creatorId, search, includeOfficial, onlyOfficial } = {}) => {
  const response = await apiClient.get('/roadmaps', {
    params: { creatorId, search, includeOfficial, onlyOfficial },
  })
  return response.data
}

// Node Library: lấy danh sách node có sẵn trong DB
export const getAvailableNodes = async ({ engine, search, category } = {}) => {
  const response = await apiClient.get('/roadmaps/available-nodes', {
    params: { engine, search, category },
  })
  return response.data
}

export const mapRoadmapDetailToBuilderState = (roadmapDetail) => {
  const nodes = (roadmapDetail?.nodes ?? []).map((node) => {
    const nodeType = node.type || node?.data?.category || 'default'
    
    // Ưu tiên style từ API (đã persist), fallback về category parsing
    let apiStyle = node.style ?? {}
    let parsedStyle = {}
    const rawCategory = node?.data?.category

    try {
      parsedStyle = rawCategory && rawCategory.trim().startsWith('{')
        ? JSON.parse(rawCategory)
        : {}
    } catch {
      parsedStyle = {}
    }

    const defaultStyle = getDefaultStyleByType(nodeType)
    const defaultSize = getDefaultSizeByType(nodeType)
    // Priority: API style > parsed category style > default style
    const mergedStyle = { ...defaultStyle, ...parsedStyle, ...apiStyle }
    
    // Apply color from API if available
    if (node.color) {
      mergedStyle.backgroundColor = node.color
    }

    return {
      id: node.id,
      type: nodeType,
      content: node?.data?.label ?? '',
      x: Number(node?.position?.x ?? 0),
      y: Number(node?.position?.y ?? 0),
      width: Number(apiStyle.width ?? parsedStyle.width ?? defaultSize.width),
      height: Number(apiStyle.height ?? parsedStyle.height ?? defaultSize.height),
      link: node?.data?.description ?? null,
      color: node.color ?? mergedStyle.backgroundColor ?? null,
      style: mergedStyle,
      createdAt: parsedStyle.createdAt ?? null,
      updatedAt: parsedStyle.updatedAt ?? null,
    }
  })

  const connections = (roadmapDetail?.edges ?? []).map((edge) => ({
    id: edge.id,
    fromNodeId: edge.source,
    toNodeId: edge.target,
    fromPoint: edge.fromPoint ?? 'bottom',
    toPoint: edge.toPoint ?? 'top',
  }))

  return {
    title: roadmapDetail?.title ?? 'Untitled Roadmap',
    nodes,
    connections,
    canvasOffset: { x: 0, y: 0 },
    zoom: 1,
  }
}
