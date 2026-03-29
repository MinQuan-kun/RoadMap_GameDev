import React from 'react'
import { ChevronRight, ChevronDown, Layers, Circle, Zap } from 'lucide-react'

const ModulePanel = ({ nodes, edges, selectedNodeId, expandedModules = new Set(), onNodeSelect }) => {
  // Build maps
  const nodeMap = {}
  nodes.forEach(n => { nodeMap[n.id] = n })

  const childrenMap = {}
  edges.forEach(e => {
    if (!childrenMap[e.source]) childrenMap[e.source] = []
    childrenMap[e.source].push(e.target)
  })

  const targetIds = new Set(edges.map(e => e.target))
  const rootNode = nodes.find(n => !targetIds.has(n.id))
  if (!rootNode) return null

  const moduleIds = childrenMap[rootNode.id] || []

  const catColors = {
    module: '#fbbf24',
    language: '#6366f1',
    engine: '#3b82f6',
    math: '#14b8a6',
    gameplay: '#10b981',
    ai: '#22d3ee',
    deploy: '#f97316',
    network: '#ef4444',
    architecture: '#8b5cf6',
    technical: '#f97316',
  }

  const getColor = (cat = '') => {
    const c = cat.toLowerCase()
    for (const [key, color] of Object.entries(catColors)) {
      if (c.includes(key)) return color
    }
    return '#64748b'
  }

  return (
    <aside className="h-full flex flex-col bg-[#0a0a12] border-r border-white/[0.06]" style={{ width: 260, flexShrink: 0 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-white">Modules</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{moduleIds.length} modules · {nodes.length} topics</p>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
        {moduleIds.map(modId => {
          const mod = nodeMap[modId]
          if (!mod) return null

          const isExpanded = expandedModules.has(modId)
          const isActive = selectedNodeId === modId
          const children = (childrenMap[modId] || []).map(id => nodeMap[id]).filter(Boolean)

          return (
            <div key={modId}>
              {/* Module */}
              <button
                onClick={() => onNodeSelect(mod)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all group
                  ${isActive ? 'bg-yellow-500/10 text-yellow-300' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'}`}
              >
                {children.length > 0 ? (
                  isExpanded
                    ? <ChevronDown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                ) : <div className="w-3.5" />}
                <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span className="text-[13px] font-semibold truncate">{mod.data?.label}</span>
                {children.length > 0 && (
                  <span className="ml-auto text-[10px] text-slate-600 flex-shrink-0">{children.length}</span>
                )}
              </button>

              {/* Children (topics) */}
              {isExpanded && children.length > 0 && (
                <div className="ml-5 border-l border-white/[0.06]">
                  {children.map(child => {
                    const isChildActive = selectedNodeId === child.id
                    const color = getColor(child.data?.category)
                    const grandChildren = (childrenMap[child.id] || []).map(id => nodeMap[id]).filter(Boolean)
                    const isChildExpanded = expandedModules.has(child.id)

                    return (
                      <div key={child.id}>
                        <button
                          onClick={() => onNodeSelect(child)}
                          className={`w-full flex items-center gap-2 pl-4 pr-3 py-1.5 text-left transition-all
                            ${isChildActive ? 'bg-white/[0.06] text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}`}
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-[12px] truncate">{child.data?.label}</span>
                          {grandChildren.length > 0 && (
                            <span className="ml-auto text-[10px] text-slate-600">{grandChildren.length}</span>
                          )}
                        </button>

                        {/* Grand-children */}
                        {isChildExpanded && grandChildren.length > 0 && (
                          <div className="ml-4 border-l border-white/[0.04]">
                            {grandChildren.map(gc => (
                              <button
                                key={gc.id}
                                onClick={() => onNodeSelect(gc)}
                                className={`w-full flex items-center gap-1.5 pl-4 pr-3 py-1 text-left transition-all
                                  ${selectedNodeId === gc.id ? 'text-blue-300' : 'text-slate-600 hover:text-slate-400'}`}
                              >
                                <Circle className="w-1.5 h-1.5 flex-shrink-0" fill="currentColor" />
                                <span className="text-[11px] truncate">{gc.data?.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default ModulePanel
