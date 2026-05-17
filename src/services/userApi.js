import apiClient from './apiClient';

export const updateUserProgress = async (nodeId, status) => {
    const response = await apiClient.post('/users/progress', { nodeId, status });
    return response.data;
};
export const completeTask = async (taskId) => {
    const response = await apiClient.post(`/lesson/task/complete/${taskId}`);
    return response.data;
};

export const followPathway = async (pathwayId) => {
    const response = await apiClient.post(`/users/follow/${pathwayId}`);
    return response.data;
};

export const unfollowPathway = async (pathwayId) => {
    const response = await apiClient.post(`/users/unfollow/${pathwayId}`);
    return response.data;
};

export const getFollowedPathways = async () => {
    const response = await apiClient.get('/pathways/followed');
    return response.data;
};
