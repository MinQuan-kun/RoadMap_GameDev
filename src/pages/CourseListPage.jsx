import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Star, BookOpen, ChevronRight, Loader2, Compass, Layers, ShieldCheck, ArrowLeft, MonitorPlay, Search, Map } from 'lucide-react';
import apiClient from '../services/apiClient';
import AuthContext from '../context/AuthContext';
import { followPathway, unfollowPathway } from '../services/userApi';
import toast from 'react-hot-toast';

const CourseListPage = ({ isDarkMode }) => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [pathwayInfo, setPathwayInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('official');
  const [communityType, setCommunityType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
          // Fetch pathways based on active tab, community type filter, and search query
          let url = '/Pathways';
          const params = [];
          if (activeTab === 'official') {
            params.push('type=official');
          } else {
            params.push(communityType === 'recruiter' ? 'type=recruiter' : 'type=community');
          }
          if (searchQuery) {
            params.push(`search=${encodeURIComponent(searchQuery)}`);
          }
          if (params.length > 0) {
            url += '?' + params.join('&');
          }
          const response = await apiClient.get(url);
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
  }, [pathwayId, activeTab, communityType, searchQuery]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để theo dõi lộ trình.");
      return;
    }
    if (!pathwayInfo?.id) return;

    const isFollowing = user?.followedPathwayIds?.includes(pathwayInfo.id);
    try {
      if (isFollowing) {
        await unfollowPathway(pathwayInfo.id);
        setUser(prev => ({
          ...prev,
          followedPathwayIds: (prev.followedPathwayIds || []).filter(id => id !== pathwayInfo.id)
        }));
        toast.success("Đã hủy theo dõi lộ trình!");
      } else {
        await followPathway(pathwayInfo.id);
        setUser(prev => ({
          ...prev,
          followedPathwayIds: [...(prev.followedPathwayIds || []), pathwayInfo.id]
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1115]">
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] text-slate-900 dark:text-white pb-20 transition-colors duration-300">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0f1115] py-24 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
              <BookOpen size={14} />
              GameNode Academy
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">Danh Sách Lộ Trình</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Không gian học tập chuyên sâu với các bài giảng và nhiệm vụ thực hành từ cơ bản đến nâng cao.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
          {/* Main Tabs */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-2 bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab('official');
                  }}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    activeTab === 'official'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Lộ trình chính thức
                </button>
                <button
                  onClick={() => {
                    setActiveTab('community');
                  }}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                    activeTab === 'community'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Lộ trình Cộng đồng
                </button>
              </div>

              {/* Sub Filter for Community Tab */}
              {activeTab === 'community' && (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-full sm:w-auto">
                  <button
                    onClick={() => setCommunityType('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                      communityType === 'all'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Tất cả cộng đồng
                  </button>
                  <button
                    onClick={() => setCommunityType('recruiter')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                      communityType === 'recruiter'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Nhà tuyển dụng (Jobs)
                  </button>
                </div>
              )}
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm lộ trình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-xs font-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-10">
            {/* List display */}
            {data.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-white/5 p-16 text-center bg-white dark:bg-[#1a1c23] shadow-xl">
                <Map className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Chưa có lộ trình nào thuộc danh mục này</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hãy quay lại sau hoặc đóng góp lộ trình của riêng bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {data.map((pathway) => (
                  <div
                    key={pathway.id || pathway.Id}
                    onClick={() => navigate(`/courses/${pathway.slug || pathway.id || pathway.Id}`)}
                    className="group cursor-pointer relative flex flex-col rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:-translate-y-3 bg-white dark:bg-[#1a1c23] border border-slate-200 dark:border-white/5 shadow-xl"
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
                          <div className="text-white font-black text-lg">{(pathway.courseIds || pathway.CourseIds || []).length} Khóa học</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-10">
                      <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{pathway.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-8">{pathway.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase">
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {pathway.estimatedHours || pathway.EstimatedHours}H</span>
                          <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {pathway.difficulty || pathway.Difficulty}</span>
                        </div>
                        <div className="text-blue-500 font-black text-sm flex items-center gap-2">BẮT ĐẦU <ChevronRight size={18} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate completed courses
  let completedCoursesCount = 0;
  if (user && data && data.length > 0) {
    data.forEach(course => {
      const courseLessons = [];
      if (course.modules) {
        course.modules.forEach(m => {
          if (m.lessons) {
            m.lessons.forEach(l => {
              courseLessons.push(l.id || l.Id);
            });
          }
        });
      }
      if (courseLessons.length > 0 && courseLessons.every(id => user.completedNodes?.includes(id))) {
        completedCoursesCount++;
      }
    });
  }

  // --- RENDER COURSE LIST WITHIN PATHWAY ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div 
        className="relative py-24 px-4 md:px-8 border-b border-white/5 bg-slate-900 overflow-hidden"
        style={{
          backgroundImage: pathwayInfo?.coverUrl || pathwayInfo?.thumbnail ? `linear-gradient(to bottom, rgba(15, 17, 21, 0.7), rgba(15, 17, 21, 0.98)), url(${pathwayInfo?.coverUrl || pathwayInfo?.thumbnail})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-bold text-sm"
          >
            <ArrowLeft size={18} /> QUAY LẠI LỘ TRÌNH
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{pathwayInfo?.title}</h1>
                {isAuthenticated && pathwayInfo?.id && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                      user?.followedPathwayIds?.includes(pathwayInfo?.id)
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-md'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    }`}
                  >
                    {user?.followedPathwayIds?.includes(pathwayInfo?.id) ? 'Hủy theo dõi' : 'Theo dõi lộ trình'}
                  </button>
                )}
              </div>
              <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">{pathwayInfo?.description}</p>
            </div>
            <div className="px-6 py-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm flex-shrink-0">
              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tiến độ lộ trình</div>
              <div className="text-2xl font-black text-white">{completedCoursesCount} / {data.length} Khóa học</div>
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
              className="group flex flex-col md:flex-row items-center gap-8 p-8 rounded-[32px] transition-all duration-300 border bg-white dark:bg-[#1a1c23] border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-blue-500/50 dark:hover:bg-blue-500/5"
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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-1 text-sm">{course.description}</p>
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
