import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth.types';
import { authAPI } from '../api/auth.api';

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
      },

      login: async (email, password) => {
        const data = await authAPI.login(email.trim().toLowerCase(), password);
        await authAPI.saveToken(data.token);

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        });
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
