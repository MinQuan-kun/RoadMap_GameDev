import apiClient from './apiClient';

export const updateUserProgress = async (nodeId, status) => {
    const response = await apiClient.post('/users/progress', { nodeId, status });
    return response.data;
};
export const completeTask = async (taskId) => {
    const response = await apiClient.post(`/lesson/task/complete/${taskId}`);
    return response.data;
};
