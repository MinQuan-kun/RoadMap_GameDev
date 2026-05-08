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

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put('/users/change-password', {
    oldPassword,
    newPassword,
  })
  return response.data
}

export const getMyApplications = async () => {
  const response = await apiClient.get('/users/my-applications')
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

export const approveRecruiter = async (id) => {
  const response = await apiClient.put(`/admin/recruiters/${id}/approve`)
  return response.data
}

export const rejectRecruiter = async (id) => {
  const response = await apiClient.put(`/admin/recruiters/${id}/reject`)
  return response.data
}

// ═══ Roadmaps API ════════════════════════════════
export const getAllRoadmaps = async () => {
  const response = await apiClient.get('/roadmaps')
  return response.data
}

export const getRoadmapById = async (id) => {
  const response = await apiClient.get(`/roadmaps/${id}`)
  return response.data
}

export const deleteRoadmap = async (id) => {
  const response = await apiClient.delete(`/admin/roadmaps/${id}`)
  return response.data
}

export const updateRoadmap = async (id, payload) => {
  const response = await apiClient.put(`/roadmaps/${id}`, payload)
  return response.data
}

// ═══ Nodes API (Admin) ═══════════════════════════
export const getAllNodes = async () => {
  const response = await apiClient.get('/admin/nodes')
  return response.data
}

export const getNodeById = async (id) => {
  const response = await apiClient.get(`/admin/nodes/${id}`)
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

// ═══ Site Settings ════════
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

// ═══ Dashboard Stats ═════════════════════════════
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats')
    return response.data
  } catch {
    // Fallback: try counting individually
    try {
      const [roadmapsRes] = await Promise.allSettled([
        apiClient.get('/roadmaps'),
      ])
      return {
        totalUsers: 0,
        totalRoadmaps:
          roadmapsRes.status === 'fulfilled'
            ? (roadmapsRes.value.data?.length ?? 0)
            : 0,
        totalNodes: 0,
      }
    } catch {
      return { totalUsers: 0, totalRoadmaps: 0, totalNodes: 0 }
    }
  }
}
