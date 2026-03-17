import React, { useState } from 'react';
import { 
    Search, Briefcase, MapPin, DollarSign, 
    Calendar, Trash2, ExternalLink, Filter, 
    BookmarkCheck, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';

const MyJobs = () => {
    const [activeSubTab, setActiveSubTab] = useState('saved');

    // Data mẫu, cập nhật lại bằng data thực sau
    const appliedJobs = [
        {
            id: 101,
            title: 'Technical Artist (Shader)',
            company: 'VNG Games',
            location: 'Quận 7, TP. HCM',
            salary: '30 - 50 Triệu',
            appliedDate: '10/03/2026',
            status: 'Đang chờ', // 'Đang chờ', 'Phỏng vấn', 'Đã xem'
            logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/vng-corporation-5c469f698d975.jpg'
        },
        {
            id: 102,
            title: 'Unity Developer (Mid-level)',
            company: 'Amanotes',
            location: 'Quận 10, TP. HCM',
            salary: '20 - 35 Triệu',
            appliedDate: '05/03/2026',
            status: 'Phỏng vấn',
            logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/amanotes-5b6d5b376994c.jpg'
        }
    ];

    const savedJobs = [
        {
            id: 1,
            title: 'Senior Unity Developer',
            company: 'VNG Corporation',
            location: 'Quận 7, TP. HCM',
            salary: '25 - 45 Triệu',
            posted: '2 ngày trước',
            type: 'Full-time',
            logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/vng-corporation-5c469f698d975.jpg'
        },
        {
            id: 2,
            title: 'Gameplay Programmer (C++)',
            company: 'Gameloft Vietnam',
            location: 'Quận 1, TP. HCM',
            salary: 'Thỏa thuận',
            posted: '5 ngày trước',
            type: 'Remote',
            logo: 'https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/gameloft-vietnam-5d07412803874.jpg'
        }
    ];

    const displayJobs = activeSubTab === 'saved' ? savedJobs : appliedJobs;

    // Hàm định dạng màu sắc cho Status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Phỏng vấn': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            case 'Đang chờ': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'Thành công': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="flex-1 space-y-8 animate-fade-in p-2">
            {/* 1. Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Việc làm của tôi</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Quản lý lộ trình sự nghiệp của bạn.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                    <button
                        onClick={() => setActiveSubTab('saved')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'saved' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Đã lưu ({savedJobs.length < 10 ? `0${savedJobs.length}` : savedJobs.length})
                    </button>
                    <button
                        onClick={() => setActiveSubTab('applied')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'applied' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Đã ứng tuyển ({appliedJobs.length < 10 ? `0${appliedJobs.length}` : appliedJobs.length})
                    </button>
                </div>
            </div>

            {/* 2. Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Tìm kiếm vị trí..." className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-blue-500/20" />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none appearance-none cursor-pointer">
                        <option>Tất cả địa điểm</option>
                        <option>TP. Hồ Chí Minh</option>
                    </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Filter size={18} /> Lọc kết quả
                </button>
            </div>

            {/* 3. Single Job List (Dùng chung cho cả 2 tab) */}
            <div className="grid grid-cols-1 gap-5">
                {displayJobs.map((job) => (
                    <div key={job.id} className="group relative p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">

                            <div className="flex gap-5">
                                {/* Company Logo */}
                                <div className="h-20 w-20 min-w-[80px] rounded-[1.5rem] bg-slate-100 dark:bg-white/10 p-3 flex items-center justify-center border border-slate-200 dark:border-white/10 overflow-hidden">
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                                        <span>{job.company}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                            <MapPin size={14} /> {job.location}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {activeSubTab === 'applied' ? (
                                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-tight border border-blue-500/20">
                                                <Clock size={12} /> Đã nộp: {job.appliedDate}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-tight border border-slate-500/20">
                                                <Calendar size={12} /> {job.posted}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-tight border border-emerald-500/20">
                                            <DollarSign size={12} /> {job.salary}
                                        </span>
                                        {job.type && (
                                            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-black uppercase tracking-tight border border-purple-500/20">
                                                <Briefcase size={12} /> {job.type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="flex items-center lg:flex-col justify-end gap-3 lg:min-w-[180px]">
                                {activeSubTab === 'applied' ? (
                                    <>
                                        {/* Hiển thị Trạng thái */}
                                        <div className={`w-full py-2.5 px-4 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusStyle(job.status)} shadow-sm`}>
                                            {job.status}
                                        </div>
                                        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                                            Hồ sơ đã nộp <ChevronRight size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                                            Ứng tuyển ngay <ExternalLink size={16} />
                                        </button>
                                        <div className="flex gap-2 w-full">
                                            <button className="flex-1 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">
                                                <Trash2 size={18} className="mx-auto" />
                                            </button>
                                            <button className="flex-1 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                                                <BookmarkCheck size={18} className="mx-auto" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;