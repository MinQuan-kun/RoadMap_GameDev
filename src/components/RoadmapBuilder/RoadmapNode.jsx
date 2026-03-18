import React, { useState, useRef, useEffect } from 'react'
import { Edit2, Trash2, Copy, Link } from 'lucide-react'
import { NODE_TYPES } from '../../context/RoadmapContext.jsx'

const RoadmapNode = ({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onConnectionStart,
  onConnectionEnd
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(node.content || '')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  const [showConnections, setShowConnections] = useState(false)
  
  const nodeRef = useRef(null)
  const editInputRef = useRef(null)

  // Handle node selection
  const handleMouseDown = (e) => {
    if (e.button === 0 && !isEditing) { // Left click
      e.stopPropagation()
      onSelect(node.id)
      
      // Start dragging
      setIsDragging(true)
      setDragStart({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      })
    }
  }

  // Handle node dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x)
        const newY = Math.max(0, e.clientY - dragStart.y)
        onUpdate(node.id, { x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onUpdate, node.id])

  // Handle double click to edit
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (node.type !== NODE_TYPES.HORIZONTAL_LINE && node.type !== NODE_TYPES.VERTICAL_LINE) {
      setIsEditing(true)
      setEditContent(node.content || '')
    }
  }

  // Handle edit save
  const handleEditSave = () => {
    onUpdate(node.id, { content: editContent })
    setIsEditing(false)
  }

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditContent(node.content || '')
    setIsEditing(false)
  }

  // Handle keyboard in edit mode
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditSave()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  // Handle context menu
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  // Focus edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  // Connection points for the node
  const connectionPoints = [
    { id: 'top', x: '50%', y: '0%', transform: 'translate(-50%, -50%)' },
    { id: 'right', x: '100%', y: '50%', transform: 'translate(-50%, -50%)' },
    { id: 'bottom', x: '50%', y: '100%', transform: 'translate(-50%, -50%)' },
    { id: 'left', x: '0%', y: '50%', transform: 'translate(-50%, -50%)' }
  ]

  // Handle connection point interactions
  const handleConnectionMouseDown = (e, pointId) => {
    e.stopPropagation()
    const point = connectionPoints.find(p => p.id === pointId)
    if (point && onConnectionStart) {
      const rect = nodeRef.current.getBoundingClientRect()
      const pointX = rect.left + (rect.width * parseInt(point.x) / 100)
      const pointY = rect.top + (rect.height * parseInt(point.y) / 100)
      onConnectionStart(node.id, pointId, { x: pointX, y: pointY })
    }
  }

  const handleConnectionMouseUp = (e, pointId) => {
    e.stopPropagation()
    if (onConnectionEnd) {
      onConnectionEnd(node.id, pointId)
    }
  }

  // Render different node types with specific behaviors
  const renderNodeContent = () => {
    if (isEditing) {
      return (
        <input
          ref={editInputRef}
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditSave}
          className="w-full h-full bg-transparent border-none outline-none text-center resize-none"
          style={{
            fontSize: node.style.fontSize,
            color: node.style.color,
            fontWeight: node.style.fontWeight
          }}
        />
      )
    }

    // Special rendering for line types
    if (node.type === NODE_TYPES.HORIZONTAL_LINE || node.type === NODE_TYPES.VERTICAL_LINE) {
      return null // Lines don't have text content
    }

    // Different behaviors for different node types
    const getNodeSpecificStyle = () => {
      switch (node.type) {
        case NODE_TYPES.TITLE:
          return {
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '12px'
          }
        case NODE_TYPES.TOPIC:
          return {
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '10px'
          }
        case NODE_TYPES.SUBTOPIC:
          return {
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            padding: '8px'
          }
        case NODE_TYPES.BUTTON:
        case NODE_TYPES.RESOURCE_BUTTON:
          return {
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '8px 16px',
            cursor: node.link ? 'pointer' : 'default'
          }
        default:
          return {
            fontSize: node.style.fontSize || '14px',
            fontWeight: node.style.fontWeight || 'normal',
            textAlign: 'center',
            padding: '8px'
          }
      }
    }

    const specificStyle = getNodeSpecificStyle()

    return (
      <div
        className={`w-full h-full flex items-center justify-center ${
          (node.type === NODE_TYPES.BUTTON || node.type === NODE_TYPES.RESOURCE_BUTTON) && node.link
            ? 'hover:opacity-80 transition-opacity'
            : ''
        }`}
        style={{
          ...specificStyle,
          color: node.style.color || '#000',
        }}
        onClick={(e) => {
          if (node.link && (node.type === NODE_TYPES.BUTTON || node.type === NODE_TYPES.RESOURCE_BUTTON)) {
            e.stopPropagation()
            window.open(node.link, '_blank')
          }
        }}
      >
        {node.content || `${node.type.charAt(0).toUpperCase()}${node.type.slice(1)}`}
      </div>
    )
  }

  return (
    <>
      {/* Main Node */}
      <div
        ref={nodeRef}
        className={`absolute cursor-move select-none transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : ''
        } ${isDragging ? 'shadow-2xl scale-105 z-50' : 'hover:shadow-md'}`}
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height,
          backgroundColor: node.style.backgroundColor,
          borderColor: node.style.borderColor,
          borderWidth: node.style.border ? '2px' : '0',
          borderStyle: node.style.border ? 'solid' : 'none',
          borderRadius: node.style.borderRadius,
          zIndex: isSelected ? 10 : 1
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setShowConnections(true)}
        onMouseLeave={() => setShowConnections(false)}
      >
        {renderNodeContent()}

        {/* Connection Points */}
        {(isSelected || showConnections) && 
         node.type !== NODE_TYPES.HORIZONTAL_LINE && 
         node.type !== NODE_TYPES.VERTICAL_LINE && (
          <>
            {connectionPoints.map(point => (
              <div
                key={point.id}
                className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-crosshair hover:bg-blue-600 transition-colors shadow-md"
                style={{
                  left: point.x,
                  top: point.y,
                  transform: point.transform,
                  zIndex: 20
                }}
                onMouseDown={(e) => handleConnectionMouseDown(e, point.id)}
                onMouseUp={(e) => handleConnectionMouseUp(e, point.id)}
              />
            ))}
          </>
        )}

        {/* Resize Handles */}
        {isSelected && (
          <>
            {/* Corner resize handles */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize" />
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" />
          </>
        )}
      </div>

      {/* Action Buttons */}
      {isSelected && !isEditing && (
        <div
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 flex items-center p-1 z-30"
          style={{
            left: node.x + node.width + 8,
            top: node.y - 4
          }}
        >
          <button
            onClick={() => {
              setIsEditing(true)
              setEditContent(node.content || '')
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              // Copy node logic
              const newNode = {
                ...node,
                id: undefined, // Will be generated
                x: node.x + 20,
                y: node.y + 20,
                content: node.content + ' Copy'
              }
              // You'd need to pass this up through props
            }}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          style={{
            left: contextMenuPos.x,
            top: contextMenuPos.y
          }}
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => {
              setIsEditing(true)
              setShowContextMenu(false)
            }}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => {
              // Duplicate logic
              setShowContextMenu(false)
            }}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <hr className="my-1" />
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => {
              onDelete(node.id)
              setShowContextMenu(false)
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </>
  )
}

export default RoadmapNode
