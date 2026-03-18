import React, { useState } from 'react'
import { X, Palette, Type, Move, Link2 } from 'lucide-react'
import { useRoadmap, NODE_TYPES } from '../../context/RoadmapContext.jsx'

const NodeEditor = ({ node, onClose }) => {
  const { actions } = useRoadmap()
  const [activeTab, setActiveTab] = useState('content')

  const handleUpdate = (updates) => {
    actions.updateNode(node.id, updates)
  }

  const handleStyleUpdate = (styleUpdates) => {
    const newStyle = { ...node.style, ...styleUpdates }
    handleUpdate({ style: newStyle })
  }

  const colorPresets = [
    { name: 'Blue', bg: '#3b82f6', border: '#2563eb', text: 'white' },
    { name: 'Green', bg: '#10b981', border: '#059669', text: 'white' },
    { name: 'Yellow', bg: '#f59e0b', border: '#d97706', text: 'black' },
    { name: 'Red', bg: '#ef4444', border: '#dc2626', text: 'white' },
    { name: 'Purple', bg: '#8b5cf6', border: '#7c3aed', text: 'white' },
    { name: 'Gray', bg: '#6b7280', border: '#4b5563', text: 'white' },
    { name: 'White', bg: '#ffffff', border: '#d1d5db', text: 'black' },
  ]

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Edit Node</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'content', label: 'Content', icon: Type },
          { id: 'style', label: 'Style', icon: Palette },
          { id: 'position', label: 'Position', icon: Move }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Node Type Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                {node.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </div>

            {/* Content Editor */}
            {node.type !== NODE_TYPES.HORIZONTAL_LINE && node.type !== NODE_TYPES.VERTICAL_LINE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                {node.type === NODE_TYPES.PARAGRAPH ? (
                  <textarea
                    value={node.content || ''}
                    onChange={(e) => handleUpdate({ content: e.target.value })}
                    placeholder="Enter text content..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={node.content || ''}
                    onChange={(e) => handleUpdate({ content: e.target.value })}
                    placeholder="Enter node content..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            )}

            {/* Links for clickable nodes */}
            {(node.type === NODE_TYPES.BUTTON || node.type === NODE_TYPES.RESOURCE_BUTTON || node.type === NODE_TYPES.LINKS_GROUP) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Link URL
                </label>
                <input
                  type="url"
                  value={node.link || ''}
                  onChange={(e) => handleUpdate({ link: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handleStyleUpdate({
                      backgroundColor: preset.bg,
                      borderColor: preset.border,
                      color: preset.text
                    })}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={node.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleUpdate({ backgroundColor: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Color
              </label>
              <input
                type="color"
                value={node.style.borderColor || '#d1d5db'}
                onChange={(e) => handleStyleUpdate({ borderColor: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={node.style.color || '#000000'}
                onChange={(e) => handleStyleUpdate({ color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded"
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {parseInt(node.style.fontSize) || 14}px
              </label>
              <input
                type="range"
                min="10"
                max="32"
                value={parseInt(node.style.fontSize) || 14}
                onChange={(e) => handleStyleUpdate({ fontSize: `${e.target.value}px` })}
                className="w-full"
              />
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius: {parseInt(node.style.borderRadius) || 8}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={parseInt(node.style.borderRadius) || 8}
                onChange={(e) => handleStyleUpdate({ borderRadius: `${e.target.value}px` })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {activeTab === 'position' && (
          <div className="space-y-4">
            {/* Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position
                </label>
                <input
                  type="number"
                  value={Math.round(node.x)}
                  onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position
                </label>
                <input
                  type="number"
                  value={Math.round(node.y)}
                  onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={Math.round(node.width)}
                  onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 100 })}
                  min="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={Math.round(node.height)}
                  onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 40 })}
                  min="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Actions
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleUpdate({ x: 0, y: 0 })}
                  className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Move to Origin (0, 0)
                </button>
                <button
                  onClick={() => {
                    const centerX = Math.max(0, 400 - node.width / 2)
                    const centerY = Math.max(0, 300 - node.height / 2)
                    handleUpdate({ x: centerX, y: centerY })
                  }}
                  className="w-full px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  Center in View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with node info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <div>ID: {node.id}</div>
          <div>Created: {new Date(node.createdAt).toLocaleDateString()}</div>
          {node.updatedAt && (
            <div>Updated: {new Date(node.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NodeEditor