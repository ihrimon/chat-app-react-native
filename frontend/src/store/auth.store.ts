import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authAPI } from '../api/auth.api';
import { User } from '../types/auth.types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;

  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setHasSeenOnboarding: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      hasSeenOnboarding: false,

      register: async ({ name, email, password, confirmPassword }) => {
        if (password !== confirmPassword)
          throw new Error('Passwords do not match');

        set({ isLoading: true });

        try {
          const result = await authAPI.register(name, email, password); 

          await authAPI.saveToken(result.token);

          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('✅ Registration successful and state updated');
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Registration failed:', error);
          throw (
            error.response?.data?.message ||
            error.message ||
            'Registration failed'
          );
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const result = await authAPI.login(email, password);

          await authAPI.saveToken(result.token);

          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('✅ Login successful');
        } catch (error: any) {
          set({ isLoading: false });
          throw (
            error.response?.data?.message || error.message || 'Login failed'
          );
        }
      },

      logout: async () => {
        await authAPI.removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },

      loadUser: async () => {
        set({ isLoading: true });

        try {
          const token = await SecureStore.getItemAsync('accessToken');
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
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
          console.error('LoadUser Error:', error);
          await authAPI.removeToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setHasSeenOnboarding: (value: boolean) => {
        set({ hasSeenOnboarding: value });
      },
    }),
    {
      name: 'talkify-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    },
  ),
);
