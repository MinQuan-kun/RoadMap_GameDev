import React, { createContext, useContext, useReducer, useEffect } from 'react'

const RoadmapContext = createContext()

// Node types giống roadmap.sh
export const NODE_TYPES = {
  TITLE: 'title',
  TOPIC: 'topic', 
  SUB_TOPIC: 'subtopic',
  PARAGRAPH: 'paragraph',
  LABEL: 'label',
  BUTTON: 'button',
  IMAGE: 'image',
  LEGEND: 'legend',
  TODO: 'todo',
  CHECKLIST: 'checklist',
  LINKS_GROUP: 'links_group',
  HORIZONTAL_LINE: 'horizontal_line',
  VERTICAL_LINE: 'vertical_line',
  RESOURCE_BUTTON: 'resource_button',
  SECTION: 'section'
}

// Action types
const ACTIONS = {
  SET_TITLE: 'SET_TITLE',
  ADD_NODE: 'ADD_NODE',
  UPDATE_NODE: 'UPDATE_NODE',
  DELETE_NODE: 'DELETE_NODE',
  SELECT_NODE: 'SELECT_NODE',
  ADD_CONNECTION: 'ADD_CONNECTION',
  DELETE_CONNECTION: 'DELETE_CONNECTION',
  SET_CANVAS_OFFSET: 'SET_CANVAS_OFFSET',
  SET_ZOOM: 'SET_ZOOM',
  LOAD_ROADMAP: 'LOAD_ROADMAP',
  RESET_ROADMAP: 'RESET_ROADMAP'
}

// Initial state
const initialState = {
  title: 'Untitled Roadmap',
  nodes: [],
  connections: [],
  selectedNodeId: null,
  canvasOffset: { x: 0, y: 0 },
  zoom: 1,
  nextNodeId: 1,
  isModified: false
}

// Utility functions
const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
const generateConnectionId = () => `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Reducer function
function roadmapReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TITLE:
      return {
        ...state,
        title: action.payload,
        isModified: true
      }

    case ACTIONS.ADD_NODE: {
      const newNode = {
        id: generateNodeId(),
        ...action.payload,
        createdAt: Date.now()
      }
      return {
        ...state,
        nodes: [...state.nodes, newNode],
        isModified: true
      }
    }

    case ACTIONS.UPDATE_NODE: {
      const { id, updates } = action.payload
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === id ? { ...node, ...updates, updatedAt: Date.now() } : node
        ),
        isModified: true
      }
    }

    case ACTIONS.DELETE_NODE: {
      const nodeId = action.payload
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== nodeId),
        connections: state.connections.filter(conn => 
          conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
        ),
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        isModified: true
      }
    }

    case ACTIONS.SELECT_NODE:
      return {
        ...state,
        selectedNodeId: action.payload
      }

    case ACTIONS.ADD_CONNECTION: {
      const newConnection = {
        id: generateConnectionId(),
        ...action.payload,
        createdAt: Date.now()
      }
      return {
        ...state,
        connections: [...state.connections, newConnection],
        isModified: true
      }
    }

    case ACTIONS.DELETE_CONNECTION: {
      const connectionId = action.payload
      return {
        ...state,
        connections: state.connections.filter(conn => conn.id !== connectionId),
        isModified: true
      }
    }

    case ACTIONS.SET_CANVAS_OFFSET:
      return {
        ...state,
        canvasOffset: action.payload
      }

    case ACTIONS.SET_ZOOM:
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(3, action.payload))
      }

    case ACTIONS.LOAD_ROADMAP:
      return {
        ...initialState,
        ...action.payload,
        // Ensure essential properties have defaults
        canvasOffset: action.payload.canvasOffset || { x: 0, y: 0 },
        zoom: action.payload.zoom || 1,
        selectedNodeId: null,
        isModified: false
      }

    case ACTIONS.RESET_ROADMAP:
      return {
        ...initialState,
        isModified: false
      }

    default:
      return state
  }
}

// Provider component
export function RoadmapProvider({ children }) {
  const [state, dispatch] = useReducer(roadmapReducer, initialState)

  // Auto-save to localStorage
  useEffect(() => {
    if (state.isModified) {
      const roadmapData = {
        title: state.title,
        nodes: state.nodes,
        connections: state.connections,
        canvasOffset: state.canvasOffset,
        zoom: state.zoom,
        lastSaved: Date.now()
      }
      localStorage.setItem('roadmap-draft', JSON.stringify(roadmapData))
    }
  }, [state.isModified, state.title, state.nodes, state.connections, state.canvasOffset, state.zoom])

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadmap-draft')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        dispatch({ type: ACTIONS.LOAD_ROADMAP, payload: parsed })
      } catch (error) {
        console.warn('Failed to load saved roadmap:', error)
      }
    }
  }, [])

  // Action creators
  const actions = {
    setTitle: (title) => dispatch({ type: ACTIONS.SET_TITLE, payload: title }),
    
    addNode: (nodeData) => dispatch({ type: ACTIONS.ADD_NODE, payload: nodeData }),
    
    updateNode: (id, updates) => dispatch({ 
      type: ACTIONS.UPDATE_NODE, 
      payload: { id, updates } 
    }),
    
    deleteNode: (id) => dispatch({ type: ACTIONS.DELETE_NODE, payload: id }),
    
    selectNode: (id) => dispatch({ type: ACTIONS.SELECT_NODE, payload: id }),
    
    addConnection: (fromNodeId, toNodeId, fromPoint = 'bottom', toPoint = 'top') => 
      dispatch({ 
        type: ACTIONS.ADD_CONNECTION, 
        payload: { fromNodeId, toNodeId, fromPoint, toPoint } 
      }),
    
    deleteConnection: (id) => dispatch({ type: ACTIONS.DELETE_CONNECTION, payload: id }),
    
    setCanvasOffset: (offset) => dispatch({ type: ACTIONS.SET_CANVAS_OFFSET, payload: offset }),
    
    setZoom: (zoom) => dispatch({ type: ACTIONS.SET_ZOOM, payload: zoom }),
    
    loadRoadmap: (data) => dispatch({ type: ACTIONS.LOAD_ROADMAP, payload: data }),
    
    resetRoadmap: () => dispatch({ type: ACTIONS.RESET_ROADMAP }),

    // Utility actions
    exportRoadmap: () => {
      const exportData = {
        title: state.title,
        nodes: state.nodes,
        connections: state.connections,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
      return exportData
    },

    importRoadmap: (data) => {
      dispatch({ type: ACTIONS.LOAD_ROADMAP, payload: data })
    },

    saveDraft: () => {
      const draftData = {
        title: state.title,
        nodes: state.nodes,
        connections: state.connections,
        canvasOffset: state.canvasOffset,
        zoom: state.zoom,
        savedAt: Date.now()
      }
      localStorage.setItem('roadmap-draft', JSON.stringify(draftData))
      return true
    },

    clearDraft: () => {
      localStorage.removeItem('roadmap-draft')
      dispatch({ type: ACTIONS.RESET_ROADMAP })
    }
  }

  const value = {
    state,
    actions,
    // Computed values
    selectedNode: state.nodes.find(node => node.id === state.selectedNodeId) || null,
    nodeCount: state.nodes.length,
    connectionCount: state.connections.length,
    hasChanges: state.isModified
  }

  return (
    <RoadmapContext.Provider value={value}>
      {children}  
    </RoadmapContext.Provider>
  )
}

// Hook để sử dụng context
export function useRoadmap() {
  const context = useContext(RoadmapContext)
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider')
  }
  return context
}

export default RoadmapContext