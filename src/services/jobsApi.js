import apiClient from './apiClient'

export const getJobs = async (params = {}) => {
  const response = await apiClient.get('/Jobs', { params })
  return response.data
}

export const getJobById = async (jobId) => {
  const response = await apiClient.get(`/Jobs/${jobId}`)
  return response.data
}

export const getJobFilters = async () => {
  const response = await apiClient.get('/Jobs/filters')
  return response.data
}

export const getMatchingScore = async (jobId, userId) => {
  const response = await apiClient.get(`/Jobs/${jobId}/matching-score`, {
    params: userId ? { userId } : undefined,
  })
  return response.data
}

export const applyJob = async (jobId) => {
  const response = await apiClient.post(`/Jobs/${jobId}/apply`)
  return response.data
}
