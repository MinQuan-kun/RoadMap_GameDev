import React, { useState, useEffect, useContext } from 'react';
import { 
    Search, Briefcase, MapPin, DollarSign, 
    Calendar, Trash2, ExternalLink, Filter, 
    BookmarkCheck, Clock, CheckCircle2, ChevronRight,
    Loader2, FileX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getMyApplications } from '../../services/adminApi';

const MyJobs = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getMyApplications();
                setApplications(Array.isArray(data) ? data : []);
            } catch (e) {
                setError('Không thể tải danh sách ứng tuyển.');
                console.error('Error loading applications:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // Hàm định dạng màu sắc cho Status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Interview': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'Accepted': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Interview': return 'Phỏng vấn';
            case 'Pending': return 'Đang chờ';
            case 'Accepted': return 'Đã chấp nhận';
            case 'Rejected': return 'Bị từ chối';
            default: return status || 'N/A';
        }
    };

    const filteredApps = applications.filter(app =>
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-8 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Việc làm của tôi</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        {loading ? 'Đang tải...' : `${filteredApps.length} đơn ứng tuyển`}
                    </p>
                </div>

                <button
                    onClick={() => navigate('/Jobs')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Search size={16} /> Tìm việc mới
                </button>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm vị trí..."
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-blue-500/20"
                    />
                </div>
                <button
                    onClick={() => setSearchTerm('')}
                    className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all text-sm"
                >
                    <Filter size={18} /> {searchTerm ? 'Xóa lọc' : 'Tất cả'}
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 p-8 text-rose-600 dark:text-rose-300 font-semibold text-center">
                    {error}
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-12 text-center">
                    <FileX size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400">
                        {searchTerm ? 'Không tìm thấy kết quả' : 'Bạn chưa ứng tuyển vị trí nào'}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                        {!searchTerm && 'Khám phá các cơ hội nghề nghiệp phù hợp với lộ trình của bạn'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => navigate('/Jobs')}
                            className="mt-6 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                        >
                            Tìm việc ngay
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5">
                    {filteredApps.map((app) => (
                        <div key={app.applicationId} className="group relative p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">

                                <div className="flex gap-5">
                                    {/* Company Logo */}
                                    <div className="h-20 w-20 min-w-[80px] rounded-[1.5rem] bg-slate-100 dark:bg-white/10 p-3 flex items-center justify-center border border-slate-200 dark:border-white/10 overflow-hidden">
                                        {app.company?.logo ? (
                                            <img src={app.company.logo} alt={app.company.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Briefcase size={28} className="text-slate-400" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                                            {app.job?.title || 'Vị trí không xác định'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                                            <span>{app.company?.name || 'Company'}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                                <MapPin size={14} /> {app.job?.location || '—'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-4">
                                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight border border-blue-500/20">
                                                <Clock size={12} /> Đã nộp: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : '—'}
                                            </span>
                                            {app.job?.salary && (
                                                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-tight border border-emerald-500/20">
                                                    <DollarSign size={12} /> {app.job.salary}
                                                </span>
                                            )}
                                            {app.matchingScore > 0 && (
                                                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-black uppercase tracking-tight border border-purple-500/20">
                                                    Match: {Math.round(app.matchingScore)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center lg:flex-col justify-end gap-3 lg:min-w-[180px]">
                                    <div className={`w-full py-2.5 px-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusStyle(app.status)} shadow-sm`}>
                                        {getStatusLabel(app.status)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;