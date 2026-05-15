import React from 'react'
import { X, BookOpen, Layers, Link2, ListChecks, GraduationCap, Video, Image as ImageIcon, Code2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NodeDetailPanel = ({ node, onClose, onUpdateProgress, isCompleted, isSkipped, isAuthenticated }) => {
  const navigate = useNavigate()
  if (!node) return null

  const { label, description, category, resources, prerequisites, contentBlocks, videoUrl, tasks, referenceId } = node.data || {}

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

  const renderContentBlock = (block, idx) => {
    switch (block.type) {
      case 'text':
        return (
          <p key={idx} className="text-[14px] text-slate-300 leading-relaxed mb-4">
            {block.content}
          </p>
        )
      case 'code':
        return (
          <div key={idx} className="mb-4 rounded-lg overflow-hidden border border-white/[0.1] bg-[#0d0d16]">
            <div className="flex items-center justify-between px-4 py-1.5 bg-white/[0.04] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{block.language || 'code'}</span>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto custom-scrollbar text-[13px] font-mono leading-relaxed text-[#e2e8f0]">
              <code>{block.content}</code>
            </pre>
          </div>
        )
      case 'image':
        return (
          <div key={idx} className="mb-4 rounded-xl overflow-hidden border border-white/[0.1] bg-white/[0.02]">
            <img src={block.content} alt={block.caption || 'Lesson visual'} className="w-full h-auto object-cover" />
            {block.caption && (
              <div className="px-3 py-2 bg-black/40 text-center">
                <p className="text-[12px] text-slate-400 italic flex items-center justify-center gap-2">
                  <ImageIcon className="w-3 h-3" /> {block.caption}
                </p>
              </div>
            )}
          </div>
        )
      case 'video':
        return (
          <div key={idx} className="mb-4 rounded-xl overflow-hidden border border-white/[0.1] bg-black">
            <video controls src={block.content} className="w-full h-auto" />
            {block.caption && (
              <div className="px-3 py-2 bg-black/60 text-center">
                <p className="text-[12px] text-slate-400 italic flex items-center justify-center gap-2">
                  <Video className="w-3 h-3" /> {block.caption}
                </p>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  // Get Youtube Embed URL if possible
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : url;
  }

  const embedVideoUrl = videoUrl ? getEmbedUrl(videoUrl) : null;

  return (
    <aside className="h-full flex flex-col bg-[#0a0a12] border-l border-white/[0.08]" style={{ width: 520, flexShrink: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white truncate leading-tight tracking-wide">{label}</h2>
            {category && (
              <span
                className="inline-block mt-2.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest"
                style={{ color: accentColor, backgroundColor: accentBg }}
              >
                {category}
              </span>
            )}

            {/* Status Actions */}
            <div className="flex flex-col gap-3 mt-4">
              {(node.data?.nodeType === 'course' || node.data?.category === 'Lesson') && (
                <button
                  onClick={() => navigate(`/learn/${referenceId || node.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 group"
                >
                  <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  Di chuyển đến khóa học
                </button>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateProgress(node.id, isCompleted ? 'none' : 'completed')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200'
                      }`}
                  >
                    <CheckCircle2 size={14} />
                    {isCompleted ? 'Đã xong' : 'Hoàn thành'}
                  </button>

                  <button
                    onClick={() => onUpdateProgress(node.id, isSkipped ? 'none' : 'skipped')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSkipped
                        ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200'
                      }`}
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/15 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">

        {/* Main Video */}
        {embedVideoUrl && (
          <section className="rounded-xl overflow-hidden border border-white/[0.1] bg-black shadow-lg shadow-black/50">
            {embedVideoUrl.includes('youtube.com') ? (
              <iframe
                src={embedVideoUrl}
                className="w-full aspect-video"
                allowFullScreen
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video controls src={embedVideoUrl} className="w-full aspect-video" />
            )}
          </section>
        )}

        {/* Description */}
        {description && (
          <section>
            <p className="text-[15px] text-slate-300 leading-relaxed font-medium">
              {description}
            </p>
          </section>
        )}

        {contentBlocks && contentBlocks.length > 0 && (
          <section className="pt-2">
            {contentBlocks.map((block, idx) => renderContentBlock(block, idx))}
          </section>
        )}

        {prerequisites && prerequisites.length > 0 && (
          <section className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-amber-400" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Yêu cầu tiên quyết</span>
            </div>
            <ul className="space-y-2">
              {prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[14px] text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {prereq}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tasks Checklist */}
        {tasks && tasks.length > 0 && (
          <section className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Nhiệm vụ cần làm</span>
            </div>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded border-2 border-white/20 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white leading-none mb-1">{task.title}</p>
                      <p className="text-[11px] text-slate-500">{task.description || 'Hoàn thành nhiệm vụ này để nhận XP'}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-blue-600/10 rounded text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    +{task.xpReward || task.XPReward || 50} XP
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resources / Tài liệu */}
        {resources && resources.length > 0 && (
          <section className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Tài liệu & Tham khảo</span>
            </div>
            <ul className="space-y-2">
              {resources.map((res, idx) => {
                const isLink = res.startsWith('http')
                return (
                  <li key={idx}>
                    {isLink ? (
                      <a
                        href={res}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-[14px] text-blue-400 hover:text-blue-300 transition-colors break-all bg-white/[0.02] p-3 rounded-lg border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10"
                      >
                        <Link2 className="w-4 h-4 flex-shrink-0" />
                        {res}
                      </a>
                    ) : (
                      <span className="flex items-start gap-2.5 text-[14px] text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
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
        {!description && (!resources || resources.length === 0) && (!prerequisites || prerequisites.length === 0) && (!contentBlocks || contentBlocks.length === 0) && !videoUrl && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[14px] text-center font-medium">Nội dung bài học đang được cập nhật.</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default NodeDetailPanel
