import React from 'react'

const ConnectionLines = ({ 
  connections, 
  nodes, 
  isConnecting = false, 
  connectionStart = null, 
  mousePos = { x: 0, y: 0 }
}) => {
  // Helper function to get node by ID
  const getNodeById = (nodeId) => {
    return nodes.find(node => node.id === nodeId)
  }

  // Helper function to calculate connection point coordinates
  const getConnectionPoint = (node, pointType) => {
    if (!node) return { x: 0, y: 0 }

    const { x, y, width, height } = node

    switch (pointType) {
      case 'top':
        return { x: x + width / 2, y: y }
      case 'right':
        return { x: x + width, y: y + height / 2 }
      case 'bottom':
        return { x: x + width / 2, y: y + height }
      case 'left':
        return { x: x, y: y + height / 2 }
      default:
        return { x: x + width / 2, y: y + height / 2 }
    }
  }

  // Generate smooth bezier curve path
  const generatePath = (start, end, startType, endType) => {
    const controlOffset = 50 // Distance for control points

    // Calculate control points based on connection types
    let cp1, cp2

    switch (startType) {
      case 'top':
        cp1 = { x: start.x, y: start.y - controlOffset }
        break
      case 'bottom':
        cp1 = { x: start.x, y: start.y + controlOffset }
        break
      case 'left':
        cp1 = { x: start.x - controlOffset, y: start.y }
        break
      case 'right':
        cp1 = { x: start.x + controlOffset, y: start.y }
        break
      default:
        cp1 = { x: start.x, y: start.y - controlOffset }
    }

    switch (endType) {
      case 'top':
        cp2 = { x: end.x, y: end.y - controlOffset }
        break
      case 'bottom':
        cp2 = { x: end.x, y: end.y + controlOffset }
        break
      case 'left':
        cp2 = { x: end.x - controlOffset, y: end.y }
        break
      case 'right':
        cp2 = { x: end.x + controlOffset, y: end.y }
        break
      default:
        cp2 = { x: end.x, y: end.y - controlOffset }
    }

    return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`
  }

  // Generate straight line path (fallback)
  const generateStraightPath = (start, end) => {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'visible'
      }}
    >
      {/* Definitions for arrowheads and patterns */}
      <defs>
        {/* Standard arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
            className="transition-colors duration-200"
          />
        </marker>

        {/* Selected arrow marker */}
        <marker
          id="arrowhead-selected"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#1d4ed8"
          />
        </marker>

        {/* Drop shadow filter */}
        <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="1" result="offset"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Render existing connections */}
      {connections.map(connection => {
        const fromNode = getNodeById(connection.fromNodeId)
        const toNode = getNodeById(connection.toNodeId)

        if (!fromNode || !toNode) return null

        const start = getConnectionPoint(fromNode, connection.fromPoint)
        const end = getConnectionPoint(toNode, connection.toPoint)
        const path = generatePath(start, end, connection.fromPoint, connection.toPoint)

        return (
          <g key={connection.id}>
            {/* Connection line */}
            <path
              d={path}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="transition-all duration-200 hover:stroke-blue-700 hover:stroke-width-3"
              filter="url(#dropshadow)"
            />
            
            {/* Connection label (if any) */}
            {connection.label && (
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-gray-600 bg-white"
                style={{ textShadow: '0 0 3px white' }}
              >
                {connection.label}
              </text>
            )}

            {/* Delete button for connection (on hover) */}
            <circle
              cx={(start.x + end.x) / 2}
              cy={(start.y + end.y) / 2}
              r="8"
              fill="red"
              className="opacity-0 hover:opacity-100 cursor-pointer pointer-events-all transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation()
                // Add delete connection logic here
                // onDeleteConnection(connection.id)
              }}
            />
            <text
              x={(start.x + end.x) / 2}
              y={(start.y + end.y) / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-white pointer-events-none"
              style={{ fontSize: '10px' }}
            >
              ×
            </text>
          </g>
        )
      })}

      {/* Render temporary connection while dragging */}
      {isConnecting && connectionStart && (
        <path
          d={generateStraightPath(
            connectionStart,
            {
              x: mousePos.x,
              y: mousePos.y
            }
          )}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          className="animate-pulse opacity-75"
        />
      )}
    </svg>
  )
}

export default ConnectionLines