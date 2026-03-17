import React from 'react';
import {
    Camera, Pencil, MapPin, Mail, Phone,
    Github, Twitter, Globe, PlusCircle,
    ShieldCheck, Trophy, Target
} from 'lucide-react';

const ProfileInfo = ({ profile }) => {
    return (
        <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-white dark:bg-[#050505]">
            {/*Avatar*/}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1200&q=80"
                    className="w-full h-full object-cover opacity-80"
                    alt="Cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050505] via-transparent to-black/20" />

                <button className="absolute bottom-6 right-8 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all group shadow-xl">
                    <Camera size={20} className="group-hover:scale-110" />
                </button>
            </div>

            {/* Thông tin kế bên avatar */}
            <div className="px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative group">
                            <div className="h-44 w-44 rounded-[2.5rem] border-[6px] border-white dark:border-[#050505] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
                                <img
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80"
                                    alt="Avatar"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        </div>

                        <div className="text-center md:text-left mb-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{profile.name}</h1>
                                <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-600/20">New Developer</span>
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">{profile.userName}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500" /> {profile.address}</span>
                                <span className="flex items-center gap-1.5"><Globe size={16} className="text-blue-500" /> {profile.link || 'nhon.gamedev.io'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            <Pencil size={18} /> Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>

                {/* Thông tin phía dưới */}
                <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* About */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <Trophy className="text-amber-500" size={22} />
                                Về bản thân
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                "{profile.bio}"
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <PlusCircle className="text-blue-500" size={22} />
                                Kỹ năng
                            </h3>

                            {/* grid đẹp hơn flex */}
                            <div className="flex flex-wrap gap-3">
                                {['Unity', 'C#', 'Unreal Engine', 'C++', 'Git', 'Shader Graph', 'MongoDB', '.NET'].map(skill => (
                                    <div
                                        key={skill}
                                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-blue-400 text-sm font-semibold border border-slate-200 dark:border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">

                        {/* Progress (ĐƯA LÊN TRÊN) */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Target size={20} className="text-blue-200" />
                                    <h3 className="font-bold uppercase text-sm tracking-wider">
                                        Roadmap
                                    </h3>
                                </div>

                                <p className="text-sm text-blue-100 mb-4">
                                    Unity Gameplay Engineer – 75%
                                </p>

                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-5">
                                    <div className="h-full bg-white transition-all" style={{ width: '75%' }} />
                                </div>

                                <button className="w-full py-2.5 rounded-lg bg-white text-blue-600 font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition active:scale-95">
                                    Tiếp tục học
                                </button>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                            <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-slate-400">
                                Thông tin liên hệ
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-center gap-3 group">
                                    <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase">Email</p>
                                        <p className="text-sm font-semibold">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 group">
                                    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase">Phone</p>
                                        <p className="text-sm font-semibold">{profile.phone || '0987 654 321'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social */}
                            <div className="mt-6 flex justify-center gap-5 text-slate-400">
                                <Github className="hover:text-black dark:hover:text-white cursor-pointer transition" size={20} />
                                <Twitter className="hover:text-blue-400 cursor-pointer transition" size={20} />
                                <Globe className="hover:text-emerald-400 cursor-pointer transition" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;