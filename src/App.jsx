import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginModal from './components/LoginModal'
import Header from './components/Header';
import RegisterModal from './components/RegisterModal'
import AuthContext from './context/AuthContext'
import HomePage from './pages/HomePage'
import JobSearch from './pages/JobSearch'
import UserProfile from './pages/UserProfile'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gamedev-user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('gamedev-user')))
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const openLoginModal = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const openRegisterModal = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const closeAuthModals = () => {
    setShowLoginModal(false)
    setShowRegisterModal(false)
  }

  const authValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    login: (userData) => {
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('gamedev-user', JSON.stringify(userData))
    },
    logout: () => {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('gamedev-user')
    }
  }

  return (  
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onOpenLogin={openLoginModal}     
            onOpenRegister={openRegisterModal}
          />

          <div className="App">
            <Routes>
              <Route
                path="/"
                element={<HomePage onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
              />
              <Route
                path="/profile"
                element={<UserProfile onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
              />
              <Route
                path="/jobs"
                element={<JobSearch onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
              />
            </Routes>

            <LoginModal
              isOpen={showLoginModal}
              onClose={closeAuthModals}
              onSwitchToRegister={openRegisterModal}
            />
            <RegisterModal
              isOpen={showRegisterModal}
              onClose={closeAuthModals}
              onSwitchToLogin={openLoginModal}
            />
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App