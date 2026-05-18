import React, { useState, useEffect, useCallback } from 'react'
import {
  Loader2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Save,
  Plus,
  Trash2,
  Type,
  Video,
  Code,
  FileText,
  CheckCircle2,
  ListChecks,
  Layers,
  Layout,
  Book,
  ArrowRight,
  History,
  X
} from 'lucide-react'
import {
  getAllPathways,
  getPathwayById,
  getCourseById,
  getModuleById,
  getLessonById,
  updateCourse,
  updateModule,
  updateLesson,
  createCourse,
  createModule,
  createLesson,
  deleteCourse,
  deleteModule,
  deleteLesson,
  createLearningTask,
  updateLearningTask,
  deleteLearningTask
} from '../../services/adminApi'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const SectionHeader = ({ title, icon: Icon, onAdd, addLabel }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} style={{ color: '#818cf8' }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>{title}</h3>
    </div>
    {onAdd && (
      <button className="admin-btn admin-btn-ghost" onClick={onAdd} style={{ fontSize: 11, padding: '4px 12px' }}>
        <Plus size={14} /> {addLabel}
      </button>
    )}
  </div>
)

const LessonManager = () => {
  // State for navigation
  const [pathways, setPathways] = useState([])
  const [selectedPathway, setSelectedPathway] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)

  // Loading states
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [saving, setSaving] = useState(false)

  // Editor states
  const [lessonForm, setLessonForm] = useState(null)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const data = await getAllPathways()
        setPathways(data)
      } catch (err) {
        toast.error('Failed to load pathways')
      } finally {
        setLoading(false)
      }
    }
    fetchPathways()
  }, [])

  const loadPathway = async (pathway) => {
    setSelectedPathway(pathway)
    setSelectedCourse(null)
    setSelectedModule(null)
    setSelectedLesson(null)
    setLoadingContent(true)
    try {
      const data = await getPathwayById(pathway.id)
      const courseDetails = await Promise.all(
        (data.courseIds || []).map(id => getCourseById(id))
      )
      setCourses(courseDetails.sort((a, b) => a.order - b.order))
    } catch (err) {
      toast.error('Failed to load courses')
    } finally {
      setLoadingContent(false)
    }
  }

  const loadCourse = async (course) => {
    setSelectedCourse(course)
    setSelectedModule(null)
    setSelectedLesson(null)
    setLoadingContent(true)
    try {
      const data = await getCourseById(course.id)
      const moduleDetails = await Promise.all(
        (data.moduleIds || []).map(id => getModuleById(id))
      )
      setModules(moduleDetails.sort((a, b) => a.order - b.order))
    } catch (err) {
      toast.error('Failed to load modules')
    } finally {
      setLoadingContent(false)
    }
  }

  const loadModule = async (module) => {
    setSelectedModule(module)
    setSelectedLesson(null)
    setLoadingContent(true)
    try {
      const data = await getModuleById(module.id)
      const lessonDetails = await Promise.all(
        (data.lessonIds || []).map(id => getLessonById(id))
      )
      setLessons(lessonDetails)
    } catch (err) {
      toast.error('Failed to load lessons')
    } finally {
      setLoadingContent(false)
    }
  }

  const loadLesson = async (lesson) => {
    setSelectedLesson(lesson)
    setLoadingContent(true)
    try {
      const data = await getLessonById(lesson.id)
      setLessonForm(data)
      if (data.taskIds && data.taskIds.length > 0) {
        setTasks([])
      } else {
        setTasks([])
      }
    } catch (err) {
      toast.error('Failed to load lesson details')
    } finally {
      setLoadingContent(false)
    }
  }

  // SAVE LOGIC
  const handleSaveLesson = async () => {
    if (!lessonForm) return
    setSaving(true)
    try {
      await updateLesson(lessonForm.id, lessonForm)
      toast.success('Đã lưu bài học!')
      setLessons(prev => prev.map(l => l.id === lessonForm.id ? lessonForm : l))
    } catch (err) {
      toast.error('Lỗi khi lưu bài học')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTask = () => {
    setTasks(prev => [...prev, { title: 'Thực hành mới', description: '', taskType: 'practice', xpReward: 50 }])
  }

  // RENDER UI
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Loader2 className="animate-spin text-indigo-500" size={32} />
    </div>
  )

  return (
    <div className="admin-container" style={{ padding: '0 20px 20px' }}>
      <div style={{ marginBottom: 24, borderBottom: '1px solid var(--admin-border)', paddingBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--admin-text)', margin: 0 }}>Quản Lý Nội Dung Học Tập</h1>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>
          Xây dựng Pathway &gt; Course &gt; Module &gt; Lesson &gt; Task
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, height: 'calc(100vh - 200px)' }}>

        {/* LEFT SIDEBAR: THE HIERARCHY TREE */}
        <div className="admin-card admin-scroll" style={{ padding: 0, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--admin-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hệ thống phân cấp
            </span>
          </div>

          <div style={{ padding: 8 }}>
            {pathways.map(p => (
              <div key={p.id}>
                <button
                  onClick={() => loadPathway(p)}
                  className={`tree-item ${selectedPathway?.id === p.id ? 'active' : ''}`}
                >
                  <BookOpen size={14} />
                  <span>{p.title}</span>
                </button>

                {selectedPathway?.id === p.id && courses.map(c => (
                  <div key={c.id} style={{ marginLeft: 16 }}>
                    <button
                      onClick={() => loadCourse(c)}
                      className={`tree-item ${selectedCourse?.id === c.id ? 'active' : ''}`}
                    >
                      <Layout size={14} />
                      <span>{c.title}</span>
                    </button>

                    {selectedCourse?.id === c.id && modules.map(m => (
                      <div key={m.id} style={{ marginLeft: 16 }}>
                        <button
                          onClick={() => loadModule(m)}
                          className={`tree-item ${selectedModule?.id === m.id ? 'active' : ''}`}
                        >
                          <Layers size={14} />
                          <span>{m.title}</span>
                        </button>

                        {selectedModule?.id === m.id && lessons.map(l => (
                          <div key={l.id} style={{ marginLeft: 16 }}>
                            <button
                              onClick={() => loadLesson(l)}
                              className={`tree-item ${selectedLesson?.id === l.id ? 'active' : ''}`}
                            >
                              <FileText size={14} />
                              <span>{l.title}</span>
                            </button>
                          </div>
                        ))}
                        {selectedModule?.id === m.id && (
                          <button className="tree-add-btn" style={{ marginLeft: 16 }}>
                            <Plus size={12} /> Bài học mới
                          </button>
                        )}
                      </div>
                    ))}
                    {selectedCourse?.id === c.id && (
                      <button className="tree-add-btn" style={{ marginLeft: 16 }}>
                        <Plus size={12} /> Chương mới
                      </button>
                    )}
                  </div>
                ))}
                {selectedPathway?.id === p.id && (
                  <button className="tree-add-btn" style={{ marginLeft: 16 }}>
                    <Plus size={12} /> Khóa học mới
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="admin-card admin-scroll" style={{ overflowY: 'auto', padding: 32 }}>
          {loadingContent ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 className="animate-spin text-indigo-500/30" size={48} />
            </div>
          ) : selectedLesson && lessonForm ? (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, borderBottom: '1px solid var(--admin-border)', paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={24} style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Chỉnh sửa bài học</h2>
                    <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>{selectedModule?.title} / {lessonForm.title}</p>
                  </div>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={handleSaveLesson} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu bài học
                </button>
              </div>

              {/* EDITOR FIELDS */}
              <div style={{ display: 'grid', gap: 32 }}>

                {/* 1. Base Info */}
                <div className="editor-section">
                  <SectionHeader title="Thông tin cơ bản" icon={Type} />
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <label className="admin-label">Tiêu đề bài học</label>
                      <input
                        className="admin-input"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label className="admin-label">Độ khó</label>
                        <select className="admin-input" value={lessonForm.difficulty} onChange={(e) => setLessonForm({ ...lessonForm, difficulty: e.target.value })}>
                          <option value="easy">Dễ</option>
                          <option value="medium">Trung bình</option>
                          <option value="hard">Khó</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Thời gian (phút)</label>
                        <input className="admin-input" type="number" value={lessonForm.estimatedMinutes} onChange={(e) => setLessonForm({ ...lessonForm, estimatedMinutes: parseInt(e.target.value) })} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Explanation & Content */}
                <div className="editor-section">
                  <SectionHeader title="Nội dung giảng dạy" icon={Book} />
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <label className="admin-label">Mô tả bài học (Explanation)</label>
                      <textarea className="admin-textarea" rows={4} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} placeholder="Giải thích lý thuyết..." />
                    </div>
                    <div>
                      <label className="admin-label">Video hướng dẫn (URL)</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <Video size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                          <input className="admin-input" style={{ paddingLeft: 40 }} placeholder="Youtube, Vimeo, Cloudinary..." value={lessonForm.videoUrl || ''} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Tasks (Practice) */}
                <div className="editor-section">
                  <SectionHeader title="Nhiệm vụ thực hành" icon={ListChecks} onAdd={handleAddTask} addLabel="Thêm Task" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {tasks.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: 12, color: 'var(--admin-text-dim)', fontSize: 13 }}>
                        Chưa có nhiệm vụ thực hành nào.
                      </div>
                    ) : tasks.map((task, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Task #{idx + 1}</span>
                          <button onClick={() => setTasks(tasks.filter((_, i) => i !== idx))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div style={{ display: 'grid', gap: 12 }}>
                          <input className="admin-input" style={{ fontWeight: 600 }} placeholder="Tiêu đề task (vd: Create HP variable)" value={task.title} onChange={(e) => {
                            const next = [...tasks]; next[idx].title = e.target.value; setTasks(next);
                          }} />
                          <textarea className="admin-textarea" rows={4} style={{ fontSize: 13, fontFamily: 'monospace' }} placeholder="Hướng dẫn thực hành (Hỗ trợ Markdown)..." value={task.description} onChange={(e) => {
                            const next = [...tasks]; next[idx].description = e.target.value; setTasks(next);
                          }} />
                          
                          {/* Markdown Preview */}
                          {task.description && (
                            <div style={{ marginTop: 8, padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                              <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8, display: 'block' }}>Preview</span>
                              <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-300">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    img: ({node, ...props}) => (
                                      <img {...props} style={{ width: '100%', borderRadius: 8, marginTop: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)' }} />
                                    ),
                                    code({node, inline, className, children, ...props}) {
                                      const match = /language-(\w+)/.exec(className || '')
                                      return match ? (
                                        <SyntaxHighlighter
                                          {...props}
                                          children={String(children).replace(/\n$/, '')}
                                          style={atomDark}
                                          language={match[1]}
                                          PreTag="div"
                                          customStyle={{ padding: '12px', borderRadius: '8px', fontSize: '12px', margin: '8px 0' }}
                                        />
                                      ) : (
                                        <code {...props} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', color: '#818cf8' }}>
                                          {children}
                                        </code>
                                      )
                                    }
                                  }}
                                >
                                  {task.description}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Quiz (Check) */}
                <div className="editor-section">
                  <SectionHeader title="Kiểm tra (Quiz)" icon={CheckCircle2} />
                  <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: 12 }}>
                    <button className="admin-btn admin-btn-ghost">
                      <Plus size={14} /> Cấu hình Quiz
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : selectedModule ? (
            <div className="admin-empty">
              <Layers size={48} />
              <h3 style={{ marginTop: 16 }}>Chọn một bài học để chỉnh sửa</h3>
              <p style={{ fontSize: 13, color: 'var(--admin-text-dim)' }}>Hoặc tạo mới bài học trong chương này</p>
            </div>
          ) : selectedCourse ? (
            <div className="admin-empty">
              <Layout size={48} />
              <h3 style={{ marginTop: 16 }}>Chương trình của {selectedCourse.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--admin-text-dim)' }}>Chọn một chương từ cây bên trái để quản lý bài học</p>
            </div>
          ) : (
            <div className="admin-empty">
              <Book size={48} />
              <h3 style={{ marginTop: 16 }}>Bắt đầu quản lý nội dung</h3>
              <p style={{ fontSize: 13, color: 'var(--admin-text-dim)', maxWidth: 300 }}>
                Chọn một Pathway từ danh sách bên trái để thiết lập các khóa học và bài học.
              </p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .tree-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
          margin: 2px 0;
        }
        .tree-item:hover {
          background: var(--admin-card-hover);
          color: var(--admin-text);
        }
        .tree-item.active {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          font-weight: 600;
        }
        .tree-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: transparent;
          border: none;
          color: #6366f1;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .tree-add-btn:hover {
          opacity: 1;
        }
        .editor-section {
          background: rgba(255,255,255,0.01);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.02);
          padding: 0;
        }
      `}} />
    </div>
  )
}

export default LessonManager
