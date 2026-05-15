import React from 'react'
import { ChevronRight, ChevronDown, Layers, PlayCircle, BookOpen, CheckCircle2, MonitorPlay, Box } from 'lucide-react'

const CoursePanel = ({ 
  pathwayContent = [], 
  selectedNodeId, 
  expandedModules = new Set(), 
  onNodeSelect, 
  onToggleModule 
}) => {
  
  if (!pathwayContent || pathwayContent.length === 0) {
    return (
      <aside className="h-full flex flex-col bg-[#050505] border-r border-white/[0.04]" style={{ width: 340, flexShrink: 0 }}>
        <div className="p-12 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
            <MonitorPlay className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Đang tải nội dung...</p>
          <p className="text-[10px] text-slate-700 mt-1 italic">Vui lòng chờ trong giây lát</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="h-full flex flex-col bg-[#050505] border-r border-white/[0.04] shadow-2xl z-30" style={{ width: 340, flexShrink: 0 }}>
      {/* Header */}
      <div className="px-6 py-8 border-b border-white/[0.04] bg-[#0a0a0f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <MonitorPlay className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <span className="text-sm font-black text-white tracking-tight block">Lộ trình học tập</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cấu trúc bài học</span>
          </div>
        </div>
      </div>

      {/* Course/Module/Lesson List */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4">
        {pathwayContent.map((course, cIdx) => (
          <div key={course.Id || course.id} className="mb-8">
            {/* 1. COURSE LEVEL */}
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                {cIdx + 1}
              </div>
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider truncate">
                {course.Title || course.title}
              </h3>
            </div>
            
            <div className="space-y-2">
              {(course.Modules || course.modules || []).map((module) => {
                const modId = module.Id || module.id
                const isExpanded = expandedModules.has(modId)
                const lessons = module.Lessons || module.lessons || []
                
                return (
                  <div key={modId} className="space-y-1">
                    {/* 2. MODULE LEVEL */}
                    <div
                      className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer border
                        ${isExpanded 
                          ? 'bg-white/[0.04] border-white/5 shadow-lg' 
                          : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}
                      onClick={() => onToggleModule && onToggleModule(modId)}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                        ${isExpanded ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-slate-600'}`}>
                        <Box size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-black truncate transition-colors ${isExpanded ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                          {module.Title || module.title}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight mt-0.5">
                          {lessons.length} Bài học
                        </p>
                      </div>

                      <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180 text-blue-500' : 'text-slate-700'}`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    {/* 3. LESSONS LEVEL */}
                    {isExpanded && (
                      <div className="ml-7 pl-5 border-l-2 border-blue-600/10 py-2 space-y-1.5">
                        {lessons.map((lesson) => {
                          const lessonId = lesson.Id || lesson.id
                          const isActive = selectedNodeId === lessonId
                          
                          return (
                            <button
                              key={lessonId}
                              onClick={() => onNodeSelect && onNodeSelect({ 
                                id: lessonId, 
                                data: { 
                                  label: lesson.Title || lesson.title,
                                  description: lesson.Description || lesson.description,
                                  contentBlocks: lesson.ContentBlocks || lesson.contentBlocks || [],
                                  videoUrl: lesson.VideoUrl || lesson.videoUrl,
                                  resources: lesson.Resources || lesson.resources || [],
                                  prerequisites: lesson.Prerequisites || lesson.prerequisites || [],
                                  tasks: lesson.Tasks || lesson.tasks || [],
                                  category: 'Lesson'
                                } 
                              })}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group relative
                                ${isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'}`}
                            >
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full transition-all
                                ${isActive ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-800 group-hover:bg-slate-600'}`} />
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold truncate leading-tight">{lesson.Title || lesson.title}</p>
                              </div>

                              <PlayCircle size={14} className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                              
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-full" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-[#0a0a0f]/80 border-t border-white/[0.04]">
        <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Tiến độ</p>
            <p className="text-xs font-black text-white">Bắt đầu ngay</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default CoursePanel
