// src/store/auth.store.ts
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { authAPI } from '../api/auth.api';
import { User } from '../types/auth.types';

interface AuthStore extends UserAuthActions {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UserAuthActions {
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  register: async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) throw new Error('Passwords do not match');

    set({ isLoading: true });
    try {
      const data = await authAPI.register(
        name.trim(),
        email.trim().toLowerCase(),
        password,
      );

      await authAPI.saveToken(data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw (
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authAPI.login(email.trim().toLowerCase(), password);

      await authAPI.saveToken(data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  logout: async () => {
    await authAPI.removeToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken'); // import * as SecureStore from 'expo-secure-store';
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const data = await authAPI.getCurrentUser();
      set({
        user: data.user || data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      await authAPI.removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
