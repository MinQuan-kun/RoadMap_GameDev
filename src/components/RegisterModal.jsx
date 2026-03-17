import React, { useContext, useState } from 'react'
import { Eye, EyeOff, X, User, Mail, Lock } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { login } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const mockUser = {
      id: '1',
      username: formData.email.split('@')[0],
      fullName: formData.fullName,
      email: formData.email,
    }
    login(mockUser)
    onClose()
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0f1115]/95 p-8 shadow-2xl backdrop-blur-xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Đăng ký
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Tên đăng nhập</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="fullName"
                required
                onChange={handleChange}
                placeholder="Laogicungton"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 pl-12 pr-4 text-slate-900 dark:text-white outline-none ring-blue-500/20 transition focus:ring-4"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                onChange={handleChange}
                placeholder="Tối thiểu 8 ký tự"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-3 pl-12 pr-12 text-slate-900 dark:text-white outline-none ring-blue-500/20 transition focus:ring-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:scale-[1.01] active:scale-95"
          >
            TẠO TÀI KHOẢN
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <button onClick={onSwitchToLogin} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal