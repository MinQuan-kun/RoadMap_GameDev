import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  Clock, 
  Loader2, 
  ArrowLeft,
  XCircle,
  Menu,
  Award,
  CheckSquare,
  Square,
  Trophy,
  MessageSquare
} from 'lucide-react';
import apiClient from '../services/apiClient';
import { getUserProfile } from '../services/adminApi';
import { completeTask } from '../services/userApi';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const LessonPage = () => {
  const { id: pathwaySlug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [nodeData, setNodeData] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPathwayContent = async () => {
      try {
        setLoading(true);
        let response;
        try {
          response = await apiClient.get(`/Pathways/${pathwaySlug}/content`);
        } catch (err) {
          // Fallback to course content if pathway fails
          response = await apiClient.get(`/Pathways/course/${pathwaySlug}`);
        }
        
        const { pathway, courses } = response.data;
        
        // Flatten courses into a "node-like" structure for the existing UI
        const flattenedData = {
          id: pathway.id || pathway._id,
          name: pathway.title || pathway.Title,
          modules: (courses || []).flatMap(c => c.modules || c.Modules || [])
        };

        setNodeData(flattenedData);
        
        // Fetch progress
        try {
          const profile = await getUserProfile();
          setCompletedLessonIds(profile.completedLessonIds || []);
          setCompletedTaskIds(profile.completedTaskIds || []);
        } catch (e) {
          console.warn("Could not fetch user progress", e);
          if (e.response?.status === 401) {
             // onOpenLogin(); // If we had access to it
             toast.error("Bạn cần đăng nhập để lưu tiến độ học tập.");
          }
        }

        if (flattenedData.modules && flattenedData.modules.length > 0) {
          setActiveModule(flattenedData.modules[0]);
          if (flattenedData.modules[0].lessons && flattenedData.modules[0].lessons.length > 0) {
            setActiveLesson(flattenedData.modules[0].lessons[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching pathway content:", error);
        toast.error("Không thể tải nội dung bài học.");
      } finally {
        setLoading(false);
      }
    };

    if (pathwaySlug) fetchPathwayContent();
  }, [pathwaySlug]);

  const handleSaveContent = async () => {
    if (!user || user.role !== 'Admin') return;
    try {
      setIsSaving(true);
      // Example: Save active lesson changes
      await apiClient.put(`/admin/lessons/${activeLesson.id}`, activeLesson);
      toast.success("Đã cập nhật nội dung thành công!");
      setIsEditMode(false);
    } catch (e) {
      toast.error("Lỗi khi cập nhật nội dung.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || completing) return;
    try {
      setCompleting(true);
      await apiClient.post(`/lesson/complete/${activeLesson.id}`);
      setCompletedLessonIds(prev => [...prev, activeLesson.id]);
      toast.success("Đã hoàn thành bài học!");
      navigateToNext();
    } catch (e) {
      toast.error("Lỗi khi cập nhật tiến độ.");
    } finally {
      setCompleting(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    if (isEditMode) return; // Prevent completion while editing
    if (completing || completedTaskIds.includes(taskId)) return;
    try {
      setCompleting(true);
      const res = await completeTask(taskId);
      setCompletedTaskIds(res.completedTaskIds || []);
      toast.success("Đã hoàn thành nhiệm vụ!");
    } catch (e) {
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    } finally {
      setCompleting(false);
    }
  };

  const navigateToNext = () => {
    if (!nodeData || !activeModule || !activeLesson) return;
    
    const mIdx = nodeData.modules.findIndex(m => m === activeModule);
    const lIdx = activeModule.lessons.findIndex(l => l === activeLesson);
    
    if (lIdx < activeModule.lessons.length - 1) {
      setActiveLesson(activeModule.lessons[lIdx + 1]);
    } else if (mIdx < nodeData.modules.length - 1) {
      const nextM = nodeData.modules[mIdx + 1];
      setActiveModule(nextM);
      if (nextM.lessons.length > 0) {
        setActiveLesson(nextM.lessons[0]);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!nodeData) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 text-center">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài học</h2>
        <p className="text-slate-400 mb-6">Nội dung này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-indigo-600 rounded-full font-bold">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#050505] text-slate-700 dark:text-slate-300 font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Navigation */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex flex-col bg-white dark:bg-[#0a0d14] border-r border-slate-200 dark:border-white/[0.06] transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600/10 rounded flex items-center justify-center">
              <Award size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{nodeData.name}</h2>
          </div>
        </div>

        <div className="flex-1 p-2 overflow-y-auto no-scrollbar">
          {nodeData.modules?.map((mod, mIdx) => (
            <div key={mIdx} className="mb-2">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {mod.title}
              </div>
              <div className="space-y-1">
                {mod.lessons?.map((lesson, lIdx) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  
                  return (
                    <button
                      key={lesson.id || lIdx}
                      onClick={() => {
                        setActiveModule(mod);
                        setActiveLesson(lesson);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isActive 
                        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          lesson.type === 'video' ? <PlayCircle size={16} className="opacity-50" /> : <FileText size={16} className="opacity-50" />
                        )}
                      </div>
                      <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#0a0d14]">
        {/* Top bar controls */}
        <div className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-[#0a0d14]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06] z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {user?.role === 'Admin' && (
              <button 
                onClick={() => isEditMode ? handleSaveContent() : setIsEditMode(true)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isEditMode 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20'
                }`}
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : (isEditMode ? <CheckSquare size={14} /> : <Settings size={14} />)}
                {isEditMode ? 'LƯU NỘI DUNG' : 'CHỈNH SỬA NỘI DUNG'}
              </button>
            )}
            {isEditMode && (
               <button 
                onClick={() => setIsEditMode(false)}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors"
               >
                 HỦY
               </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate(-1)}
                className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
             >
               <ArrowLeft size={14} /> THOÁT
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#050505]">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
              {/* Task Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-4">
                  <span>{activeModule.title}</span>
                  <ChevronRight size={12} />
                  <span>BÀI {activeModule.lessons.indexOf(activeLesson) + 1}</span>
                </div>
                
                {isEditMode ? (
                  <input 
                    type="text"
                    value={activeLesson.title}
                    onChange={(e) => setActiveLesson({...activeLesson, title: e.target.value})}
                    className="w-full text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight bg-transparent border-b-2 border-indigo-600 outline-none"
                  />
                ) : (
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                    {activeLesson.title}
                  </h1>
                )}

                {/* Legacy description if no tasks */}
                {(!activeLesson.tasks || activeLesson.tasks.length === 0) && (
                  isEditMode ? (
                    <textarea 
                      value={activeLesson.description || ''}
                      onChange={(e) => setActiveLesson({...activeLesson, description: e.target.value})}
                      className="w-full text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 bg-transparent border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none min-h-[100px]"
                      placeholder="Mô tả bài học..."
                    />
                  ) : activeLesson.description && (
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                      {activeLesson.description}
                    </p>
                  )
                )}
              </div>

              {/* TASKS LIST */}
              <div className="space-y-20">
                {activeLesson.tasks && activeLesson.tasks.length > 0 ? (
                  activeLesson.tasks.map((task, tIdx) => (
                    <div key={task.id || tIdx} className="animate-fade-in">
                      {/* Task UI based on Unity Design */}
                      <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                           {isEditMode ? (
                            <input 
                              type="text"
                              value={task.title}
                              onChange={(e) => {
                                const newTasks = [...activeLesson.tasks];
                                newTasks[tIdx] = {...task, title: e.target.value};
                                setActiveLesson({...activeLesson, tasks: newTasks});
                              }}
                              className="text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-indigo-600 outline-none w-full"
                            />
                          ) : (
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                              {tIdx + 1}. {task.title}
                            </h2>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <MessageSquare size={16} className="text-slate-400 dark:text-slate-500" />
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Q&A (0)</span>
                          </div>
                        </div>
 
                        {isEditMode ? (
                          <textarea 
                            value={task.description || ''}
                            onChange={(e) => {
                              const newTasks = [...activeLesson.tasks];
                              newTasks[tIdx] = {...task, description: e.target.value};
                              setActiveLesson({...activeLesson, tasks: newTasks});
                            }}
                            className="w-full text-lg text-slate-700 dark:text-slate-300 leading-relaxed bg-transparent border border-slate-200 dark:border-white/10 rounded-xl p-4 outline-none min-h-[150px]"
                            placeholder="Mô tả nhiệm vụ..."
                          />
                        ) : task.description && (
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {task.description}
                            </p>
                          </div>
                        )}
 
                        {/* Media Section */}
                        {task.mediaUrl && (
                          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5">
                            {(task.mediaType === 'video' || (task.mediaUrl && (task.mediaUrl.includes('youtube') || task.mediaUrl.includes('vimeo')))) ? (
                              <div className="aspect-video bg-black">
                                <iframe 
                                  src={task.mediaUrl.includes('youtube.com/watch') ? task.mediaUrl.replace('watch?v=', 'embed/') : task.mediaUrl} 
                                  className="w-full h-full"
                                  allowFullScreen
                                  title={task.title}
                                />
                              </div>
                            ) : (
                              <img src={task.mediaUrl} alt={task.title} className="w-full h-auto object-cover" />
                            )}
                          </div>
                        )}

                        {isEditMode && (
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={task.mediaUrl || ''}
                              onChange={(e) => {
                                const newTasks = [...activeLesson.tasks];
                                newTasks[tIdx] = {...task, mediaUrl: e.target.value};
                                setActiveLesson({...activeLesson, tasks: newTasks});
                              }}
                              className="flex-1 text-xs p-2 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none"
                              placeholder="Media URL (Image or YouTube)..."
                            />
                          </div>
                        )}

                        {/* Task Completion Button */}
                        <div className="pt-4">
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={completing || completedTaskIds.includes(task.id)}
                            className={`w-full py-4 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${
                              completedTaskIds.includes(task.id)
                                ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default border border-slate-200 dark:border-white/5'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                            }`}
                          >
                            {completedTaskIds.includes(task.id) ? 'Completed' : 'Mark Step As Complete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Fallback to Lesson Content if no tasks */
                  <div className="space-y-12">
                     {activeLesson.video_url && (
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/5">
                           <iframe 
                             src={activeLesson.video_url.includes('youtube.com/watch') ? activeLesson.video_url.replace('watch?v=', 'embed/') : activeLesson.video_url} 
                             className="w-full h-full"
                             allowFullScreen
                           />
                        </div>
                     )}
                     <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: activeLesson.content?.replace(/\n/g, '<br/>') }} className="text-slate-700 dark:text-slate-300" />
                     </div>
                  </div>
                )}
              </div>

              {/* Lesson Footer Actions */}
              <div className="mt-24 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing || completedLessonIds.includes(activeLesson.id)}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold transition-all ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20'
                  }`}
                >
                  {completing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {completedLessonIds.includes(activeLesson.id) ? 'Bài học đã hoàn thành' : 'Hoàn thành bài học'}
                </button>

                <button
                  onClick={navigateToNext}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold rounded-full transition-all border border-slate-200 dark:border-white/10"
                >
                  Bài tiếp theo <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
               <div className="text-center">
                 <Loader2 className="animate-spin text-slate-700 mx-auto mb-4" size={32} />
                 <p className="text-slate-500 text-sm">Đang tải nội dung bài học...</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
