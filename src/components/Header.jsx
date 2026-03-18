import React, { useContext, useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const menuItems = ['Unity', 'Unreal']

const Header = ({ onOpenLogin, onOpenRegister }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpenMenu(null)
  }

  const navLabelClass = (pathname) => {
    const isActive = location.pathname === pathname
    return isActive
      ? 'text-slate-800 font-semibold'
      : 'text-slate-500 hover:text-slate-800'
  }

  return (
    <header className="border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8">
      <div className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs text-white shadow-sm">
              G
            </span>
            <span>Gamedev</span>
          </Link>

          <nav ref={navRef} className="hidden items-center gap-5 text-sm md:flex">
            <Link to="/roadmap/builder" className={navLabelClass('/roadmap/builder')}>
              Create Roadmap
            </Link>
            {['Roadmaps', 'Jobs'].map((menuName) => (
              <div key={menuName} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu((current) => (current === menuName ? null : menuName))}
                  className={`flex items-center gap-1 ${navLabelClass(menuName === 'Jobs' ? '/jobs' : '/')}`}
                >
                  <span>{menuName}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition ${openMenu === menuName ? 'rotate-180' : ''}`} />
                </button>

                {openMenu === menuName && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {menuItems.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setOpenMenu(null)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:block"
              >
                <Bell className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                Log-out
              </button>
              <Link
                to="/profile"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-amber-100 text-xs font-bold text-slate-700"
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Log-in
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
                className="rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
              >
                Sign-up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header