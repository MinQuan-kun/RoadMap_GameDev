import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, CircleDashed, Clock, ChevronDown, ChevronUp, Play, Star, Map, StarOff } from 'lucide-react';
import { getFollowedPathways, unfollowPathway } from '../../services/userApi';
import { toast } from 'react-hot-toast';

const FollowedPathways = () => {
    const [pathways, setPathways] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedPathwayId, setExpandedPathwayId] = useState(null);
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getFollowedPathways();
            setPathways(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setError('Không thể tải danh sách lộ trình đã theo dõi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUnfollow = async (e, pathwayId) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc chắn muốn hủy theo dõi lộ trình này?')) {
            return;
        }
        try {
            await unfollowPathway(pathwayId);
            toast.success('Hủy theo dõi lộ trình thành công!');
            setPathways(prev => prev.filter(p => p.id !== pathwayId));
        } catch (err) {
            console.error(err);
            toast.error('Hủy theo dõi thất bại.');
        }
    };

    const toggleExpand = (pathwayId) => {
        setExpandedPathwayId(expandedPathwayId === pathwayId ? null : pathwayId);
    };

    return (
        <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tôi đã theo dõi</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Theo dõi tiến độ học tập chi tiết của các lộ trình bạn đã đăng ký</p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-slate-500 dark:text-slate-400 font-medium">Đang tải dữ liệu...</span>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-6 text-rose-600 dark:text-rose-300 font-semibold">
                    {error}
                </div>
            )}

            {!loading && !error && pathways.length === 0 && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center bg-slate-50 dark:bg-white/5">
                    <Map className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-2">Chưa theo dõi lộ trình nào</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Hãy khám phá các lộ trình học tập chất lượng cao và nhấn nút Theo dõi để lưu trữ tại đây.</p>
                    <button 
                        onClick={() => navigate('/courses')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all"
                    >
                        Khám phá ngay
                    </button>
                </div>
            )}

            {!loading && !error && pathways.length > 0 && (
                <div className="grid gap-6">
                    {pathways.map((pathway) => {
                        const total = pathway.totalLessons || 0;
                        const completed = pathway.completedLessons || 0;
                        const skipped = pathway.skippedLessons || 0;
                        const percent = total > 0 ? Math.round(((completed + skipped) / total) * 100) : 0;

                        const isExpanded = expandedPathwayId === pathway.id;

                        return (
                            <div 
                                key={pathway.id}
                                className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0e12] overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl"
                            >
                                {/* Pathway Summary Card */}
                                <div 
                                    onClick={() => toggleExpand(pathway.id)}
                                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-center gap-6 md:gap-8 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 shadow-md">
                                        <img 
                                            src={pathway.thumbnail || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop'} 
                                            className="w-full h-full object-cover" 
                                            alt={pathway.title} 
                                        />
                                    </div>

                                    {/* Title & Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                pathway.isOfficial 
                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {pathway.isOfficial ? 'Official' : 'Community'}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-500 text-xs font-bold">
                                                <Clock size={14} /> {pathway.estimatedHours}h
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {pathway.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 truncate">
                                            {pathway.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
                                            {pathway.description}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                                <span>TIẾN ĐỘ HỌC</span>
                                                <span className="text-blue-500 dark:text-blue-400">{completed} / {total} bài học ({percent}%)</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end mt-4 md:mt-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/courses/${pathway.slug || pathway.id}`);
                                            }}
                                            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black hover:opacity-90 transition-opacity uppercase tracking-wider"
                                        >
                                            Học tiếp
                                        </button>
                                        <button
                                            onClick={(e) => handleUnfollow(e, pathway.id)}
                                            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shrink-0"
                                            title="Hủy theo dõi"
                                        >
                                            <StarOff size={16} />
                                        </button>
                                        <button className="text-slate-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Lesson Progress Details */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/30 p-6 md:p-8 space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                            <BookOpen size={14} /> Danh sách bài học & Tiến độ
                                        </h4>
                                        {(!pathway.lessonsProgress || pathway.lessonsProgress.length === 0) ? (
                                            <p className="text-sm text-slate-400 dark:text-slate-500 italic">Lộ trình này chưa có bài học nào được cấu hình.</p>
                                        ) : (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {pathway.lessonsProgress.map((lesson, idx) => {
                                                    const isCompleted = lesson.status === 'completed';
                                                    const isSkipped = lesson.status === 'skipped';
                                                    // Mark as "In Progress" (Đang học) if it's not completed/skipped, and it's the first not-started lesson
                                                    const isFirstNotStarted = !isCompleted && !isSkipped && 
                                                        pathway.lessonsProgress.findIndex(l => l.status !== 'completed' && l.status !== 'skipped') === idx;
                                                    
                                                    const statusLabel = isCompleted ? 'Đã xem' : isSkipped ? 'Bỏ qua' : isFirstNotStarted ? 'Đang học' : 'Chưa học';
                                                    
                                                    return (
                                                        <div 
                                                            key={lesson.lessonId}
                                                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                                                                isCompleted 
                                                                ? 'border-green-500/20 bg-green-500/5 dark:bg-green-500/5' 
                                                                : isSkipped
                                                                ? 'border-yellow-500/20 bg-yellow-500/5 dark:bg-yellow-500/5'
                                                                : isFirstNotStarted
                                                                ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5 shadow-md shadow-blue-500/5 animate-pulse-subtle'
                                                                : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/2'
                                                            }`}
                                                        >
                                                            {/* Status Icon */}
                                                            <div className="mt-0.5 flex-shrink-0">
                                                                {isCompleted && <CheckCircle2 className="text-green-500" size={18} />}
                                                                {isSkipped && <CheckCircle2 className="text-yellow-500" size={18} />}
                                                                {isFirstNotStarted && <Play className="text-blue-500 fill-blue-500 animate-scale" size={18} />}
                                                                {!isCompleted && !isSkipped && !isFirstNotStarted && <CircleDashed className="text-slate-300 dark:text-slate-600" size={18} />}
                                                            </div>

                                                            {/* Lesson Title & Descr */}
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                                    <span className="text-xs font-black text-slate-400">Bài {idx + 1}</span>
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                                        isCompleted 
                                                                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                                                        : isSkipped
                                                                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                                        : isFirstNotStarted
                                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                                                                    }`}>
                                                                        {statusLabel}
                                                                    </span>
                                                                </div>
                                                                <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate leading-snug">
                                                                    {lesson.title}
                                                                </h5>
                                                                {lesson.description && (
                                                                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                                                                        {lesson.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FollowedPathways;
