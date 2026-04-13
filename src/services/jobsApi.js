import apiClient from './apiClient'

export const getJobs = async (params = {}) => {
  const response = await apiClient.get('/jobs', { params })
  return response.data
}

export const getJobById = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}`)
  return response.data
}

export const getJobFilters = async () => {
  const response = await apiClient.get('/jobs/filters')
  return response.data
}

export const getMatchingScore = async (jobId, userId) => {
  const response = await apiClient.get(`/jobs/${jobId}/matching-score`, {
    params: userId ? { userId } : undefined,
  })
  return response.data
}

export const applyJob = async (jobId) => {
  const response = await apiClient.post(`/jobs/${jobId}/apply`)
  return response.data
}
