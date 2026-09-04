import { create } from 'zustand';
import { apiClient } from '../lib/api';
import type { User } from '../types/auth';

type Credentials = { email: string; password: string };
type Registration = Credentials & { name: string };

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  register: (input: Registration) => Promise<void>;
  login: (input: Credentials) => Promise<void>;
  restore: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const extractError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { error?: { message?: string } } } }).response;
    return response?.data?.error?.message ?? 'Request failed';
  }
  return 'Request failed';
};

const authData = (response: { data: { data: { user: User; accessToken: string } } }) =>
  response.data.data;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  register: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const result = authData(await apiClient.post('/auth/register', input));
      set({ ...result, isLoading: false });
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },
  login: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const result = authData(await apiClient.post('/auth/login', input));
      set({ ...result, isLoading: false });
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },
  restore: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = authData(await apiClient.post('/auth/refresh'));
      set({ ...result, isLoading: false });
    } catch {
      set({ user: null, accessToken: null, isLoading: false });
    }
  },
  logout: async () => {
    await apiClient.post('/auth/logout').catch(() => undefined);
    set({ user: null, accessToken: null, error: null });
  },
  clearError: () => set({ error: null }),
}));
