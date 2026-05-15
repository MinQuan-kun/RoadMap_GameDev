import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Star, BookOpen, ChevronRight, Loader2, Compass, Layers, ShieldCheck, ArrowLeft, MonitorPlay } from 'lucide-react';
import apiClient from '../services/apiClient';

const CourseListPage = ({ isDarkMode }) => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pathwayInfo, setPathwayInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (pathwayId) {
          // Fetch specific pathway content (courses)
          const response = await apiClient.get(`/Pathways/${pathwayId}/content`);
          setData(response.data.courses || []);
          setPathwayInfo(response.data.pathway);
        } else {
          // Fetch all pathways
          const response = await apiClient.get('/Pathways');
          setData(response.data || []);
          setPathwayInfo(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathwayId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // --- RENDER PATHWAY LIST ---
  if (!pathwayId) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'} pb-20`}>
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0f1115] py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              <BookOpen size={14} />
              GameNode Academy
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter">Danh Sách Khóa Học</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Không gian học tập chuyên sâu với các bài giảng và nhiệm vụ thực hành từ cơ bản đến nâng cao.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.map((pathway) => (
              <div
                key={pathway.id || pathway.Id}
                onClick={() => navigate(`/courses/${pathway.slug || pathway.id || pathway.Id}`)}
                className={`group cursor-pointer relative flex flex-col rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:-translate-y-3 ${isDarkMode ? 'bg-[#1a1c23] border border-white/5' : 'bg-white border border-slate-200 shadow-2xl'}`}
              >
                <div className="h-56 relative overflow-hidden bg-slate-800">
                  <img 
                    src={pathway.thumbnail || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop'} 
                    alt={pathway.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                      <Layers size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-black text-lg">{(pathway.courseIds || []).length} Khóa học</div>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-3xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors tracking-tight">{pathway.title}</h3>
                  <p className="text-slate-400 leading-relaxed line-clamp-2 mb-8">{pathway.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {pathway.estimatedHours}H</span>
                      <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {pathway.difficulty}</span>
                    </div>
                    <div className="text-blue-500 font-black text-sm flex items-center gap-2">BẮT ĐẦU <ChevronRight size={18} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER COURSE LIST WITHIN PATHWAY ---
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'} pb-20`}>
      <div className="bg-slate-950 py-20 px-4 md:px-8 relative border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-sm"
          >
            <ArrowLeft size={18} /> QUAY LẠI LỘ TRÌNH
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4">{pathwayInfo?.title}</h1>
              <p className="text-slate-400 max-w-2xl text-lg">{pathwayInfo?.description}</p>
            </div>
            <div className="px-6 py-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tiến độ lộ trình</div>
              <div className="text-2xl font-black text-white">0 / {data.length} Khóa học</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid gap-6">
          {data.map((course, idx) => (
            <Link
              to={`/learn/${course.id || course.Id}`}
              key={course.id || course.Id}
              className={`group flex flex-col md:flex-row items-center gap-8 p-8 rounded-[32px] transition-all duration-300 border ${isDarkMode ? 'bg-[#1a1c23] border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5' : 'bg-white border-slate-200 shadow-xl'}`}
            >
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" 
                  alt="" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 rounded">KHÓA HỌC {idx + 1}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{course.difficulty || 'Cơ bản'}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                <p className="text-slate-400 line-clamp-1 text-sm">{course.description}</p>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5"><Clock size={16} /> {course.estimatedHours}H</div>
                  <div className="flex items-center gap-1.5 text-emerald-500"><BookOpen size={16} /> {course.xpReward} XP</div>
                </div>
                <div className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
                  Học Ngay
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;
