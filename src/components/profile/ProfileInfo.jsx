import React, { useState, useRef } from 'react';
import {
    Camera, Pencil, MapPin, Mail, Phone,
    Github, Facebook, Globe, PlusCircle,
    ShieldCheck, Trophy, Target, X, Save, Loader2, Linkedin
} from 'lucide-react';
import { updateProfile, uploadAvatar } from '../../services/adminApi';
import toast from 'react-hot-toast';

const ProfileInfo = ({ profile, onProfileUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [skillInput, setSkillInput] = useState('');
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleCoverClick = () => {
        coverInputRef.current.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File quá lớn. Vui lòng chọn file dưới 5MB.');
            return;
        }

        setAvatarUploading(true);
        try {
            const { url } = await uploadAvatar(file);
            // Immediately update the profile with the new avatar URL
            const updatedProfile = await updateProfile({ avatarUrl: url });
            if (onProfileUpdated) {
                onProfileUpdated(updatedProfile);
            }
            toast.success('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            console.error('Avatar upload failed:', error);
            toast.error('Tải ảnh đại diện thất bại.');
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File quá lớn. Vui lòng chọn file dưới 10MB.');
            return;
        }

        setCoverUploading(true);
        try {
            const { url } = await uploadAvatar(file);
            const updatedProfile = await updateProfile({ coverUrl: url });
            if (onProfileUpdated) {
                onProfileUpdated(updatedProfile);
            }
            toast.success('Cập nhật ảnh bìa thành công!');
        } catch (error) {
            console.error('Cover upload failed:', error);
            toast.error('Tải ảnh bìa thất bại.');
        } finally {
            setCoverUploading(false);
        }
    };

    const startEdit = () => {
        setEditForm({
            fullName: profile.name || '',
            bio: profile.bio || '',
            phone: profile.phone || '',
            address: profile.address || '',
            birthDate: profile.birthDate || '',
            skills: [...(profile.skills || [])],
            links: {
                github: profile.links?.github || '',
                portfolio: profile.links?.portfolio || '',
                linkedin: profile.links?.linkedIn || '',
                facebook: profile.links?.facebook || '',
            }
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateProfile(editForm);
            if (onProfileUpdated) {
                onProfileUpdated(result);
            }
            setIsEditing(false);
            toast.success('Cập nhật thông tin thành công!');
        } catch (e) {
            const msg = typeof e.response?.data === 'string' 
                ? e.response.data 
                : e.response?.data?.message || 'Cập nhật thất bại.';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !editForm.skills.includes(s)) {
            setEditForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        setEditForm(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const displaySkills = isEditing ? editForm.skills : (profile.skills || []);
    const displayBio = isEditing ? editForm.bio : (profile.bio || '');
    const displayPhone = isEditing ? editForm.phone : (profile.phone || '');
    const displayAddress = isEditing ? editForm.address : (profile.address || '');

    return (
        <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar bg-white dark:bg-[#050505]">
            {/* Cover photo */}
            <div className="relative h-80 md:h-[480px] w-full overflow-hidden group/cover bg-slate-100 dark:bg-slate-900">
                {profile.coverUrl ? (
                    <img
                        src={profile.coverUrl}
                        className="w-full h-full object-cover object-center transition-opacity duration-500"
                        alt="Cover"
                    />
                ) : (
                    <img
                        src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1200&q=80"
                        className="w-full h-full object-cover opacity-80"
                        alt="Cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050505] via-transparent to-black/20" />

                {coverUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
                        <Loader2 size={40} className="text-white animate-spin" />
                    </div>
                )}

                <button
                    onClick={handleCoverClick}
                    disabled={coverUploading}
                    className="absolute bottom-6 right-8 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 transition-all group shadow-xl z-30 disabled:opacity-50"
                >
                    <Camera size={20} className="group-hover:scale-110" />
                </button>
                <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            {/* Profile header */}
            <div className="px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="h-44 w-44 rounded-[2.5rem] border-[6px] border-white dark:border-[#050505] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 relative">
                                {avatarUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                                        <Loader2 size={32} className="text-white animate-spin" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center z-10 opacity-0 group-hover:opacity-100">
                                        <Camera size={28} className="text-white" />
                                    </div>
                                )}

                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-5xl font-black">
                                        {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="text-center md:text-left mb-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                {isEditing ? (
                                    <input
                                        value={editForm.fullName}
                                        onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                                        className="text-4xl font-black tracking-tight text-slate-900 dark:text-white bg-transparent border-b-2 border-blue-500 outline-none pb-1"
                                        placeholder="Họ và tên"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{profile.name}</h1>
                                )}
                                <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-600/20">Developer</span>
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">{profile.userName}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-blue-500" />
                                            <input
                                                value={editForm.address}
                                                onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))}
                                                className="bg-transparent border-b border-slate-300 dark:border-slate-600 outline-none text-sm px-1 w-48"
                                                placeholder="Địa chỉ"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {displayAddress && (
                                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500" /> {displayAddress}</span>
                                        )}
                                        {profile.links?.portfolio && (
                                            <span className="flex items-center gap-1.5"><Globe size={16} className="text-blue-500" /> {profile.links.portfolio}</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-white/10 transition-all active:scale-95"
                                >
                                    <X size={18} /> Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={startEdit}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                            >
                                <Pencil size={18} /> Chỉnh sửa hồ sơ
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <Trophy className="text-amber-500" size={22} />
                                Về bản thân
                            </h3>
                            {isEditing ? (
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 ring-blue-500/20 resize-none min-h-[100px]"
                                    placeholder="Giới thiệu bản thân..."
                                />
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {displayBio ? `"${displayBio}"` : <span className="text-slate-400 not-italic">Chưa có thông tin giới thiệu.</span>}
                                </p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <PlusCircle className="text-blue-500" size={22} />
                                Kỹ năng
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {displaySkills.length > 0 ? displaySkills.map(skill => (
                                    <div
                                        key={skill}
                                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-blue-400 text-sm font-semibold border border-slate-200 dark:border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition flex items-center gap-2"
                                    >
                                        {skill}
                                        {isEditing && (
                                            <X size={14} className="cursor-pointer text-red-400 hover:text-red-500" onClick={() => removeSkill(skill)} />
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-slate-400 text-sm">Chưa có kỹ năng nào.</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex gap-2 mt-4">
                                    <input
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20 flex-1"
                                        placeholder="Thêm kỹ năng..."
                                    />
                                    <button onClick={addSkill} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
                                        Thêm
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Social Links (edit mode) */}
                        {isEditing && (
                            <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <Globe className="text-emerald-500" size={22} />
                                    Liên kết mạng xã hội
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">GitHub</label>
                                        <input
                                            value={editForm.links.github}
                                            onChange={e => setEditForm(p => ({ ...p, links: { ...p.links, github: e.target.value } }))}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Portfolio</label>
                                        <input
                                            value={editForm.links.portfolio}
                                            onChange={e => setEditForm(p => ({ ...p, links: { ...p.links, portfolio: e.target.value } }))}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                            placeholder="https://portfolio.dev"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">LinkedIn</label>
                                        <input
                                            value={editForm.links.linkedin}
                                            onChange={e => setEditForm(p => ({ ...p, links: { ...p.links, linkedin: e.target.value } }))}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Facebook</label>
                                        <input
                                            value={editForm.links.facebook}
                                            onChange={e => setEditForm(p => ({ ...p, links: { ...p.links, facebook: e.target.value } }))}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                            placeholder="https://facebook.com/username"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* Progress card */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Target size={20} className="text-blue-200" />
                                    <h3 className="font-bold uppercase text-sm tracking-wider">Tiến độ</h3>
                                </div>
                                <p className="text-sm text-blue-100 mb-4">
                                    Đã hoàn thành {profile.completedNodes?.length || 0} node kiến thức
                                </p>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-5">
                                    <div className="h-full bg-white transition-all" style={{ width: `${Math.min((profile.completedNodes?.length || 0) * 5, 100)}%` }} />
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
                                        <p className="text-sm font-semibold">{profile.email || 'Chưa cập nhật'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 group">
                                    <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase">Phone</p>
                                        {isEditing ? (
                                            <input
                                                value={editForm.phone}
                                                onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                                className="text-sm font-semibold bg-transparent border-b border-slate-300 dark:border-slate-600 outline-none w-40"
                                                placeholder="Số điện thoại"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold">{displayPhone || 'Chưa cập nhật'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social links (view mode) */}
                            <div className="mt-6 flex justify-center gap-5 text-slate-400">
                                {profile.links?.github && (
                                    <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                                        <Github className="hover:text-black dark:hover:text-white cursor-pointer transition" size={20} />
                                    </a>
                                )}
                                {profile.links?.linkedIn && (
                                    <a href={profile.links.linkedIn} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="hover:text-blue-600 cursor-pointer transition" size={20} />
                                    </a>
                                )}
                                {profile.links?.facebook && (
                                    <a href={profile.links.facebook} target="_blank" rel="noopener noreferrer">
                                        <Facebook className="hover:text-blue-400 cursor-pointer transition" size={20} />
                                    </a>
                                )}
                                {profile.links?.portfolio && (
                                    <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">
                                        <Globe className="hover:text-emerald-400 cursor-pointer transition" size={20} />
                                    </a>
                                )}
                                {!profile.links?.github && !profile.links?.linkedIn && !profile.links?.facebook && !profile.links?.portfolio && (
                                    <>
                                        <Github className="opacity-30" size={20} />
                                        <Facebook className="opacity-30" size={20} />
                                        <Globe className="opacity-30" size={20} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;