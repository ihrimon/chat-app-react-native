import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error('❌ EXPO_PUBLIC_API_URL is not defined in .env.local');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request logging
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.log('Failed to get token from SecureStore');
  }
  return config;
});

// Response / Error logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:');
    if (error.response) {
      // Server responded with error status
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // Request made but no response received 
      console.error('No response received from server (Network / Timeout / CORS)');
      console.error('Request was made to:', error.config?.url);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
