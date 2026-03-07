import React, { useContext, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    const mockUser = {
      id: '1',
      username: formData.email.split('@')[0] || 'user',
      email: formData.email,
      fullName: 'John Doe'
    }

    login(mockUser)
    onClose()
  }

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative w-full max-w-md rounded-[22px] bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-4 text-xl text-slate-400 transition hover:text-slate-600"
        >
          ✕
        </button>

        <div className="mb-6 text-center">
          <p className="mb-2 text-lg font-semibold text-slate-500">Login</p>
          <h2 className="text-[2rem] font-bold tracking-tight text-blue-600">Đăng nhập hệ thống</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-400 px-4 py-3 text-base outline-none transition focus:border-blue-500"
            placeholder="Email*"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-400 px-4 py-3 pr-12 text-base outline-none transition focus:border-blue-500"
              placeholder="Mật khẩu*"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 transition hover:text-blue-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-blue-700"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          <span>Chưa có tài khoản? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal