import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResult, getPathways, getCourses } from '../services/roadmapApi';
import { Target, Rocket, Loader2, Award, ArrowRight, Compass } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { followPathway, unfollowPathway } from '../services/userApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SurveyResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [recommendedRoadmaps, setRecommendedRoadmaps] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isFallback, setIsFallback] = useState(false); // true = no specific match, showing all
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getQuizResult(id);
        setResult(res);

        const allPathways = await getPathways();

        if (res.recommendedPathwayIds && res.recommendedPathwayIds.length > 0) {
          // Try to match recommended pathway IDs to actual pathway objects
          const matches = res.recommendedPathwayIds
            .map(pid => allPathways.find(p => p.id === pid))
            .filter(Boolean);

          if (matches.length > 0) {
            setRecommendedRoadmaps(matches);
            setIsFallback(false);
          } else {
            // IDs exist but couldn't find matching pathways → show all as fallback
            setRecommendedRoadmaps(allPathways);
            setIsFallback(true);
          }
        } else {
          // No weights/mappings configured → show all pathways as fallback
          setRecommendedRoadmaps(allPathways);
          setIsFallback(true);
        }

        if (res.recommendedCourseIds && res.recommendedCourseIds.length > 0) {
          const allCourses = await getCourses();
          const courseMatches = allCourses.filter(c => res.recommendedCourseIds.includes(c.id));
          setRecommendedCourses(courseMatches);
        }
      } catch (err) {
        console.error('Error fetching quiz result:', err);
        // Even on error, try to show all pathways
        try {
          const allPathways = await getPathways();
          setRecommendedRoadmaps(allPathways);
          setIsFallback(true);
        } catch (_) { }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const handleFollowToggle = async (pathwayId) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để theo dõi lộ trình.");
      return;
    }
    const isFollowing = user.followedPathwayIds?.includes(pathwayId);
    try {
      if (isFollowing) {
        await unfollowPathway(pathwayId);
        setUser(prev => ({
          ...prev,
          followedPathwayIds: (prev.followedPathwayIds || []).filter(id => id !== pathwayId)
        }));
        toast.success("Đã hủy theo dõi lộ trình!");
      } else {
        await followPathway(pathwayId);
        setUser(prev => ({
          ...prev,
          followedPathwayIds: [...(prev.followedPathwayIds || []), pathwayId]
        }));
        toast.success("Theo dõi lộ trình thành công!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Đang phân tích kết quả...</p>
        </div>
      </div>
    );
  }

  const topRoadmap = recommendedRoadmaps[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] pt-24 pb-16 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isFallback ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-500' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'}`}>
            {isFallback ? <Compass size={40} /> : <Award size={40} />}
          </div>

          {isFallback ? (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Khám Phá Lộ Trình Học Tập
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Dựa trên câu trả lời của bạn, hệ thống gợi ý bạn khám phá các lộ trình dưới đây để tìm hướng đi phù hợp nhất.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                Kết Quả Phân Tích Của Bạn
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Dựa trên hồ sơ kỹ năng và mục tiêu của bạn, đây là những lộ trình được đề xuất phù hợp nhất.
              </p>
            </>
          )}
        </motion.div>

        {/* ── Pathway Cards ── */}
        <div className="space-y-12">
          {recommendedRoadmaps.length === 0 ? (
            // Absolute last resort: no pathways exist at all in the system
            <div className="flex flex-col items-center py-16 text-center">
              <Target size={64} className="text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">
                Hệ thống chưa có lộ trình nào được thiết lập. Vui lòng quay lại sau.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          ) : isFallback ? (
            // Unified view for Fallback mode
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Các Lộ Trình Có Sẵn
              </h2>
              {recommendedRoadmaps.map((roadmap, idx) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex-shrink-0">
                    {roadmap.thumbnail ? (
                      <img src={roadmap.thumbnail} alt={roadmap.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Target size={48} opacity={0.4} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-500/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                      Khám phá
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-2 inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full w-max">
                      {roadmap.difficulty || 'All Levels'}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{roadmap.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                      {roadmap.description || 'Khám phá kiến thức chuyên sâu và thực hành thực tế để làm chủ công cụ này.'}
                    </p>
                    <div className="mt-auto flex justify-end items-center gap-3 flex-wrap">
                      {user && (
                        <button
                          onClick={() => handleFollowToggle(roadmap.id)}
                          className={`px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${user.followedPathwayIds?.includes(roadmap.id)
                            ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md'
                            : 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20'
                            }`}
                        >
                          {user.followedPathwayIds?.includes(roadmap.id) ? 'Hủy theo dõi' : 'Theo dõi lộ trình'}
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-bold transition-all group"
                      >
                        Bắt đầu học <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">

              {/* 1. LỘ TRÌNH PHÙ HỢP NHẤT */}
              {topRoadmap && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">🎯</div>
                    <span className="font-extrabold text-sm md:text-base tracking-wide uppercase">
                      Đây là lộ trình phù hợp nhất với kết quả của bạn
                    </span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-[#121214] border-2 border-blue-500 dark:border-blue-500/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5 relative overflow-hidden"
                  >
                    {/* Decorative glowing background glow */}
                    <div className="absolute -right-24 -top-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Thumbnail */}
                    <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-200 dark:border-white/5">
                      {topRoadmap.thumbnail ? (
                        <img src={topRoadmap.thumbnail} alt={topRoadmap.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Target size={48} opacity={0.4} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                        Phù hợp nhất
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col z-10">
                      <div className="mb-2 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black rounded-full w-max uppercase tracking-wider">
                        {topRoadmap.difficulty || 'All Levels'}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
                        {topRoadmap.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {topRoadmap.description || 'Khám phá kiến thức chuyên sâu và thực hành thực tế để làm chủ công cụ này.'}
                      </p>
                      <div className="mt-auto flex justify-end items-center gap-3 flex-wrap">
                        {user && (
                          <button
                            onClick={() => handleFollowToggle(topRoadmap.id)}
                            className={`px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${user.followedPathwayIds?.includes(topRoadmap.id)
                              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md'
                              : 'bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20'
                              }`}
                          >
                            {user.followedPathwayIds?.includes(topRoadmap.id) ? 'Hủy theo dõi' : 'Theo dõi lộ trình'}
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/roadmap/${topRoadmap.id}`)}
                          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white rounded-xl font-extrabold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                        >
                          Bắt đầu học ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* 2. CÁC LỘ TRÌNH THAM KHẢO KHÁC */}
              {recommendedRoadmaps.length > 1 && (
                <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span>💡</span> Các Lộ Trình Tham Khảo Khác
                  </h3>

                  <div className="space-y-6">
                    {recommendedRoadmaps.slice(1).map((roadmap, idx) => (
                      <motion.div
                        key={roadmap.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-slate-400/50 dark:hover:border-white/20 transition-all duration-300"
                      >
                        {/* Thumbnail */}
                        <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex-shrink-0">
                          {roadmap.thumbnail ? (
                            <img src={roadmap.thumbnail} alt={roadmap.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Target size={48} opacity={0.4} />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 px-3 py-1 bg-slate-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                            Gợi ý
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                          <div className="mb-2 inline-block px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-bold rounded-full w-max">
                            {roadmap.difficulty || 'All Levels'}
                          </div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{roadmap.title}</h2>
                          <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                            {roadmap.description || 'Khám phá kiến thức chuyên sâu và thực hành thực tế để làm chủ công cụ này.'}
                          </p>
                          <div className="mt-auto flex justify-end items-center gap-3 flex-wrap">
                            {user && (
                              <button
                                onClick={() => handleFollowToggle(roadmap.id)}
                                className={`px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${user.followedPathwayIds?.includes(roadmap.id)
                                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md'
                                  : 'bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20'
                                  }`}
                              >
                                {user.followedPathwayIds?.includes(roadmap.id) ? 'Hủy theo dõi' : 'Theo dõi lộ trình'}
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                              className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-all group"
                            >
                              Khám phá <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* ── Recommended Courses ── */}
      {recommendedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Các Khóa Học Bổ Trợ Dành Cho Bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{course.description || "Khóa học chi tiết về chủ đề này."}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Footer CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Về trang chủ
        </button>
      </motion.div>

    </div>

  );
};

export default SurveyResultPage;

