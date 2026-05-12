import apiClient from './apiClient';

export const updateUserProgress = async (nodeId, status) => {
    const response = await apiClient.post('/users/progress', { nodeId, status });
    return response.data;
};
