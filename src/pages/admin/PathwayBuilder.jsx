import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  Info,
  Layers,
  FileText,
  CheckCircle2,
  Share2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Save,
  ArrowRight,
  MousePointer2,
  GitBranch,
  Settings,
  Image as ImageIcon,
  Clock,
  Zap,
  Target,
  Eye,
  X,
  Video,
  Play
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createFullPathway, updateFullPathway, getFullPathway, uploadFile } from '../../services/adminApi'

const steps = [
  { id: 1, label: 'Thông tin chung', icon: Info },
  { id: 2, label: 'Cấu trúc Giai đoạn', icon: Layers },
  { id: 3, label: 'Học phần & Bài học', icon: FileText },
  { id: 4, label: 'Nhiệm vụ & Quiz', icon: CheckCircle2 },
  { id: 5, label: 'Thiết kế Sơ đồ', icon: GitBranch },
  { id: 6, label: 'Hoàn tất', icon: Share2 },
]

const nodeTypes = {}
const edgeTypes = {}

const PathwayBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingTask, setEditingTask] = useState(null) // { courseId, moduleId, lessonId, taskIdx, task }

  // MAIN STATE
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    difficulty: 'beginner',
    estimatedHours: 40,
    tags: [],
    isOfficial: true,
    courses: [
      { id: 'c-1', title: 'Giai đoạn 1', description: '', modules: [] }
    ]
  })

  // Fetch data if editing
  useEffect(() => {
    if (id) {
      const loadPathway = async () => {
        setLoading(true)
        try {
          const data = await getFullPathway(id)
          setForm({
            ...data,
            courses: (data.courses || []).map(c => ({
              ...c,
              modules: (c.modules || []).map(m => ({
                ...m,
                lessons: (m.lessons || []).map(l => ({
                   ...l,
                   tasks: l.tasks || []
                }))
              }))
            }))
          })

          // Restore graph if exists
          if (data.graph && (data.graph.nodes || data.graph.Nodes)) {
             const nodesList = data.graph.nodes || data.graph.Nodes;
             const restoredNodes = nodesList.map(n => ({
               id: n.id || n._id,
               type: 'course',
               position: { x: n.positionX || n.PositionX, y: n.positionY || n.PositionY },
               data: { label: n.title || n.Title, courseId: n.referenceId || n.ReferenceId }
             }))
             setNodes(restoredNodes)
          }
        } catch (err) {
          toast.error('Không thể tải dữ liệu lộ trình')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      loadPathway()
    }
  }, [id])

  // Load Draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('pathway_draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (window.confirm('Tìm thấy bản nháp từ lần trước! Bạn có muốn khôi phục không?')) {
          setForm(parsed)
          toast.success('Đã khôi phục bản nháp!')
        }
      } catch (err) {
        console.error('Lỗi khi tải bản nháp:', err)
      }
    }
  }, [])

  // GRAPH STATE
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // NAVIGATION & VALIDATION
  const validateStep = (stepId) => {
    switch (stepId) {
      case 1:
        return form.title.trim() !== '' && form.slug.trim() !== ''
      case 2:
        return form.courses.length > 0 && form.courses.every(c => c.title.trim() !== '')
      case 3:
        return form.courses.every(c =>
          c.modules.length > 0 &&
          c.modules.every(m => m.title.trim() !== '' && m.lessons.length > 0)
        )
      default:
        return true
    }
  }

  // Sync nodes with courses (TOP LEVEL)
  useEffect(() => {
    setNodes(prevNodes => {
      const nodeMap = new Map(prevNodes.map(n => [n.id, n]))
      return form.courses.map((c, i) => {
        const existing = nodeMap.get(c.id)
        return {
          id: c.id,
          data: { label: c.title },
          position: existing ? existing.position : { x: 250, y: i * 100 },
          className: 'bg-indigo-600 text-white rounded-xl font-bold p-4 border-none shadow-xl'
        }
      })
    })
  }, [form.courses])

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    } else {
      toast.error('Vui lòng hoàn thành đầy đủ thông tin ở bước này trước khi tiếp tục!')
    }
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const canNavigateTo = (stepId) => {
    for (let i = 1; i < stepId; i++) {
      if (!validateStep(i)) return false
    }
    return true
  }

  // HELPERS
  const handlePublish = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        graph: {
          nodes: nodes.map(n => ({
            courseId: n.id,
            x: n.position.x,
            y: n.position.y
          })),
          edges: edges.map(e => ({
            sourceId: e.source,
            targetId: e.target
          }))
        }
      }

      if (id) {
        await updateFullPathway(id, payload)
        toast.success('Đã cập nhật lộ trình thành công!')
      } else {
        await createFullPathway(payload)
        toast.success('Đã xuất bản lộ trình thành công!')
      }
      
      localStorage.removeItem('pathway_draft')
      navigate('/admin/roadmaps')
    } catch (err) {
      console.error(err)
      toast.error('Thao tác thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    localStorage.setItem('pathway_draft', JSON.stringify(form))
    toast.success('Đã lưu bản nháp vào trình duyệt!')
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await uploadFile(file, 'pathways')
      setForm({ ...form, thumbnail: data.url })
      toast.success('Đã tải ảnh lên!')
    } catch (err) {
      toast.error('Lỗi khi tải ảnh')
    } finally {
      setUploading(false)
    }
  }

  // STEP RENDERERS
  const renderStep1 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tiêu đề Lộ trình</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Unity Game Developer"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Slug (URL)</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              placeholder="unity-game-developer"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mô tả tổng quan</label>
          <textarea
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Độ khó</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Thời gian (Giờ)</label>
            <input 
              type="number" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" 
              value={isNaN(form.estimatedHours) ? '' : form.estimatedHours} 
              onChange={e => {
                const val = parseInt(e.target.value);
                setForm({ ...form, estimatedHours: isNaN(val) ? 0 : val });
              }} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ảnh nền</label>
            <label className="flex items-center justify-center w-full h-[50px] bg-slate-950 border border-slate-800 border-dashed rounded-xl cursor-pointer hover:border-indigo-500/50">
              <span className="text-xs text-slate-500">{form.thumbnail ? 'Đã có ảnh' : 'Chọn ảnh...'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tags (Kỹ năng, Công nghệ)</label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[60px] focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-600/30 animate-scale-in">
                {tag}
                <button
                  onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })}
                  className="hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 bg-transparent border-none text-white text-sm outline-none px-2 min-w-[150px]"
              placeholder="Gõ tag và nhấn Enter để thêm..."
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                  e.preventDefault()
                  const val = e.target.value.trim()
                  if (!form.tags.includes(val)) {
                    setForm({ ...form, tags: [...form.tags, val] })
                  }
                  e.target.value = ''
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="animate-fade-in space-y-4">
      {form.courses.map((course, idx) => (
        <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold">{idx + 1}</div>
            <div>
              <input
                className="bg-transparent border-none text-white font-bold text-lg p-0 focus:ring-0"
                value={course.title}
                onChange={e => {
                  const next = [...form.courses]; next[idx].title = e.target.value; setForm({ ...form, courses: next })
                }}
              />
              <p className="text-xs text-slate-500">{course.modules.length} Học phần</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa giai đoạn "${course.title}"?`)) {
                setForm({...form, courses: form.courses.filter((_, i) => i !== idx)})
              }
            }}
            className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        onClick={() => setForm({ ...form, courses: [...form.courses, { id: 'c-' + Date.now(), title: 'Giai đoạn mới', modules: [] }] })}
        className="w-full py-4 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 flex items-center justify-center gap-2 font-bold transition-all"
      >
        <Plus size={20} /> Thêm Giai đoạn mới
      </button>
    </div>
  )

  const renderStep3 = () => (
    <div className="animate-fade-in space-y-6">
      {form.courses.map((course, cIdx) => (
        <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-indigo-400 flex items-center gap-2">
              <Layers size={16} /> {course.title}
            </h3>
            <button
              onClick={() => {
                const next = [...form.courses]
                next[cIdx].modules.push({ id: 'm-' + Date.now(), title: 'Học phần mới', lessons: [] })
                setForm({ ...form, courses: next })
              }}
              className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-600/30"
            >
              + Thêm Học phần
            </button>
          </div>
          <div className="p-6 space-y-6">
            {course.modules.length === 0 ? <p className="text-center text-slate-600 py-4 text-sm">Chưa có học phần nào</p> :
              course.modules.map((module, mIdx) => (
                <div key={module.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      className="bg-transparent border-none text-white font-semibold p-0 focus:ring-0 w-full"
                      value={module.title}
                      onChange={e => {
                        const next = [...form.courses]; next[cIdx].modules[mIdx].title = e.target.value; setForm({ ...form, courses: next })
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => {
                        const next = [...form.courses]; next[cIdx].modules[mIdx].lessons.push({ id: 'l-' + Date.now(), title: 'Bài học mới' }); setForm({ ...form, courses: next })
                      }} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:bg-slate-700">
                        + Thêm Bài học
                      </button>
                      <button 
                        onClick={() => {
                          const next = [...form.courses];
                          next[cIdx].modules = next[cIdx].modules.filter((_, i) => i !== mIdx);
                          setForm({...form, courses: next});
                        }}
                        className="p-1 text-slate-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {module.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 group">
                        <FileText size={14} className="text-slate-500" />
                        <input
                          className="bg-transparent border-none text-slate-300 text-xs p-0 focus:ring-0 w-full"
                          value={lesson.title}
                          onChange={e => {
                            const next = [...form.courses]; next[cIdx].modules[mIdx].lessons[lIdx].title = e.target.value; setForm({ ...form, courses: next })
                          }}
                        />
                        <button 
                          onClick={() => {
                            const next = [...form.courses];
                            next[cIdx].modules[mIdx].lessons = next[cIdx].modules[mIdx].lessons.filter((_, i) => i !== lIdx);
                            setForm({...form, courses: next});
                          }}
                          className="text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  )

  const renderStep4 = () => (
    <div className="animate-fade-in space-y-6">
      {form.courses.map((course) => (
        <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-400 text-sm flex items-center gap-2">
              <Layers size={14} /> {course.title}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {course.modules.map((module) => (
              <div key={module.id} className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">{module.title}</h4>
                <div className="grid grid-cols-1 gap-4">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                          <FileText size={14} /> {lesson.title}
                        </span>
                        <button 
                          onClick={() => {
                            const next = [...form.courses];
                            const cIdx = next.findIndex(c => c.id === course.id);
                            const mIdx = next[cIdx].modules.findIndex(m => m.id === module.id);
                            if (!next[cIdx].modules[mIdx].lessons[lIdx].tasks) next[cIdx].modules[mIdx].lessons[lIdx].tasks = [];
                            next[cIdx].modules[mIdx].lessons[lIdx].tasks.push({ id: 't-' + Date.now(), title: 'Nhiệm vụ mới', type: 'practice' });
                            setForm({ ...form, courses: next });
                          }}
                          className="text-[10px] bg-indigo-600/10 text-indigo-400 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-600/20"
                        >
                          + Thêm Nhiệm vụ
                        </button>
                      </div>
                      <div className="space-y-2">
                        {lesson.tasks?.map((task, tIdx) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg group">
                            <Target size={14} className="text-amber-500" />
                            <input 
                              className="bg-transparent border-none text-slate-300 text-xs p-0 focus:ring-0 w-full" 
                              value={task.title}
                              onChange={e => {
                                const next = [...form.courses];
                                const cIdx = next.findIndex(c => c.id === course.id);
                                const mIdx = next[cIdx].modules.findIndex(m => m.id === module.id);
                                next[cIdx].modules[mIdx].lessons[lIdx].tasks[tIdx].title = e.target.value;
                                setForm({ ...form, courses: next });
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setEditingTask({
                                  courseId: course.id,
                                  moduleId: module.id,
                                  lessonId: lesson.id,
                                  taskIdx: tIdx,
                                  task: task
                                })}
                                className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                title="Chỉnh sửa chi tiết"
                              >
                                <Settings size={14} />
                              </button>
                              <button 
                                onClick={() => {
                                  const next = [...form.courses];
                                  const cIdx = next.findIndex(c => c.id === course.id);
                                  const mIdx = next[cIdx].modules.findIndex(m => m.id === module.id);
                                  next[cIdx].modules[mIdx].lessons[lIdx].tasks = next[cIdx].modules[mIdx].lessons[lIdx].tasks.filter((_, i) => i !== tIdx);
                                  setForm({ ...form, courses: next });
                                }}
                                className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderStep5 = () => (
    <div className="h-[600px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#334155" gap={20} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Panel position="top-right" className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Hướng dẫn</span>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MousePointer2 size={12} className="text-indigo-400" /> Kéo thả để sắp xếp
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <GitBranch size={12} className="text-indigo-400" /> Nối các chấm để tạo liên kết
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )

  const renderStep6 = () => {
    const totalModules = form.courses.reduce((acc, c) => acc + c.modules.length, 0);
    const totalLessons = form.courses.reduce((acc, c) => acc + c.modules.reduce((ma, m) => ma + m.lessons.length, 0), 0);

    return (
      <div className="animate-fade-in space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Share2 size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Sẵn sàng xuất bản!</h3>
                <p className="text-slate-400">Tất cả thông tin đã được kiểm tra và sẵn sàng đưa lên hệ thống.</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Giai đoạn', value: form.courses.length, icon: Layers, color: 'text-indigo-400' },
                { label: 'Học phần', value: totalModules, icon: FileText, color: 'text-amber-400' },
                { label: 'Bài học', value: totalLessons, icon: Eye, color: 'text-emerald-400' },
                { label: 'Tổng thời gian', value: `${form.estimatedHours}h`, icon: Clock, color: 'text-indigo-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                  <stat.icon size={16} className={`${stat.color} mb-2`} />
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-white">Xác nhận xuất bản</h4>
            <p className="text-sm text-slate-400">Lộ trình sẽ hiển thị công khai cho tất cả người dùng.</p>
          </div>
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'XUẤT BẢN NGAY'} <ArrowRight size={20} />
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-600">Bạn có thể quay lại bất kỳ bước nào để chỉnh sửa trước khi hoàn tất.</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      default: return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Zap size={48} className="mx-auto mb-4 opacity-20" />
          <p>Đang xây dựng nội dung cho bước này...</p>
        </div>
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Thiết kế lộ trình</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition-all"
          >
            <Save size={18} /> Lưu nháp
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            <Eye size={18} /> Xem trước
          </button>
          <button 
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50"
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? 'Đang xuất bản...' : 'Xuất bản'} <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* TASK DETAIL EDITOR OVERLAY */}
      {editingTask && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/98 backdrop-blur-2xl flex animate-fade-in">
          <div className="flex-1 flex flex-col border-r border-white/5">
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
                   <Target size={18} />
                 </div>
                 <h3 className="text-white font-bold">Chỉnh sửa Nhiệm vụ: {editingTask.task.title}</h3>
               </div>
               <button 
                 onClick={() => setEditingTask(null)}
                 className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
               >
                 Xong
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiêu đề nhiệm vụ</label>
                  <input 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={editingTask.task.title}
                    onChange={e => {
                      const updated = { ...editingTask.task, title: e.target.value };
                      setEditingTask({ ...editingTask, task: updated });
                      
                      // Update main form
                      const next = [...form.courses];
                      const cIdx = next.findIndex(c => c.id === editingTask.courseId);
                      const mIdx = next[cIdx].modules.findIndex(m => m.id === editingTask.moduleId);
                      const lIdx = next[cIdx].modules[mIdx].lessons.findIndex(l => l.id === editingTask.lessonId);
                      next[cIdx].modules[mIdx].lessons[lIdx].tasks[editingTask.taskIdx] = updated;
                      setForm({ ...form, courses: next });
                    }}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả & Hướng dẫn chi tiết</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-slate-300 min-h-[300px] outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                    placeholder="Viết hướng dẫn thực hiện nhiệm vụ tại đây..."
                    value={editingTask.task.description || ''}
                    onChange={e => {
                      const updated = { ...editingTask.task, description: e.target.value };
                      setEditingTask({ ...editingTask, task: updated });
                      
                      const next = [...form.courses];
                      const cIdx = next.findIndex(c => c.id === editingTask.courseId);
                      const mIdx = next[cIdx].modules.findIndex(m => m.id === editingTask.moduleId);
                      const lIdx = next[cIdx].modules[mIdx].lessons.findIndex(l => l.id === editingTask.lessonId);
                      next[cIdx].modules[mIdx].lessons[lIdx].tasks[editingTask.taskIdx] = updated;
                      setForm({ ...form, courses: next });
                    }}
                  />
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Độ khó nhiệm vụ</label>
                    <select 
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      value={editingTask.task.difficulty || 'easy'}
                      onChange={e => {
                        const updated = { ...editingTask.task, difficulty: e.target.value };
                        setEditingTask({ ...editingTask, task: updated });
                        const next = [...form.courses];
                        const cIdx = next.findIndex(c => c.id === editingTask.courseId);
                        const mIdx = next[cIdx].modules.findIndex(m => m.id === editingTask.moduleId);
                        const lIdx = next[cIdx].modules[mIdx].lessons.findIndex(l => l.id === editingTask.lessonId);
                        next[cIdx].modules[mIdx].lessons[lIdx].tasks[editingTask.taskIdx] = updated;
                        setForm({ ...form, courses: next });
                      }}
                    >
                      <option value="easy">Easy (Dễ)</option>
                      <option value="medium">Medium (Trung bình)</option>
                      <option value="hard">Hard (Khó)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phần thưởng XP</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500">
                        <Zap size={18} />
                      </div>
                      <input 
                        type="number"
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/50"
                        value={editingTask.task.xp_reward || 0}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          const updated = { ...editingTask.task, xp_reward: val };
                          setEditingTask({ ...editingTask, task: updated });
                          const next = [...form.courses];
                          const cIdx = next.findIndex(c => c.id === editingTask.courseId);
                          const mIdx = next[cIdx].modules.findIndex(m => m.id === editingTask.moduleId);
                          const lIdx = next[cIdx].modules[mIdx].lessons.findIndex(l => l.id === editingTask.lessonId);
                          next[cIdx].modules[mIdx].lessons[lIdx].tasks[editingTask.taskIdx] = updated;
                          setForm({ ...form, courses: next });
                        }}
                      />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Media (Ảnh/Video)</label>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <button 
                            onClick={() => {
                              const updated = { ...editingTask.task, mediaType: 'image' };
                              setEditingTask({ ...editingTask, task: updated });
                            }}
                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${editingTask.task.mediaType === 'image' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                          >
                            <ImageIcon size={18} /> Hình ảnh
                          </button>
                          <button 
                             onClick={() => {
                              const updated = { ...editingTask.task, mediaType: 'video' };
                              setEditingTask({ ...editingTask, task: updated });
                            }}
                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${editingTask.task.mediaType === 'video' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                          >
                            <Video size={18} /> Video
                          </button>
                       </div>

                       <div className="p-8 bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                          <input 
                            type="file" 
                            id="task-media" 
                            className="hidden" 
                            accept={editingTask.task.mediaType === 'video' ? 'video/*' : 'image/*'} 
                            onChange={async (e) => {
                               const file = e.target.files[0];
                               if (!file) return;
                               setUploading(true);
                               try {
                                 const data = await uploadFile(file, 'tasks');
                                 const updated = { ...editingTask.task, mediaUrl: data.url };
                                 setEditingTask({ ...editingTask, task: updated });
                                 
                                 const next = [...form.courses];
                                 const cIdx = next.findIndex(c => c.id === editingTask.courseId);
                                 const mIdx = next[cIdx].modules.findIndex(m => m.id === editingTask.moduleId);
                                 const lIdx = next[cIdx].modules[mIdx].lessons.findIndex(l => l.id === editingTask.lessonId);
                                 next[cIdx].modules[mIdx].lessons[lIdx].tasks[editingTask.taskIdx] = updated;
                                 setForm({ ...form, courses: next });
                                 toast.success('Đã tải media lên!');
                               } catch (err) {
                                 toast.error('Lỗi khi tải media');
                               } finally {
                                 setUploading(false);
                               }
                            }}
                          />
                          <label htmlFor="task-media" className="cursor-pointer group block">
                             <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                                {uploading ? <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <Plus size={32} />}
                             </div>
                             <p className="text-slate-400 font-bold">Nhấn để tải {editingTask.task.mediaType === 'video' ? 'Video' : 'Ảnh'} lên</p>
                             <p className="text-xs text-slate-600 mt-2">Dung lượng tối đa 50MB</p>
                          </label>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Xem trước Media</label>
                    <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center relative group">
                       {editingTask.task.mediaUrl ? (
                         editingTask.task.mediaType === 'video' ? (
                           <video src={editingTask.task.mediaUrl} controls className="w-full h-full object-cover" />
                         ) : (
                           <img src={editingTask.task.mediaUrl} className="w-full h-full object-cover" alt="Task Preview" />
                         )
                       ) : (
                         <div className="text-slate-700 italic text-sm">Chưa có media minh họa</div>
                       )}
                       {editingTask.task.mediaUrl && (
                         <button 
                           onClick={() => {
                             const updated = { ...editingTask.task, mediaUrl: '' };
                             setEditingTask({ ...editingTask, task: updated });
                             // Update main form too...
                           }}
                           className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="w-[450px] bg-slate-900/50 p-8 flex flex-col">
             <div className="flex-1">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Bản xem trước hiển thị</h4>
               <div className="bg-slate-950 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                  {editingTask.task.mediaUrl && (
                    <div className="aspect-video relative">
                      {editingTask.task.mediaType === 'video' ? (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <Play size={48} className="text-white opacity-40" />
                        </div>
                      ) : (
                        <img src={editingTask.task.mediaUrl} className="w-full h-full object-cover" alt="Task" />
                      )}
                    </div>
                  )}
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded border border-indigo-500/30">
                         {editingTask.task.difficulty || 'easy'}
                       </span>
                       <span className="flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase">
                         <Zap size={10} /> +{editingTask.task.xp_reward || 0} XP
                       </span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{editingTask.task.title}</h2>
                    <div className="prose prose-invert prose-sm">
                      <p className="text-slate-400 whitespace-pre-wrap">{editingTask.task.description || 'Nội dung hướng dẫn nhiệm vụ sẽ hiển thị ở đây...'}</p>
                    </div>
                  </div>
               </div>
             </div>
             
             <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Trạng thái lưu</span>
                  <span className="text-emerald-400">Đã lưu tự động</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full" />
                </div>
             </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-fade-in">
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/20">Chế độ Xem trước</span>
              <h3 className="text-white font-bold">{form.title || 'Lộ trình chưa đặt tên'}</h3>
            </div>
            <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-12">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="relative h-80 rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
                {form.thumbnail ? (
                  <img src={form.thumbnail} className="w-full h-full object-cover opacity-60" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold italic">Chưa có ảnh bìa lộ trình</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent flex flex-col justify-end p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-indigo-600/20">Official Pathway</span>
                    {form.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 backdrop-blur-md text-white/70 text-[10px] font-bold rounded-lg border border-white/10">{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{form.title || 'Tiêu đề Lộ trình'}</h1>
                  <div className="flex items-center gap-6 text-sm text-slate-400 font-bold">
                    <span className="flex items-center gap-2"><Clock size={18} className="text-indigo-400" /> {form.estimatedHours}h học tập</span>
                    <span className="flex items-center gap-2 capitalize"><Zap size={18} className="text-amber-400" /> {form.difficulty}</span>
                    <span className="flex items-center gap-2"><Target size={18} className="text-emerald-400" /> {form.courses.length} Giai đoạn</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black text-white flex items-center gap-3">
                     <GitBranch className="text-indigo-500" /> Sơ đồ học tập
                   </h2>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giao diện tương tác</span>
                </div>
                <div className="h-[500px] bg-[#0a0a0f] border border-white/5 rounded-[40px] relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]/80 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-12">
                    {/* ROOT NODE SIMULATION */}
                    <div className="px-10 py-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl font-black text-lg shadow-[0_0_40px_rgba(37,99,235,0.3)] border-2 border-blue-400/50">
                      BẮT ĐẦU: {form.title || 'START'}
                    </div>
                    
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-500/50 to-amber-500/50" />

                    <div className="flex flex-wrap justify-center gap-8 px-12">
                      {form.courses.map(c => (
                        <div key={c.id} className="group relative">
                          <div className="absolute -inset-4 bg-amber-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-all" />
                          <div className="relative px-8 py-5 bg-gradient-to-br from-amber-400 to-amber-500 text-[#1a1a2e] rounded-3xl font-black shadow-xl shadow-amber-500/20 border-2 border-amber-300 transition-all hover:scale-105 flex items-center gap-3">
                            {c.title}
                            <ChevronDown size={18} className="opacity-50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10 pb-32">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Layers className="text-indigo-500" /> Chi tiết nội dung
                  </h2>
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 bg-amber-500 rounded-full" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Học phần chính</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {form.courses.map((course, idx) => (
                    <div key={course.id} className="group bg-slate-900/40 border border-white/5 rounded-[32px] p-10 hover:bg-slate-900/60 transition-all hover:border-indigo-500/20">
                      <div className="flex items-start gap-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl font-black text-white/10 group-hover:text-indigo-500/20 transition-all">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-6">
                          <div>
                            <h3 className="text-2xl font-black text-white mb-2">{course.title}</h3>
                            <p className="text-slate-500 text-sm">{course.description || 'Chưa có mô tả cho giai đoạn này.'}</p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {course.modules.map(m => (
                              <div key={m.id} className="px-4 py-2 bg-[#050505] border border-white/5 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 hover:border-indigo-500/30 transition-all">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                {m.title}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2">
                           <ArrowRight className="text-slate-700 group-hover:text-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[280px_1fr] gap-8">
        <div className="space-y-2">
          {steps.map(step => {
            const isAvailable = canNavigateTo(step.id)
            return (
              <button
                key={step.id}
                onClick={() => isAvailable && setCurrentStep(step.id)}
                disabled={!isAvailable}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left ${currentStep === step.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : isAvailable
                    ? 'bg-slate-900/50 text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                    : 'bg-slate-900/20 text-slate-700 cursor-not-allowed opacity-50'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentStep === step.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                  <step.icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-xs font-bold uppercase opacity-60">Bước {step.id}</p>
                  <p className="font-bold text-sm">{step.label}</p>
                </div>
                {currentStep > step.id && validateStep(step.id) && <CheckCircle2 size={16} className="text-emerald-400" />}
              </button>
            )
          })}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              {steps.find(s => s.id === currentStep)?.label}
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase">Phần {currentStep}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevStep} disabled={currentStep === 1} className="p-2 text-slate-500 hover:text-white disabled:opacity-20"><ChevronLeft size={24} /></button>
              <button onClick={nextStep} disabled={currentStep === steps.length} className="p-2 text-slate-500 hover:text-white disabled:opacity-20"><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

const PathwayBuilderWrapper = () => (
  <ReactFlowProvider>
    <PathwayBuilder />
  </ReactFlowProvider>
)

export default PathwayBuilderWrapper
