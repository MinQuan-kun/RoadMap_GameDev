import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResult, getPathways, getCourses } from '../services/roadmapApi';
import { Target, Rocket, Loader2, Award, ArrowRight } from 'lucide-react';

const SurveyResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [recommendedRoadmaps, setRecommendedRoadmaps] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showConflictResolution, setShowConflictResolution] = useState(false);
  const [explicitPathway, setExplicitPathway] = useState(null);
  const [systemTopPathway, setSystemTopPathway] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getQuizResult(id);
        setResult(res);
        
        if (res.recommendedPathwayIds && res.recommendedPathwayIds.length > 0) {
          const allPathways = await getPathways();
          const matches = res.recommendedPathwayIds
            .map(id => allPathways.find(p => p.id === id))
            .filter(Boolean);
          setRecommendedRoadmaps(matches);
          
          if (res.hasConflict && res.explicitPreferencePathwayId && matches.length > 0) {
            setShowConflictResolution(true);
            setSystemTopPathway(matches[0]);
            setExplicitPathway(allPathways.find(p => p.id === res.explicitPreferencePathwayId));
          }
        }
        
        if (res.recommendedCourseIds && res.recommendedCourseIds.length > 0) {
          const allCourses = await getCourses();
          const matches = allCourses.filter(c => res.recommendedCourseIds.includes(c.id));
          setRecommendedCourses(matches);
        }
      } catch (err) {
        console.error('Error fetching quiz result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const handleResolveConflict = (choice) => {
    if (choice === 'explicit' && explicitPathway) {
      const newRoadmaps = [...recommendedRoadmaps];
      const explicitIndex = newRoadmaps.findIndex(r => r.id === explicitPathway.id);
      if (explicitIndex > -1) {
        newRoadmaps.splice(explicitIndex, 1);
      }
      newRoadmaps.unshift(explicitPathway);
      setRecommendedRoadmaps(newRoadmaps);
    }
    setShowConflictResolution(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!result || recommendedRoadmaps.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <Target size={64} className="text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy kết quả phù hợp</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">Dựa trên các câu trả lời của bạn, chúng tôi chưa tìm thấy lộ trình nào thực sự phù hợp trong hệ thống lúc này.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Quay về Trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Kết Quả Phân Tích Của Bạn</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Dựa trên hồ sơ kỹ năng và mục tiêu của bạn, đây là những lộ trình chúng tôi đề xuất để bạn bắt đầu sự nghiệp làm game.
          </p>
        </div>

        {showConflictResolution && explicitPathway && systemTopPathway && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl p-6 mb-12 animate-fade-in-up">
            <h2 className="text-xl font-black text-amber-800 dark:text-amber-500 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Phát hiện Mâu thuẫn Định hướng!
            </h2>
            <p className="text-amber-700 dark:text-amber-400/90 mb-5 leading-relaxed font-medium">
              Dựa trên bài khảo sát, mặc dù bạn đã chọn muốn học <strong className="text-slate-900 dark:text-white px-1">{explicitPathway.title}</strong>, 
              nhưng phân tích phong cách làm game và mục tiêu của bạn cho thấy bạn thực sự phù hợp với <strong className="text-slate-900 dark:text-white px-1">{systemTopPathway.title}</strong> hơn.
              Bạn muốn đi theo định hướng nào?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleResolveConflict('system')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                Nghe theo hệ thống (Học {systemTopPathway.title})
              </button>
              <button 
                onClick={() => handleResolveConflict('explicit')}
                className="px-6 py-3 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl font-bold transition-all"
              >
                Giữ quyết định ban đầu (Học {explicitPathway.title})
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Lộ trình Đề xuất</h2>
          {recommendedRoadmaps.map((roadmap, idx) => (
            <div 
              key={roadmap.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative">
                {roadmap.thumbnail ? (
                  <img src={roadmap.thumbnail} alt={roadmap.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Target size={48} opacity={0.5} />
                  </div>
                )}
                {idx === 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                    Phù hợp nhất
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="mb-2 inline-block px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-bold rounded-full w-max">
                  {roadmap.difficulty || 'Expert'}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{roadmap.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                  {roadmap.description || 'Khám phá kiến thức chuyên sâu và thực hành thực tế để làm chủ công cụ này.'}
                </p>
                <div className="mt-auto flex justify-end">
                  <button 
                    onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all group"
                  >
                    Bắt đầu học <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendedCourses.length > 0 && (
          <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Các Khóa Học Bổ Trợ Phù Hợp Dành Cho Bạn</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {recommendedCourses.map(course => (
                 <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{course.description || "Khóa học chi tiết về chủ đề này."}</p>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyResultPage;
