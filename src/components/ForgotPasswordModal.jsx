import React, { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail, X } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../services/apiClient'

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
  })

  const getErrorMessage = (err, fallback) => {
    if (typeof err.response?.data === 'string') return err.response.data
    return err.response?.data?.message || fallback
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleRequestCode = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiClient.post('http://localhost:7111/api/auth/forgot-password', {
        Email: formData.email,
      })
      toast.success('Mã xác nhận đã được gửi đến email của bạn.')
      setStep('reset')
    } catch (err) {
      const msg = getErrorMessage(err, 'Không thể gửi mã xác nhận. Vui lòng thử lại.')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setError('')

    if (formData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.')
      return
    }

    setLoading(true)
    try {
      await apiClient.post('http://localhost:7111/api/auth/reset-password', {
        Email: formData.email,
        Code: formData.code,
        NewPassword: formData.newPassword,
      })
      toast.success('Đổi mật khẩu thành công. Hãy đăng nhập lại.')
      onSwitchToLogin()
    } catch (err) {
      const msg = getErrorMessage(err, 'Không thể đổi mật khẩu. Vui lòng kiểm tra mã xác nhận.')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const goBackToEmail = () => {
    setError('')
    setStep('email')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0f1115]/95">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {step === 'email'
              ? 'Nhập email để nhận mã xác nhận.'
              : 'Nhập mã xác nhận và mật khẩu mới.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-bold text-red-500">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nhon@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none ring-blue-500/20 transition focus:ring-4 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'ĐANG GỬI...' : 'GỬI MÃ XÁC NHẬN'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">Mã xác nhận</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Nhập mã trong email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none ring-blue-500/20 transition focus:ring-4 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  required
                  minLength="8"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-12 text-slate-900 outline-none ring-blue-500/20 transition focus:ring-4 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'ĐANG ĐỔI...' : 'ĐỔI MẬT KHẨU'}
            </button>

            <button
              type="button"
              onClick={goBackToEmail}
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Đổi email nhận mã
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Đã nhớ mật khẩu?{' '}
          <button onClick={onSwitchToLogin} className="font-bold text-blue-600 hover:underline dark:text-blue-400">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
