import React, { useState, useContext } from 'react';
import { User, Lock, Bell, Globe, Info, ChevronRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthContext from "../../context/AuthContext";
import { changePassword, deleteAccount } from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
    const { user, logout } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({ old: '', new: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPassword = async () => {
        if (!passwords.old || !passwords.new) {
            setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            await changePassword(passwords.old, passwords.new);
            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setPasswords({ old: '', new: '' });
        } catch (e) {
            setMessage({ type: 'error', text: e?.response?.data || 'Đổi mật khẩu thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('CẢNH BÁO: Bạn chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setLoading(true);
            await deleteAccount();
            alert('Tài khoản của bạn đã bị xóa.');
            logout();
            navigate('/');
        } catch (e) {
            alert(e?.response?.data || 'Xóa tài khoản thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-8 animate-fade-in p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex-1 space-y-6 max-w-4xl">

                <div className="space-y-6">

                    {/*Thông tin tài khoản*/}
                    <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 border-b pb-4 text-slate-900 dark:text-white">Thông tin tài khoản</h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Email:</span>
                                <div className="md:col-span-3">
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{user?.email || 'N/A'}</p>
                                    <div className="flex items-center gap-1 mt-1 text-slate-400">
                                        <Info size={14} />
                                        <p className="text-xs">Bạn không thể đổi email.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Username:</span>
                                <div className="md:col-span-3">
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{user?.user_name || user?.userName || 'N/A'}</p>
                                    <button 
                                        onClick={() => navigate('/profile', { state: { activeTab: 'ProfileInfo' } })}
                                        className="text-blue-600 text-xs font-bold mt-2 flex items-center hover:underline"
                                    >
                                        Cập nhật thông tin cá nhân <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Đổi mật khẩu */}
                    <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 border-b pb-4 text-slate-900 dark:text-white">Đổi mật khẩu</h3>

                        {message.text && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-5 max-w-md">
                            {/* Mật khẩu cũ */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Mật khẩu cũ</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="old"
                                        value={passwords.old}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập mật khẩu cũ"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Mật khẩu mới */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Mật khẩu mới</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="new"
                                        value={passwords.new}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập mật khẩu mới"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all text-slate-900 dark:text-white"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleSubmitPassword}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading && <Loader2 size={14} className="animate-spin" />}
                                    Cập nhật
                                </button>
                                <button
                                    onClick={() => setPasswords({ old: '', new: '' })}
                                    className="px-6 py-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 transition-all"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*Xóa tài khoản */}
                    <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 border-b pb-4 text-slate-900 dark:text-white">Xóa tài khoản</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
                            Tài khoản của bạn sẽ bị xóa vĩnh viễn, các dữ liệu có liên quan cũng sẽ bị gỡ bỏ, vui lòng cân nhắc kỹ trước khi thực hiện.
                        </p>
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="px-6 py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            Xóa tài khoản
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Setting;