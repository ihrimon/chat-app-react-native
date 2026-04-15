import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';
// For physical device: use your computer's local IP (e.g., http://192.168.1.100:5000/api)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Auto attach token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken'); // We'll import later
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
