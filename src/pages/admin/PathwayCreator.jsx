import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layout,
  BookOpen,
  Layers,
  FileText,
  Clock,
  Tag,
  Zap,
  Globe,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react'
import { createFullPathway, uploadFile } from '../../services/adminApi'
import toast from 'react-hot-toast'

const PathwayCreator = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic') // basic | structure | settings
  const [uploading, setUploading] = useState(false)

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
      {
        id: Date.now(),
        title: 'Giai đoạn 1: Cơ bản',
        description: 'Những kiến thức nền tảng cần nắm vững',
        modules: [
          {
            id: Date.now() + 1,
            title: 'Giới thiệu',
            lessons: ['Tổng quan', 'Cài đặt môi trường']
          }
        ]
      }
    ]
  })

  const [tagInput, setTagInput] = useState('')

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!form.tags.includes(tagInput.trim())) {
        setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tagToRemove) })
  }

  const handleAddCourse = () => {
    setForm({
      ...form,
      courses: [
        ...form.courses,
        {
          id: Date.now(),
          title: 'Giai đoạn mới',
          description: '',
          modules: []
        }
      ]
    })
  }

  const handleAddModule = (courseId) => {
    const newCourses = form.courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: [
            ...c.modules,
            {
              id: Date.now(),
              title: 'Học phần mới',
              lessons: []
            }
          ]
        }
      }
      return c
    })
    setForm({ ...form, courses: newCourses })
  }

  const handleAddLesson = (courseId, moduleId) => {
    const newCourses = form.courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                lessons: [...m.lessons, 'Bài học mới']
              }
            }
            return m
          })
        }
      }
      return c
    })
    setForm({ ...form, courses: newCourses })
  }

  const updateLessonName = (courseId, moduleId, lessonIdx, value) => {
    const newCourses = form.courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              const newLessons = [...m.lessons]
              newLessons[lessonIdx] = value
              return { ...m, lessons: newLessons }
            }
            return m
          })
        }
      }
      return c
    })
    setForm({ ...form, courses: newCourses })
  }

  const removeCourse = (id) => {
    setForm({ ...form, courses: form.courses.filter(c => c.id !== id) })
  }

  const moveCourse = (idx, direction) => {
    const newCourses = [...form.courses]
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= newCourses.length) return

    [newCourses[idx], newCourses[targetIdx]] = [newCourses[targetIdx], newCourses[idx]]
    setForm({ ...form, courses: newCourses })
  }

  const moveModule = (cIdx, mIdx, direction) => {
    const newCourses = [...form.courses]
    const modules = [...newCourses[cIdx].modules]
    const targetIdx = mIdx + direction
    if (targetIdx < 0 || targetIdx >= modules.length) return

    [modules[mIdx], modules[targetIdx]] = [modules[targetIdx], modules[mIdx]]
    newCourses[cIdx].modules = modules
    setForm({ ...form, courses: newCourses })
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const data = await uploadFile(file, 'pathways')
      setForm({ ...form, thumbnail: data.url })
      toast.success('Đã tải ảnh lên thành công!')
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast.error('Vui lòng nhập tiêu đề và slug')
      return
    }

    setLoading(true)
    try {
      // Sử dụng API lưu toàn bộ (Cascading Save)
      await createFullPathway(form)

      toast.success('Pathway published successfully with all content!')
      navigate('/admin/roadmaps')
    } catch (err) {
      console.error(err)
      toast.error('Failed to create pathway hierarchy')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/roadmaps')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Tạo Lộ Trình Mới</h1>
            <p className="text-slate-400 text-sm">Thiết kế hành trình học tập chuyên sâu</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm font-medium transition-all">
            Lưu nháp
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
            Xuất bản Pathway
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 rounded-xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'basic' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          <Layout size={16} /> Thông tin chung
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'structure' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          <Layers size={16} /> Cấu trúc nội dung
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          <Zap size={16} /> Cấu hình & SEO
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'basic' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiêu đề Pathway</label>
                  <input
                    type="text"
                    placeholder="VD: Unity Developer Roadmap"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Slug (URL)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">/roadmap/</span>
                    <input
                      type="text"
                      placeholder="unity-dev-roadmap"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-24 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mô tả ngắn</label>
                <textarea
                  rows={4}
                  placeholder="Giới thiệu về lộ trình này và những gì người học sẽ đạt được..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> Độ khó
                  </label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="beginner">Sơ cấp (Beginner)</option>
                    <option value="intermediate">Trung cấp (Intermediate)</option>
                    <option value="advanced">Cao cấp (Advanced)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock size={14} className="text-blue-400" /> Thời gian dự kiến (giờ)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    value={form.estimatedHours || 0}
                    onChange={(e) => setForm({ ...form, estimatedHours: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Tag size={14} className="text-emerald-400" /> Thẻ (Tags)
                  </label>
                  <input
                    type="text"
                    placeholder="Press Enter to add"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-md flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-400"><Trash2 size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              {form.courses.map((course, cIdx) => (
                <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">
                        {cIdx + 1}
                      </div>
                      <input
                        className="bg-transparent border-none text-slate-900 dark:text-white font-bold focus:ring-0 p-0 text-lg"
                        value={course.title}
                        onChange={(e) => {
                          const newCourses = [...form.courses]
                          newCourses[cIdx].title = e.target.value
                          setForm({ ...form, courses: newCourses })
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => moveCourse(cIdx, -1)} disabled={cIdx === 0} className="p-2 text-slate-400 hover:text-indigo-500 disabled:opacity-30"><ArrowUp size={16} /></button>
                      <button onClick={() => moveCourse(cIdx, 1)} disabled={cIdx === form.courses.length - 1} className="p-2 text-slate-400 hover:text-indigo-500 disabled:opacity-30"><ArrowDown size={16} /></button>
                      <button
                        onClick={() => removeCourse(course.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-1 mb-4">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mô tả Khóa học</label>
                      <textarea
                        rows={2}
                        placeholder="Mô tả tóm tắt nội dung khóa học..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-indigo-500"
                        value={course.description || ''}
                        onChange={(e) => {
                          const newCourses = [...form.courses]
                          newCourses[cIdx].description = e.target.value
                          setForm({ ...form, courses: newCourses })
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ảnh Thumbnail Khóa học</label>
                        <input
                          type="text"
                          placeholder="https://example.com/thumbnail.png"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-indigo-500"
                          value={course.thumbnail || ''}
                          onChange={(e) => {
                            const newCourses = [...form.courses]
                            newCourses[cIdx].thumbnail = e.target.value
                            setForm({ ...form, courses: newCourses })
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ảnh Bìa (Cover) Khóa học</label>
                        <input
                          type="text"
                          placeholder="https://example.com/cover.png"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-indigo-500"
                          value={course.coverUrl || ''}
                          onChange={(e) => {
                            const newCourses = [...form.courses]
                            newCourses[cIdx].coverUrl = e.target.value
                            setForm({ ...form, courses: newCourses })
                          }}
                        />
                      </div>
                    </div>

                    {course.modules.map((module, mIdx) => (
                      <div key={module.id} className="ml-8 border-l-2 border-slate-200 dark:border-slate-800 pl-6 space-y-4 relative">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full"></div>

                        <div className="flex items-center gap-4">
                          <BookOpen size={18} className="text-slate-400 dark:text-slate-500" />
                          <input
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm font-semibold focus:ring-1 focus:ring-indigo-500 w-full"
                            value={module.title}
                            onChange={(e) => {
                              const newCourses = [...form.courses]
                              newCourses[cIdx].modules[mIdx].title = e.target.value
                              setForm({ ...form, courses: newCourses })
                            }}
                          />
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveModule(cIdx, mIdx, -1)} disabled={mIdx === 0} className="p-1.5 text-slate-400 hover:text-indigo-500 disabled:opacity-20"><ArrowUp size={14} /></button>
                            <button onClick={() => moveModule(cIdx, mIdx, 1)} disabled={mIdx === course.modules.length - 1} className="p-1.5 text-slate-400 hover:text-indigo-500 disabled:opacity-20"><ArrowDown size={14} /></button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                          {module.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="flex items-center gap-2 group">
                              <FileText size={14} className="text-slate-400 dark:text-slate-600" />
                              <input
                                className="bg-transparent border-none text-slate-700 dark:text-slate-300 text-sm focus:ring-0 p-0 w-full hover:text-slate-950 dark:hover:text-white"
                                value={lesson}
                                onChange={(e) => updateLessonName(course.id, module.id, lIdx, e.target.value)}
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddLesson(course.id, module.id)}
                            className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 py-1"
                          >
                            <Plus size={12} /> Thêm bài học
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddModule(course.id)}
                      className="ml-8 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-500 hover:text-indigo-400 rounded-xl text-sm transition-all"
                    >
                      <Plus size={16} /> Thêm học phần (Module)
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddCourse}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500/50 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-all bg-slate-100/50 dark:bg-slate-900/20"
              >
                <Plus size={20} /> Thêm Giai đoạn (Phase/Course) mới
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-8 shadow-sm">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${form.isOfficial ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Lộ trình chính thức</h3>
                    <p className="text-xs text-slate-500">Được xác minh bởi đội ngũ quản trị GameNode</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.isOfficial}
                    onChange={(e) => setForm({ ...form, isOfficial: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe size={14} /> Tối ưu tìm kiếm (SEO)
                </h3>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Meta Title</label>
                  <input
                    type="text"
                    placeholder="Mặc định sử dụng tiều đề Pathway"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Meta Description</label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon size={14} /> Xem trước hiển thị
            </h3>

            <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 aspect-video relative mb-4 group">
              {form.thumbnail ? (
                <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
                  {uploading ? <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> : <ImageIcon size={32} />}
                  <span className="text-xs">{uploading ? 'Đang tải lên...' : 'Chưa có ảnh nền'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <label className="px-3 py-1.5 bg-white text-slate-950 text-xs font-bold rounded-lg shadow-xl cursor-pointer hover:bg-slate-100 transition-all">
                  {form.thumbnail ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${form.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : form.difficulty === 'intermediate' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'}`}>
                  {form.difficulty}
                </span>
                {form.isOfficial && (
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={10} /> Official
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {form.title || 'Tiêu đề Pathway của bạn'}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                {form.description || 'Mô tả ngắn gọn về lộ trình học tập này...'}
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} /> {form.estimatedHours}h
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Layers size={12} /> {form.courses.length} Stages
                  </div>
                </div>
                <Zap size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Hỗ trợ AI</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bạn có thể sử dụng AI để tự động tạo cấu trúc và nội dung cho Pathway này dựa trên tiêu đề.
              </p>
              <button className="w-full mt-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg transition-all border border-indigo-600/20">
                Tạo cấu trúc bằng AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PathwayCreator
