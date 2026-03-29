import React from 'react'
import { X, BookOpen, Layers, Link2, ListChecks, GraduationCap } from 'lucide-react'

const NodeDetailPanel = ({ node, onClose }) => {
  if (!node) return null

  const { label, description, category, resources, prerequisites } = node.data || {}

  const categoryColors = {
    'language': ['#6366f1', 'rgba(99,102,241,0.12)'],
    'oop': ['#a78bfa', 'rgba(167,139,250,0.12)'],
    'engine': ['#3b82f6', 'rgba(59,130,246,0.12)'],
    'editor': ['#38bdf8', 'rgba(56,189,248,0.12)'],
    'gameplay': ['#10b981', 'rgba(16,185,129,0.12)'],
    'physics': ['#14b8a6', 'rgba(20,184,166,0.12)'],
    'visual': ['#f59e0b', 'rgba(245,158,11,0.12)'],
    'animation': ['#fb923c', 'rgba(251,146,60,0.12)'],
    'ui': ['#f472b6', 'rgba(244,114,182,0.12)'],
    'sound': ['#ec4899', 'rgba(236,72,153,0.12)'],
    'audio': ['#ec4899', 'rgba(236,72,153,0.12)'],
    'architecture': ['#8b5cf6', 'rgba(139,92,246,0.12)'],
    'design pattern': ['#a78bfa', 'rgba(167,139,250,0.12)'],
    'technical': ['#f97316', 'rgba(249,115,22,0.12)'],
    'data': ['#06b6d4', 'rgba(6,182,212,0.12)'],
    'performance': ['#ef4444', 'rgba(239,68,68,0.12)'],
    'ai': ['#22d3ee', 'rgba(34,211,238,0.12)'],
    'network': ['#ef4444', 'rgba(239,68,68,0.12)'],
    'business': ['#ec4899', 'rgba(236,72,153,0.12)'],
  }

  const getColorPair = (cat = '') => {
    const c = cat.toLowerCase()
    for (const [key, pair] of Object.entries(categoryColors)) {
      if (c.includes(key)) return pair
    }
    return ['#6b7280', 'rgba(107,114,128,0.12)']
  }

  const [accentColor, accentBg] = getColorPair(category)

  return (
    <aside className="h-full flex flex-col bg-[#0a0a12] border-l border-white/[0.06]" style={{ width: 340, flexShrink: 0 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white truncate leading-tight">{label}</h2>
            {category && (
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: accentColor, backgroundColor: accentBg }}
              >
                {category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
        {/* Description */}
        {description && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Mô tả</span>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">
              {description}
            </p>
          </section>
        )}

        {/* Prerequisites */}
        {prerequisites && prerequisites.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Yêu cầu tiên quyết</span>
            </div>
            <ul className="space-y-1.5">
              {prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-300">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                  {prereq}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resources / Tài liệu */}
        {resources && resources.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Tài liệu & Cách học</span>
            </div>
            <ul className="space-y-1.5">
              {resources.map((res, idx) => {
                const isLink = res.startsWith('http')
                return (
                  <li key={idx}>
                    {isLink ? (
                      <a
                        href={res}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] text-blue-400 hover:text-blue-300 transition-colors break-all"
                      >
                        <Link2 className="w-3 h-3 flex-shrink-0" />
                        {res}
                      </a>
                    ) : (
                      <span className="flex items-start gap-2 text-[13px] text-slate-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                        {res}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Empty state */}
        {!description && (!resources || resources.length === 0) && (!prerequisites || prerequisites.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <BookOpen className="w-8 h-8 mb-3 opacity-30" />
            <p className="text-[13px] text-center">Chưa có thông tin chi tiết<br/>cho node này.</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default NodeDetailPanel
