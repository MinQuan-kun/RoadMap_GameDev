import React, { useState } from 'react'
import { 
  Save, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Share2, 
  Settings, 
  ZoomIn, 
  ZoomOut, 
  Home,
  Undo,
  Redo
} from 'lucide-react'
import Header from '../components/Header'
import ComponentSidebar from '../components/RoadmapBuilder/ComponentSidebar'
import RoadmapCanvas from '../components/RoadmapBuilder/RoadmapCanvas'
import NodeEditor from '../components/RoadmapBuilder/NodeEditor'
import { RoadmapProvider, useRoadmap } from '../context/RoadmapContext.jsx'

const RoadmapBuilderContent = ({ onOpenLogin, onOpenRegister }) => {
  const { state, actions, selectedNode, hasChanges } = useRoadmap()
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Handle title change
  const handleTitleChange = (e) => {
    actions.setTitle(e.target.value)
  }

  // Handle save as JSON
  const handleExport = () => {
    const exportData = actions.exportRoadmap()
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${state.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Handle import JSON
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            actions.importRoadmap(data)
          } catch (error) {
            alert('Invalid JSON file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    actions.setZoom(state.zoom + 0.1)
  }

  const handleZoomOut = () => {
    actions.setZoom(state.zoom - 0.1)
  }

  const handleZoomReset = () => {
    actions.setZoom(1)
    actions.setCanvasOffset({ x: 0, y: 0 })
  }

  // Handle clear all
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire roadmap? This cannot be undone.')) {
      actions.resetRoadmap()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Title Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-gray-900">Roadmap Builder</h1>
              <div className="flex items-center gap-1">
                {hasChanges && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
                )}
                <button
                  onClick={handleExport}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleImport}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                  title="Import JSON"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={state.title}
              onChange={handleTitleChange}
              placeholder="Enter roadmap title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Stats */}
            <div className="mt-3 text-xs text-gray-500 flex justify-between">
              <span>{state.nodes.length} nodes</span>
              <span>{state.connections.length} connections</span>
            </div>
          </div>

          {/* Components Sidebar */}
          <div className="flex-1 overflow-y-auto">
            <ComponentSidebar />
          </div>

          {/* Usage Hints */}
          <div className="p-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="font-medium mb-2">Quick Tips:</div>
            <ul className="space-y-1">
              <li>• Drag components to canvas</li>
              <li>• Double-click nodes to edit</li>
              <li>• Drag from node edges to connect</li>
              <li>• Right-click for context menu</li>
            </ul>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="text-sm text-gray-500 min-w-[60px] text-center">
                {Math.round(state.zoom * 100)}%
              </div>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomReset}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Reset View"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                Grid
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                Snap
              </button>
              <div className="h-4 w-px bg-gray-300 mx-2" />
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                Share
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <RoadmapCanvas />
          </div>

          {/* Status Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
            <div>
              {selectedNode ? `Selected: ${selectedNode.content || selectedNode.type}` : 'No selection'}
            </div>
            <div>
              Last saved: {hasChanges ? 'Auto-saving...' : 'Up to date'}
            </div>
          </div>
        </div>

        {/* Right Panel - Node Editor (conditionally shown) */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <NodeEditor 
                node={selectedNode}
                onClose={() => actions.selectNode(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main component with Provider
const RoadmapBuilder = ({ onOpenLogin, onOpenRegister }) => {
  return (
    <RoadmapProvider>
      <RoadmapBuilderContent 
        onOpenLogin={onOpenLogin} 
        onOpenRegister={onOpenRegister} 
      />
    </RoadmapProvider>
  )
}

export default RoadmapBuilder
