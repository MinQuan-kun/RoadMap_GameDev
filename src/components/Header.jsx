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
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between gap-4">

        {/*Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white tracking-tighter">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg shadow-lg shadow-blue-500/20 overflow-hidden">
              <img
                src="/Img/logo.png"
                alt="GameNode Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <span>GameNode</span>
          </Link>

          <nav ref={navRef} className="hidden items-center gap-6 text-[15px] md:flex">
            <Link to="/roadmap/builder" className={navLabelClass('/roadmap/builder')}>
              Create Roadmap
            </Link>
            {['MyRoadMap','Roadmaps', 'Jobs'].map((menuName) => {
              const isJobs = menuName === 'Jobs';
              const isMyRoadMap = menuName === 'MyRoadMap';
              const path = isJobs ? '/Jobs' : isMyRoadMap ? '/profile' : '/';
               
              return (
                <div key={menuName} className="relative">
                  {isJobs || isMyRoadMap ? (
                    <Link
                      to={path}
                      className={`flex items-center gap-1 transition-colors ${navLabelClass(path)}`}
                    >
                      <span>{menuName}</span>
                    </Link>
                  ) : (
                    /* Nút Roadmaps: Hiện dropdown */
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenMenu((current) => (current === menuName ? null : menuName))}
                        className={`flex items-center gap-1 transition-colors ${navLabelClass(path)}`}
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
                                // Ví dụ: navigate(`/roadmaps/${item.toLowerCase()}`);
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

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Grid className="h-5 w-5" />
                </button>
                <Link
                  to="/profile"
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 dark:border-white/20 bg-amber-100 text-sm font-bold text-slate-700 hover:opacity-80 transition"
                >
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="rounded-full bg-slate-900 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-black transition hover:opacity-90"
                >
                  Log-in
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="hidden rounded-full border border-slate-200 dark:border-white/20 px-5 py-2 text-sm font-bold text-slate-900 dark:text-white transition hover:bg-slate-50 dark:hover:bg-white/5 sm:block"
                >
                  Sign-up
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