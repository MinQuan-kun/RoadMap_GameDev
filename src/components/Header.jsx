import React, { useContext, useEffect, useRef, useState } from 'react'
import { Sun, Moon, Bell, ChevronDown, Search, Grid } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
const menuItems = ['Unity', 'Unreal']

const Header = ({ isDarkMode, toggleDarkMode, onOpenLogin, onOpenRegister }) => {
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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpenMenu(null)
  }

  const navLabelClass = (pathname) => {
    const isActive = location.pathname === pathname
    return isActive
      ? 'text-slate-900 dark:text-white font-semibold'
      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="flex h-20 items-center justify-between gap-4">

        {/*Logo & Navigation */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-lg shadow-blue-500/10 overflow-hidden group">
              <img
                src="/Img/logo.png"
                alt="GameNode Logo"
                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-slate-900 dark:text-white">Game<span className="text-gradient">Node</span></span>
          </Link>

          <nav ref={navRef} className="hidden items-center gap-6 text-[15px] md:flex">
            {['Lộ trình của tôi', 'Roadmap', 'Khóa học', 'Công việc', ...(user?.role === 0 ? ['Admin'] : [])]
              .filter(menuName => menuName !== 'Lộ trình của tôi' || isAuthenticated)
              .map((menuName) => {
                const isMyRoadMap = menuName === 'Lộ trình của tôi';
                const isAdmin = menuName === 'Admin';
                const isCourse = menuName === 'Khóa học';
                const isJobs = menuName === 'Công việc';
                const path = isMyRoadMap ? '/profile' : isAdmin ? '/admin' : isCourse ? '/courses' : isJobs ? '/Jobs' : '/';

                return (
                  <div key={menuName} className="relative">
                    {isMyRoadMap || isAdmin || isCourse || isJobs ? (
                      <Link
                        to={path}
                        state={isMyRoadMap ? { activeTab: 'MyRoadMap' } : undefined}
                        className={`flex items-center gap-1 transition-colors font-bold ${navLabelClass(path)}`}
                      >
                        <span>{menuName}</span>
                      </Link>
                    ) : (
                      /* Nút Roadmaps: Hiện dropdown */
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenMenu((current) => (current === menuName ? null : menuName))}
                          className={`flex items-center gap-1 transition-colors font-bold ${navLabelClass(path)}`}
                        >
                          <span>{menuName}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === menuName ? 'rotate-180' : ''}`} />
                        </button>

                        {openMenu === menuName && (
                          <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] p-2 shadow-xl ring-1 ring-black/5">
                            {menuItems.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null);
                                  const roadmapId = item === 'Unity'
                                    ? '6a07f4efab3cc513a2cac340'
                                    : '6a07f4efab3cc513a2cac340';
                                  navigate(`/roadmap/${roadmapId}`);
                                }}
                                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
          </nav>
        </div>

        {/* Right Section: Tools & Auth */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.userName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  Đăng ký ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header