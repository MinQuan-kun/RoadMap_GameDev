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
  Trophy
} from 'lucide-react';
import apiClient from '../services/apiClient';
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
          name: pathway.title || pathway.Title,
          modules: (courses || []).flatMap(c => c.modules || c.Modules || [])
        };

        setNodeData(flattenedData);
        
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

  const handleCompleteLesson = async () => {
    if (!activeLesson || completing) return;
    try {
      setCompleting(true);
      // Mock call or real call if we have roadmapId
      // await apiClient.post('/lesson/complete-lesson', { nodeId, lessonId: activeLesson.id, roadmapId: '...' });
      
      setCompletedLessonIds(prev => [...prev, activeLesson.id]);
      toast.success("Đã hoàn thành bài học!");
      
      // Auto navigate to next lesson
      navigateToNext();
    } catch (e) {
      toast.error("Lỗi khi cập nhật tiến độ.");
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
    <div className="flex h-[calc(100vh-64px)] bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div 
        className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 bg-[#0f1117] border-r border-slate-800 transition-all duration-300 relative overflow-y-auto no-scrollbar flex flex-col`}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600/20 rounded flex items-center justify-center">
              <Award size={18} className="text-indigo-400" />
            </div>
            <h2 className="font-bold text-sm text-white line-clamp-1">{nodeData.name}</h2>
          </div>
          <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Nội dung khóa học</div>
        </div>

        <div className="flex-1 p-2">
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
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isActive ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          lesson.type === 'video' ? <PlayCircle size={16} className="text-slate-500" /> : <FileText size={16} className="text-slate-500" />
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
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0d14]">
        {/* Top bar controls */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f1117]/80 backdrop-blur-md z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate(-1)}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
             >
               <ArrowLeft size={14} /> THOÁT
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] tracking-widest uppercase mb-4">
                <span>{activeModule.title}</span>
                <ChevronRight size={12} />
                <span>BÀI {activeModule.lessons.indexOf(activeLesson) + 1}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
                {activeLesson.title}
              </h1>

              {/* Lesson Specifics */}
              <div className="flex items-center gap-6 mb-10 text-xs text-slate-500 font-medium border-y border-slate-800/50 py-4">
                 <div className="flex items-center gap-2">
                   <Clock size={14} /> <span>{activeLesson.duration_minutes || 5} phút</span>
                 </div>
                 <div className="flex items-center gap-2">
                   {activeLesson.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                   <span className="capitalize">{activeLesson.type}</span>
                 </div>
              </div>

              {/* Video Player */}
              {activeLesson.type === 'video' && activeLesson.video_url && (
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-12 border border-slate-800">
                  <iframe 
                    src={activeLesson.video_url.includes('youtube.com/watch') ? activeLesson.video_url.replace('watch?v=', 'embed/') : activeLesson.video_url} 
                    className="w-full h-full"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              )}

              {/* Main Content Body */}
              <div className="prose prose-invert prose-indigo max-w-none mb-16">
                {activeLesson.content ? (
                  <div 
                    className="text-slate-300 leading-relaxed text-lg space-y-6"
                    dangerouslySetInnerHTML={{ __html: activeLesson.content.replace(/\n/g, '<br/>') }}
                  />
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                     <FileText size={48} className="mx-auto text-slate-700 mb-4" />
                     <p className="text-slate-500">Nội dung bài học đang được cập nhật...</p>
                  </div>
                )}
              </div>

              {/* TASKS SECTION */}
              {activeLesson.tasks && activeLesson.tasks.length > 0 && (
                <div className="mt-12 p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                      <CheckSquare className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Nhiệm vụ cần làm</h3>
                      <p className="text-sm text-slate-500">Hoàn thành các nhiệm vụ bên dưới để nhận thêm XP</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {activeLesson.tasks.map((task, idx) => (
                      <div 
                        key={task.id || idx}
                        className="group flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                      >
                        <button className="mt-1 text-slate-600 hover:text-emerald-400 transition-colors">
                          <Square size={20} />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-200">{task.title}</h4>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                              <Trophy size={10} />
                              +{task.xpReward} XP
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing || completedLessonIds.includes(activeLesson.id)}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-green-600/20 text-green-500 border border-green-500/30 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {completing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {completedLessonIds.includes(activeLesson.id) ? 'Đã Hoàn Thành' : 'Đánh dấu hoàn thành'}
                </button>

                <button
                  onClick={navigateToNext}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all border border-slate-700"
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
