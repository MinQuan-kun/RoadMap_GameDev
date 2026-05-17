import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import LoginModal from './components/LoginModal'
import Header from './components/Header';
import RegisterModal from './components/RegisterModal'
import AuthContext from './context/AuthContext'
import HomePage from './pages/HomePage'
import JobSearch from './pages/JobSearch'
import UserProfile from './pages/UserProfile'
import Footer from './components/Footer';
import RoadmapBuilder from './pages/RoadmapBuilder'
import CareerQuiz from './pages/CareerQuiz'
import RoadmapDetail from './pages/RoadmapDetail'
import PathwayViewer from './pages/PathwayViewer'
import LessonPage from './pages/LessonPage'
import CourseListPage from './pages/CourseListPage'

import { getUserProfile } from './services/adminApi'
import { Toaster } from 'react-hot-toast'

// Admin imports
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import SiteAppearance from './pages/admin/SiteAppearance'
import RoadmapManager from './pages/admin/RoadmapManager'
import LessonManager from './pages/admin/LessonManager'
import UserManager from './pages/admin/UserManager'
import PathwayBuilder from './pages/admin/PathwayBuilder'
import QuizManager from './pages/admin/tabs/QuizManager'

// Recruiter imports
import RecruiterLayout from './components/recruiter/RecruiterLayout'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import RecruiterJobManager from './pages/recruiter/RecruiterJobManager'
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants'
import RecruiterRoadmapBuilder from './pages/recruiter/RecruiterRoadmapBuilder'
import RecruiterRoadmaps from './pages/recruiter/RecruiterRoadmaps'

// Page imports
import SurveyResultPage from './pages/SurveyResultPage'

// Wrapper to conditionally show Header/Footer (hide on /admin routes)
const AppContent = ({ isDarkMode, toggleDarkMode, openLoginModal, openRegisterModal, closeAuthModals, showLoginModal, showRegisterModal, user, isAuthenticated }) => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/recruiter')

  return (
    <div className={isAdminRoute ? '' : 'min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300'}>
      {!isAdminRoute && (
        <Header
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onOpenLogin={openLoginModal}
          onOpenRegister={openRegisterModal}
        />
      )}

      <div className={isAdminRoute ? '' : 'App'}>
        <Routes>
          {/* ─── Public routes ─── */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenLogin={openLoginModal}
                onOpenRegister={openRegisterModal}
                isDarkMode={isDarkMode}
                user={user}
                isAuthenticated={isAuthenticated}
              />}
          />
          <Route
            path="/roadmap/builder"
            element={<RoadmapBuilder onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
          />
          <Route
            path="/profile"
            element={<UserProfile onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
          />
          <Route
            path="/Jobs"
            element={<JobSearch isDarkMode={isDarkMode} onOpenLogin={openLoginModal} onOpenRegister={openRegisterModal} />}
          />
          <Route path="/survey" element={<CareerQuiz />} />
          <Route path="/quiz" element={<CareerQuiz />} />
          <Route path="/survey/result/:id" element={<SurveyResultPage />} />
          <Route path="/roadmap/:id" element={<RoadmapDetail />} />
          <Route path="/roadmap/:roadmapId/node/:nodeId" element={<PathwayViewer />} />
          <Route path="/roadmap/:roadmapId/learn" element={<PathwayViewer />} />
          <Route path="/courses" element={<CourseListPage isDarkMode={isDarkMode} />} />
          <Route path="/courses/:pathwayId" element={<CourseListPage isDarkMode={isDarkMode} />} />
          <Route path="/courses/:id" element={<LessonPage isDarkMode={isDarkMode} />} />
          <Route path="/learn/:id" element={<LessonPage isDarkMode={isDarkMode} />} />

          {/* ─── Admin routes ─── */}
          <Route path="/admin" element={<AdminLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appearance" element={<SiteAppearance />} />
            <Route path="roadmaps" element={<RoadmapManager />} />
            <Route path="pathways/create" element={<PathwayBuilder />} />
            <Route path="pathways/edit/:id" element={<PathwayBuilder />} />
            <Route path="users" element={<UserManager />} />
            <Route path="quiz-manager" element={<QuizManager />} />
          </Route>

          {/* ─── Recruiter routes ─── */}
          <Route path="/recruiter" element={<RecruiterLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route index element={<RecruiterDashboard />} />
            <Route path="jobs" element={<RecruiterJobManager />} />
            <Route path="jobs/:id/roadmap" element={<RecruiterRoadmapBuilder />} />
            <Route path="applicants" element={<RecruiterApplicants />} />
            <Route path="roadmaps" element={<RecruiterRoadmaps />} />
          </Route>
        </Routes>

        {!isAdminRoute && (
          <>
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
          </>
        )}
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('gamedev-token')))
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Fetch profile on mount if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('gamedev-token')
      if (token && token !== 'undefined') {
        try {
          const profile = await getUserProfile()
          setUser(profile)
          setIsAuthenticated(true)
        } catch (err) {
          console.error('Failed to fetch profile:', err)
          localStorage.removeItem('gamedev-token')
          setIsAuthenticated(false)
        }
      }
      setIsLoadingProfile(false)
    }
    fetchProfile()
  }, [])

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
    isLoadingProfile,
    login: async (token) => {
      localStorage.setItem('gamedev-token', token);
      setIsAuthenticated(true);
      setIsLoadingProfile(true);
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        console.error('Login profile fetch failed:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    },
    logout: () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('gamedev-token');
    }
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        {isLoadingProfile ? (
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d16' }}>
            <div className="admin-loader"></div>
          </div>
        ) : (
          <AppContent
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            closeAuthModals={closeAuthModals}
            showLoginModal={showLoginModal}
            showRegisterModal={showRegisterModal}
            user={authValue.user}
            isAuthenticated={authValue.isAuthenticated}
          />
        )}
      </Router>
    </AuthContext.Provider>
  )
}

export default App