import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Star, BookOpen, ChevronRight, Loader2, Compass, Layers, ShieldCheck } from 'lucide-react';
import apiClient from '../services/apiClient';

const LessonListPage = ({ isDarkMode }) => {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/Pathways');
        setPathways(response.data || []);
      } catch (error) {
        console.error('Error fetching pathways:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPathways();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f1115]' : 'bg-slate-50'}`}>
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f1115] text-white' : 'bg-slate-50 text-slate-900'} pb-20`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0f1115] py-28 px-4 md:px-8 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              <Compass size={14} className="animate-pulse" />
              Lộ Trình Nghề Nghiệp
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Chọn Lộ Trình,<br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Làm Chủ Tương Lai</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
              Các lộ trình học tập được chuyên gia thiết kế bài bản để đưa bạn từ con số 0 đến khi sẵn sàng cho công việc mơ ước.
            </p>
          </div>
        </div>
      </div>

      {/* Pathway List */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        {pathways.length === 0 ? (
          <div className={`p-24 text-center rounded-[40px] border-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className="text-slate-500 italic text-lg">Hiện tại chưa có lộ trình nào được xuất bản.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {pathways.map((pathway) => (
              <Link
                to={`/roadmap/${pathway.slug || pathway.id || pathway.Id}`}
                key={pathway.id || pathway.Id}
                className={`group relative flex flex-col rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:-translate-y-3 ${isDarkMode ? 'bg-[#1a1c23] border border-white/5' : 'bg-white border border-slate-200 shadow-2xl'}`}
              >
                {/* Visual Header */}
                <div className="h-56 relative overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                    {pathway.thumbnail && (
                      <img 
                        src={pathway.thumbnail} 
                        alt={pathway.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {pathway.isOfficial && (
                    <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <ShieldCheck size={12} />
                      Official
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-8 flex items-center gap-3">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <Layers size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Hệ thống Lộ trình</div>
                      <div className="text-white font-bold text-sm tracking-tight">
                        {(pathway.courseIds || []).length} Khóa học chuyên sâu
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {(pathway.tags || ['Game Dev', 'Career']).slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] font-black uppercase tracking-tighter text-slate-500">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-black">
                        <Star size={12} className="fill-yellow-500" />
                        4.9
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors tracking-tight leading-none">
                      {pathway.title || pathway.Title}
                    </h3>
                    <p className={`text-base mb-8 line-clamp-3 leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {pathway.description || pathway.Description || 'Bắt đầu hành trình chinh phục kỹ năng phát triển game chuyên nghiệp với lộ trình được tối ưu hóa.'}
                    </p>
                  </div>

                  <div className={`pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'} flex items-center justify-between`}>
                    <div className="flex items-center gap-6 text-[12px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        <span>{pathway.estimatedHours || 40}H Tổng cộng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-500" />
                        <span>{pathway.difficulty || 'Cơ bản'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-blue-500 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                      Xem Sơ Đồ
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonListPage;
