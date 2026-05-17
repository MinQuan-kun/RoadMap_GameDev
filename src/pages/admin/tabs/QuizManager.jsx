import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, PlusCircle } from 'lucide-react'
import {
  getQuizzes, createQuiz, updateQuiz, deleteQuiz,
  getQuestions, createQuestion, updateQuestion, deleteQuestion,
  getAllCourses
} from '../../../services/adminApi'
import { getPathways } from '../../../services/roadmapApi'
import toast from 'react-hot-toast'

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([])
  const [questions, setQuestions] = useState([])
  const [pathways, setPathways] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('quizzes') // quizzes | questions

  // Form states
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [qz, qs, pw, cs] = await Promise.all([
        getQuizzes(),
        getQuestions(),
        getPathways(),
        getAllCourses()
      ])
      setQuizzes(qz)
      setQuestions(qs)
      setPathways(pw)
      setCourses(cs)
    } catch (err) {
      toast.error('Lỗi tải dữ liệu Khảo sát')
    } finally {
      setLoading(false)
    }
  }

  // --- QUIZ HANDLERS ---
  const handleSaveQuiz = async () => {
    try {
      if (editingQuiz.id) {
        await updateQuiz(editingQuiz.id, editingQuiz)
        toast.success('Cập nhật Quiz thành công')
      } else {
        await createQuiz(editingQuiz)
        toast.success('Tạo Quiz thành công')
      }
      setEditingQuiz(null)
      fetchData()
    } catch (err) {
      toast.error('Lỗi lưu Quiz')
    }
  }

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa Quiz này?')) return
    try {
      await deleteQuiz(id)
      toast.success('Xóa Quiz thành công')
      fetchData()
    } catch (err) {
      toast.error('Lỗi xóa Quiz')
    }
  }

  // --- QUESTION HANDLERS ---
  const handleSaveQuestion = async () => {
    try {
      if (editingQuestion.id) {
        await updateQuestion(editingQuestion.id, editingQuestion)
        toast.success('Cập nhật Câu hỏi thành công')
      } else {
        await createQuestion(editingQuestion)
        toast.success('Tạo Câu hỏi thành công')
      }
      setEditingQuestion(null)
      fetchData()
    } catch (err) {
      toast.error('Lỗi lưu Câu hỏi')
    }
  }

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa Câu hỏi này?')) return
    try {
      await deleteQuestion(id)
      toast.success('Xóa Câu hỏi thành công')
      fetchData()
    } catch (err) {
      toast.error('Lỗi xóa Câu hỏi')
    }
  }

  const addOptionToQuestion = () => {
    setEditingQuestion({
      ...editingQuestion,
      options: [...(editingQuestion.options || []), { text: '', mappingPathwayIds: [], mappingCourseIds: [], weight: 1 }]
    })
  }

  const togglePathwayMapping = (optionIdx, pathwayId) => {
    const newOptions = [...editingQuestion.options]
    const currentOpt = { ...newOptions[optionIdx] }
    const mapping = currentOpt.mappingPathwayIds || []
    
    if (mapping.includes(pathwayId)) {
      currentOpt.mappingPathwayIds = mapping.filter(id => id !== pathwayId)
    } else {
      currentOpt.mappingPathwayIds = [...mapping, pathwayId]
    }
    
    newOptions[optionIdx] = currentOpt
    setEditingQuestion({ ...editingQuestion, options: newOptions })
  }

  const toggleCourseMapping = (optionIdx, courseId) => {
    const newOptions = [...editingQuestion.options]
    const currentOpt = { ...newOptions[optionIdx] }
    const mapping = currentOpt.mappingCourseIds || []
    
    if (mapping.includes(courseId)) {
      currentOpt.mappingCourseIds = mapping.filter(id => id !== courseId)
    } else {
      currentOpt.mappingCourseIds = [...mapping, courseId]
    }
    
    newOptions[optionIdx] = currentOpt
    setEditingQuestion({ ...editingQuestion, options: newOptions })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý Khảo Sát Nghề Nghiệp</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tạo bài quiz và liên kết kết quả với lộ trình học tập.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quizzes' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Bài Khảo Sát
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'questions' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Ngân hàng Câu hỏi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="admin-loader"></div></div>
      ) : activeTab === 'quizzes' ? (
        <div className="space-y-4">
          <button 
            onClick={() => setEditingQuiz({ title: '', description: '', questionIds: [], isActive: false })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Thêm Bài Khảo Sát Mới
          </button>

          {editingQuiz && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 mb-6">
              <h3 className="text-lg font-bold mb-4">{editingQuiz.id ? 'Sửa Bài Khảo Sát' : 'Thêm Bài Khảo Sát'}</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Tiêu đề" 
                  value={editingQuiz.title} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                  placeholder="Mô tả" 
                  value={editingQuiz.description} onChange={e => setEditingQuiz({...editingQuiz, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Chọn câu hỏi cho bài khảo sát này:</label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                    {questions.map(q => (
                      <label key={q.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={(editingQuiz.questionIds || []).includes(q.id)}
                          onChange={(e) => {
                            const newIds = e.target.checked 
                              ? [...(editingQuiz.questionIds || []), q.id] 
                              : (editingQuiz.questionIds || []).filter(id => id !== q.id);
                            setEditingQuiz({...editingQuiz, questionIds: newIds});
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{q.question}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editingQuiz.isActive} onChange={e => setEditingQuiz({...editingQuiz, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Đang hoạt động (Active)</span>
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setEditingQuiz(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">Hủy</button>
                  <button onClick={handleSaveQuiz} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <Save size={18} /> Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative group">
                <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingQuiz(quiz)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{quiz.title}</h3>
                  {quiz.isActive && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Active</span>}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{quiz.description}</p>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {quiz.questionIds?.length || 0} Câu hỏi
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button 
            onClick={() => setEditingQuestion({ question: '', type: 'single_choice', order: 0, options: [] })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Thêm Câu Hỏi Mới
          </button>

          {editingQuestion && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 mb-6">
              <h3 className="text-lg font-bold mb-4">{editingQuestion.id ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Nội dung câu hỏi..." 
                  value={editingQuestion.question} onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Loại câu hỏi</label>
                    <select 
                      value={editingQuestion.type} onChange={e => setEditingQuestion({...editingQuestion, type: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single_choice">Một lựa chọn</option>
                      <option value="multiple_choice">Nhiều lựa chọn</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Thứ tự</label>
                    <input 
                      type="number" 
                      value={editingQuestion.order} onChange={e => setEditingQuestion({...editingQuestion, order: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">Các Đáp Án & Điểm Liên Kết (Weighting)</h4>
                    <button onClick={addOptionToQuestion} className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 font-bold">
                      <PlusCircle size={16} /> Thêm Đáp Án
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingQuestion.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                        <div className="flex flex-col md:flex-row gap-4 mb-5 relative z-10 pl-2">
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Nội dung đáp án</label>
                            <input 
                              type="text" placeholder="Nhập câu trả lời..." 
                              value={opt.text} 
                              onChange={e => {
                                const newOpts = [...editingQuestion.options];
                                newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                                setEditingQuestion({...editingQuestion, options: newOpts});
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                          </div>
                          <div className="w-full md:w-32">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block uppercase tracking-wider">Điểm (Weight)</label>
                            <input 
                              type="number" min="0" max="100"
                              value={opt.weight} 
                              onChange={e => {
                                const newOpts = [...editingQuestion.options];
                                newOpts[oIdx] = { ...newOpts[oIdx], weight: parseInt(e.target.value) || 0 };
                                setEditingQuestion({...editingQuestion, options: newOpts});
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-center outline-none"
                            />
                          </div>
                          <div className="flex items-end pb-0.5">
                            <button 
                              onClick={() => {
                                const newOpts = editingQuestion.options.filter((_, i) => i !== oIdx);
                                setEditingQuestion({...editingQuestion, options: newOpts});
                              }}
                              className="w-10 h-[42px] flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                              title="Xóa đáp án"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5 ml-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              Liên kết Lộ trình (Pathway)
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 admin-scroll">
                              {pathways.map(pw => {
                                const isSelected = (opt.mappingPathwayIds || []).includes(pw.id);
                                return (
                                  <button
                                    key={pw.id}
                                    onClick={() => togglePathwayMapping(oIdx, pw.id)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 ${
                                      isSelected 
                                        ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5'
                                    }`}
                                  >
                                    {pw.title}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Liên kết Khóa học (Course)
                            </label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 admin-scroll">
                              {courses.map(course => {
                                const isSelected = (opt.mappingCourseIds || []).includes(course.id);
                                return (
                                  <button
                                    key={course.id}
                                    onClick={() => toggleCourseMapping(oIdx, course.id)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 text-left ${
                                      isSelected 
                                        ? 'bg-green-500/15 border-green-500/50 text-green-600 dark:text-green-400 shadow-sm shadow-green-500/10' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500 hover:border-green-500/40 hover:bg-green-50 dark:hover:bg-green-500/5'
                                    }`}
                                  >
                                    {course.title}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setEditingQuestion(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">Hủy</button>
                  <button onClick={handleSaveQuestion} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <Save size={18} /> Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {questions.sort((a, b) => a.order - b.order).map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex items-start justify-between group">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full text-xs font-bold text-slate-500">{q.order}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">{q.question}</h4>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-9">
                    <p className="mb-2">{q.options?.length || 0} đáp án • Loại: {q.type === 'single_choice' ? '1 Lựa chọn' : 'Nhiều lựa chọn'}</p>
                    {q.options && q.options.length > 0 && (
                      <ul className="space-y-2 mt-3">
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-slate-700 dark:text-slate-300">- {opt.text}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-bold uppercase tracking-wider">Weight: {opt.weight}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(opt.mappingPathwayIds || []).length === 0 && (opt.mappingCourseIds || []).length === 0 && (
                                <span className="text-[10px] text-slate-400 italic">Không có liên kết</span>
                              )}
                              {(opt.mappingPathwayIds || []).map(pid => {
                                const pName = pathways.find(p => p.id === pid)?.title || pid;
                                return <span key={pid} className="px-1.5 py-0.5 text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800/50">🛣️ {pName}</span>
                              })}
                              {(opt.mappingCourseIds || []).map(cid => {
                                const cName = courses.find(c => c.id === cid)?.title || cid;
                                return <span key={cid} className="px-1.5 py-0.5 text-[9px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800/50">📘 {cName}</span>
                              })}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingQuestion(q)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 dark:bg-white/5 rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-white/5 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizManager
