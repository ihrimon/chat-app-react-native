import api from './axios';

export const userAPI = {
  // Get all users (for new chat)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Search users
  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
};
