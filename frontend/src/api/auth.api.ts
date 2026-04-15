import api from './axios';
import * as SecureStore from 'expo-secure-store';

export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data; // Expected: { token, user }
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Expected: { token, user }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  saveToken: async (token: string) => {
    await SecureStore.setItemAsync('accessToken', token);
  },

  removeToken: async () => {
    await SecureStore.deleteItemAsync('accessToken');
  },
};
