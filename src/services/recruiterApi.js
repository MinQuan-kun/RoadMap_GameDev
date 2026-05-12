import apiClient from './apiClient'


export const getMyJobPosts = async () => {
  const response = await apiClient.get('/jobs/my-posts')
  return response.data
}

export const createJob = async (payload) => {
  const response = await apiClient.post('/jobs', payload)
  return response.data
}

export const updateJob = async (jobId, payload) => {
  const response = await apiClient.put(`/jobs/${jobId}`, payload)
  return response.data
}

export const deleteJob = async (jobId) => {
  const response = await apiClient.delete(`/jobs/${jobId}`)
  return response.data
}

export const createJobRoadmap = async (jobId, payload) => {
  const response = await apiClient.post(`/jobs/${jobId}/roadmap`, payload)
  return response.data
}

export const getJobRoadmap = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}/roadmap`)
  return response.data
}


export const getJobApplicants = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}/applicants`)
  return response.data
}

export const updateApplicationStatus = async (jobId, applicationId, status) => {
  const response = await apiClient.put(
    `/jobs/${jobId}/applicants/${applicationId}/status`,
    { status }
  )
  return response.data
}


export const getRecruiterStats = async () => {
  try {
    const postsData = await getMyJobPosts()
    const jobs = postsData?.data ?? []
    const totalJobs = postsData?.total ?? 0
    const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)
    const activeJobs = jobs.length

    return { totalJobs, totalApplicants, activeJobs }
  } catch {
    return { totalJobs: 0, totalApplicants: 0, activeJobs: 0 }
  }
}
