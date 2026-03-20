import React, { useContext, useState } from 'react'
import { Eye, EyeOff, X, Mail, Lock } from 'lucide-react'
import AuthContext from '../context/AuthContext'
import apiClient from '../services/apiClient';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState({ userName: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/users/login', formData);
      const { user, token } = response.data;
      
      login(user, token);
      alert('Đăng nhập thành công!');
      onClose();
    } catch (err) {
      setError(err.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0f1115]/95 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
        
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Đăng nhập
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                placeholder="nhon@example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none ring-blue-500/20 transition focus:ring-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 pl-12 pr-12 text-slate-900 dark:text-white outline-none ring-blue-500/20 transition focus:ring-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:scale-[1.01] active:scale-95"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <button onClick={onSwitchToRegister} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal