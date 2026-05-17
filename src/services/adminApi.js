import apiClient from './apiClient'

// ═══ Users API (Admin) ═══════════════════════════
export const getUsers = async () => {
  const response = await apiClient.get('/admin/users')
  return response.data
}

export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile')
  return response.data
}

export const updateProfile = async (payload) => {
  const response = await apiClient.put('/users/profile', payload)
  return response.data
}

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put('/users/change-password', { oldPassword, newPassword })
  return response.data
}

export const deleteAccount = async () => {
  const response = await apiClient.delete('/users/profile')
  return response.data
}

export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/users/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  })
  return response.data
}

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}

export const updateUser = async (id, payload) => {
  const response = await apiClient.put(`/admin/users/${id}`, payload)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`)
  return response.data
}

export const resetUserPassword = async (id, newPassword) => {
  const response = await apiClient.post(`/admin/users/${id}/reset-password`, { newPassword })
  return response.data
}

export const approveRecruiter = async (userId) => {
  const response = await apiClient.post(`/admin/users/${userId}/approve-recruiter`)
  return response.data
}

export const rejectRecruiter = async (userId) => {
  const response = await apiClient.post(`/admin/users/${userId}/reject-recruiter`)
  return response.data
}

// ═══ Nodes API (Legacy Support) ═══════════════════════════
export const getAllNodes = async () => {
  const response = await apiClient.get('/admin/nodes')
  return response.data
}

export const createNode = async (payload) => {
  const response = await apiClient.post('/admin/nodes', payload)
  return response.data
}

export const updateNode = async (id, payload) => {
  const response = await apiClient.put(`/admin/nodes/${id}`, payload)
  return response.data
}

export const deleteNode = async (id) => {
  const response = await apiClient.delete(`/admin/nodes/${id}`)
  return response.data
}

// ═══ Pathways API (Admin) ════════════════════════════════
export const getAllPathways = async () => {
  const response = await apiClient.get('/Admin/pathways')
  return response.data
}

export const createPathway = (data) => apiClient.post('/admin/pathways', data)
export const createFullPathway = (data) => apiClient.post('/admin/pathways/full', data, { timeout: 60000 })
export const getFullPathway = async (id) => {
  const response = await apiClient.get(`/admin/pathways/full/${id}`)
  return response.data
}
export const updateFullPathway = async (id, data) => {
  const response = await apiClient.put(`/admin/pathways/full/${id}`, data, { timeout: 60000 })
  return response.data
}

export const getPathwayById = async (id) => {
  const response = await apiClient.get(`/Admin/pathways/${id}`)
  return response.data
}

export const updatePathway = async (id, payload) => {
  const response = await apiClient.put(`/Admin/pathways/${id}`, payload)
  return response.data
}

export const deletePathway = async (id) => {
  const response = await apiClient.delete(`/Admin/pathways/${id}`)
  return response.data
}

// ═══ Courses API (Admin) ════════════════════════════════
export const getAllCourses = async () => {
  const response = await apiClient.get('/Admin/courses')
  return response.data
}

export const getCourseById = async (id) => {
  const response = await apiClient.get(`/Admin/courses/${id}`)
  return response.data
}

export const createCourse = async (payload) => {
  const response = await apiClient.post('/Admin/courses', payload)
  return response.data
}

export const updateCourse = async (id, payload) => {
  const response = await apiClient.put(`/Admin/courses/${id}`, payload)
  return response.data
}

export const deleteCourse = async (id) => {
  const response = await apiClient.delete(`/Admin/courses/${id}`)
  return response.data
}

// ═══ Modules API (Admin) ═══════════════════════════
export const getModuleById = async (id) => {
  const response = await apiClient.get(`/Admin/modules/${id}`)
  return response.data
}

export const createModule = async (payload) => {
  const response = await apiClient.post('/Admin/modules', payload)
  return response.data
}

export const updateModule = async (id, payload) => {
  const response = await apiClient.put(`/Admin/modules/${id}`, payload)
  return response.data
}

export const deleteModule = async (id) => {
  const response = await apiClient.delete(`/Admin/modules/${id}`)
  return response.data
}

// ═══ Lessons API (Admin) ═══════════════════════════
export const getLessonById = async (id) => {
  const response = await apiClient.get(`/Admin/lessons/${id}`)
  return response.data
}

export const createLesson = async (payload) => {
  const response = await apiClient.post('/Admin/lessons', payload)
  return response.data
}

export const updateLesson = async (id, payload) => {
  const response = await apiClient.put(`/Admin/lessons/${id}`, payload)
  return response.data
}

export const deleteLesson = async (id) => {
  const response = await apiClient.delete(`/Admin/lessons/${id}`)
  return response.data
}

// ═══ Tasks API (Admin) ═══════════════════════════
export const createLearningTask = async (payload) => {
  const response = await apiClient.post('/Admin/tasks', payload)
  return response.data
}

export const updateLearningTask = async (id, payload) => {
  const response = await apiClient.put(`/Admin/tasks/${id}`, payload)
  return response.data
}

export const deleteLearningTask = async (id) => {
  const response = await apiClient.delete(`/Admin/tasks/${id}`)
  return response.data
}

export const getTask = async (id) => {
  const response = await apiClient.get(`/admin/tasks/${id}`)
  return response.data
}

export const updateTask = async (id, payload) => {
  const response = await apiClient.put(`/admin/tasks/${id}`, payload)
  return response.data
}

// ─── Quiz Management ────────────────────────────────

export const getQuizzes = async () => {
  const response = await apiClient.get('/admin/quizzes')
  return response.data
}

export const getQuiz = async (id) => {
  const response = await apiClient.get(`/admin/quizzes/${id}`)
  return response.data
}

export const createQuiz = async (payload) => {
  const response = await apiClient.post('/admin/quizzes', payload)
  return response.data
}

export const updateQuiz = async (id, payload) => {
  const response = await apiClient.put(`/admin/quizzes/${id}`, payload)
  return response.data
}

export const deleteQuiz = async (id) => {
  const response = await apiClient.delete(`/admin/quizzes/${id}`)
  return response.data
}

// ─── Question Management ────────────────────────────

export const getQuestions = async () => {
  const response = await apiClient.get('/admin/questions')
  return response.data
}

export const getQuestion = async (id) => {
  const response = await apiClient.get(`/admin/questions/${id}`)
  return response.data
}

export const createQuestion = async (payload) => {
  const response = await apiClient.post('/admin/questions', payload)
  return response.data
}

export const updateQuestion = async (id, payload) => {
  const response = await apiClient.put(`/admin/questions/${id}`, payload)
  return response.data
}

export const deleteQuestion = async (id) => {
  const response = await apiClient.delete(`/admin/questions/${id}`)
  return response.data
}

// ─── Site Management ────────────────────────────────
const SITE_SETTINGS_KEY = 'gamenode-site-settings'

const defaultSettings = {
  bannerTitle: 'Welcome to GameNode',
  bannerTitleAuth: 'Welcome back, {name}',
  bannerDescription:
    'Khám phá các lộ trình học tập miễn phí và đưa kỹ năng phát triển game của bạn lên một tầm cao mới.',
  bannerDescriptionAuth:
    'Tiếp tục hành trình chinh phục các kỹ năng mới và khám phá những cơ hội nghề nghiệp phù hợp với lộ trình của bạn.',
  bannerLightImage: '/Img/ligh_bg.png',
  bannerDarkImage: '/Img/dark_bg.png',
  footerDescription:
    'Nền tảng học tập và định hướng nghề nghiệp cho Game Developer.',
  footerCopyright: '© 2026 GameNode Inc.',
  footerNote: '(Đây là đồ án cho môn học thực hành nghề nghiệp 2026)',
}

export const getSiteSettings = () => {
  try {
    const saved = localStorage.getItem(SITE_SETTINGS_KEY)
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.warn('Failed to load site settings:', e)
  }
  return { ...defaultSettings }
}

export const updateSiteSettings = (settings) => {
  const merged = { ...getSiteSettings(), ...settings }
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(merged))
  return merged
}

// ═══ Upload API ════════════════════════════════
export const uploadFile = async (file, subFolder = 'general') => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post(`/admin/upload?subFolder=${subFolder}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// ═══ Dashboard Stats ═════════════════════════════
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats')
    return response.data
  } catch {
    return { totalUsers: 0, totalPathways: 0, totalCourses: 0 }
  }
}

// ═══ Applications API ═════════════════════════════
export const getMyApplications = async () => {
  const response = await apiClient.get('/Jobs/my-applications')
  return response.data
}
