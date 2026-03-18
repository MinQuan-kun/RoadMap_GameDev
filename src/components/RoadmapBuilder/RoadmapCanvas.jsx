import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useRoadmap } from '../../context/RoadmapContext.jsx'
import RoadmapNode from './RoadmapNode'
import ConnectionLines from './ConnectionLines'

const RoadmapCanvas = () => {
  const { state, actions } = useRoadmap()
  const canvasRef = useRef(null)
  const [isPanning, setIsPanning] = useState(false) 
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const toCanvasCoords = useCallback((clientX, clientY) => {
    if (!canvasRef.current) {
      return { x: 0, y: 0 }
    }

    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left - state.canvasOffset.x) / state.zoom,
      y: (clientY - rect.top - state.canvasOffset.y) / state.zoom,
    }
  }, [state.canvasOffset, state.zoom])

  const getNodeConnectionPoint = useCallback((node, pointType) => {
    if (!node) {
      return { x: 0, y: 0 }
    }

    switch (pointType) {
      case 'top':
        return { x: node.x + node.width / 2, y: node.y }
      case 'right':
        return { x: node.x + node.width, y: node.y + node.height / 2 }
      case 'bottom':
        return { x: node.x + node.width / 2, y: node.y + node.height }
      case 'left':
        return { x: node.x, y: node.y + node.height / 2 }
      default:
        return { x: node.x + node.width / 2, y: node.y + node.height / 2 }
    }
  }, [])

  // Handle drop from sidebar
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    
    try {
      const nodeData = JSON.parse(e.dataTransfer.getData('application/json'))
      const canvasRect = canvasRef.current.getBoundingClientRect()
      
      // Calculate position relative to canvas and zoom
      const x = (e.clientX - canvasRect.left - state.canvasOffset.x) / state.zoom
      const y = (e.clientY - canvasRect.top - state.canvasOffset.y) / state.zoom
      
      actions.addNode({
        ...nodeData,
        x: Math.max(0, x - nodeData.width / 2), // Center the node on drop point
        y: Math.max(0, y - nodeData.height / 2)
      })
    } catch (error) {
      console.warn('Failed to parse dropped data:', error)
    }
  }, [state.canvasOffset, state.zoom, actions])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  // Handle canvas click (deselect nodes)
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      actions.selectNode(null)
    }
  }, [actions])

  // Handle mouse events for panning
  const handleMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current && e.button === 0) { // Left click on canvas
      setIsPanning(true)
      setPanStart({
        x: e.clientX - state.canvasOffset.x,
        y: e.clientY - state.canvasOffset.y
      })
      e.preventDefault()
    }
  }, [state.canvasOffset])

  const handleMouseMove = useCallback((e) => {
    setMousePos(toCanvasCoords(e.clientX, e.clientY))

    if (isPanning) {
      const newOffset = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }
      actions.setCanvasOffset(newOffset)
    }
  }, [isPanning, panStart, actions, toCanvasCoords])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setIsConnecting(false)
    setConnectionStart(null)
  }, [])

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = -e.deltaY * 0.001
      const newZoom = Math.max(0.1, Math.min(3, state.zoom + delta))
      actions.setZoom(newZoom)
    }
  }, [state.zoom, actions])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (state.selectedNodeId) {
            actions.deleteNode(state.selectedNodeId)
          }
          break
        case 'Escape':
          actions.selectNode(null)
          setIsConnecting(false)
          setConnectionStart(null)
          break
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            // Select all logic could go here
          }
          break
      }
    }
  }, [state.selectedNodeId, actions])

  // Setup event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e)
    const handleGlobalMouseUp = () => handleMouseUp()
    
    if (isPanning || isConnecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isPanning, isConnecting, handleMouseMove, handleMouseUp])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Grid pattern style
  const gridStyle = {
    backgroundImage: `
      radial-gradient(circle, #e5e7eb 1px, transparent 1px),
      radial-gradient(circle, #f3f4f6 1px, transparent 1px)
    `,
    backgroundSize: `${20 * state.zoom}px ${20 * state.zoom}px, ${100 * state.zoom}px ${100 * state.zoom}px`,
    backgroundPosition: `${state.canvasOffset.x}px ${state.canvasOffset.y}px`
  }

  return (
    <div className="w-full h-full relative bg-white overflow-hidden select-none">
      {/* Canvas with grid */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        style={gridStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Transform container for zoom and pan */}
        <div
          style={{
            transform: `translate(${state.canvasOffset.x}px, ${state.canvasOffset.y}px) scale(${state.zoom})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
        >
          {/* Connection Lines Layer */}
          <ConnectionLines 
            connections={state.connections}
            nodes={state.nodes}
            isConnecting={isConnecting}
            connectionStart={connectionStart}
            mousePos={mousePos}
          />

          {/* Nodes Layer */}
          {state.nodes.map(node => (
            <RoadmapNode
              key={node.id}
              node={node}
              isSelected={node.id === state.selectedNodeId}
              onSelect={(id) => actions.selectNode(id)}
              onUpdate={(id, updates) => actions.updateNode(id, updates)}
              onDelete={(id) => actions.deleteNode(id)}
              onConnectionStart={(nodeId, point, coords) => {
                const node = state.nodes.find(n => n.id === nodeId)
                const startPoint = coords || getNodeConnectionPoint(node, point)
                setIsConnecting(true)
                setConnectionStart({ nodeId, point, x: startPoint.x, y: startPoint.y })
              }}
              onConnectionEnd={(nodeId, point) => {
                if (isConnecting && connectionStart && connectionStart.nodeId !== nodeId) {
                  actions.addConnection(connectionStart.nodeId, nodeId, connectionStart.point, point)
                }
                setIsConnecting(false)
                setConnectionStart(null)
              }}
            />
          ))}
        </div>

        {/* Empty state */}
        {state.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <div className="text-xl mb-2">🎯</div>
              <div className="text-lg font-medium mb-1">Start Building Your Roadmap</div>
              <div className="text-sm">
                Drag components from the sidebar or click them to add to canvas
              </div>
              <div className="text-xs mt-2 opacity-75">
                Use mouse wheel + Ctrl/Cmd to zoom • Drag canvas to pan
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/75 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        <div>Zoom: {Math.round(state.zoom * 100)}%</div>
        <div>Nodes: {state.nodes.length}</div>
        {state.selectedNodeId && (
          <div>Selected: {state.nodes.find(n => n.id === state.selectedNodeId)?.type}</div>
        )}
      </div>

      {/* Help Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-xs text-gray-600 max-w-xs">
        <div className="font-medium mb-2">Shortcuts:</div>
        <div>• <kbd>Delete</kbd> - Remove selected</div>
        <div>• <kbd>Esc</kbd> - Deselect all</div>
        <div>• <kbd>Ctrl/Cmd + Wheel</kbd> - Zoom</div>
        <div>• <kbd>Drag canvas</kbd> - Pan around</div>
        <div>• <kbd>Double-click node</kbd> - Edit content</div>
      </div>
    </div>
  )
}

export default RoadmapCanvas
