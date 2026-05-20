import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  if (!error.response) {
    return 'Cannot reach server. Start backend on port 3001 and try again.';
  }

  return fallbackMessage;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          set({ user, token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true };
        } catch (error) {
          return { success: false, error: getApiErrorMessage(error, 'Login failed') };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, name, phone) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', { email, password, name, phone });
          const { token, user } = response.data;
          set({ user, token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true };
        } catch (error) {
          return { success: false, error: getApiErrorMessage(error, 'Registration failed') };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
      },

      updateProfileName: (name) => {
        const { user } = get();
        if (!user) return;
        set({
          user: {
            ...user,
            name: name?.trim() || user.name,
          },
        });
      },

      restoreToken: async () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

export default useAuthStore;

