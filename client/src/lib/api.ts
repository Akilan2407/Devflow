import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshRequest: Promise<string | null> | null = null;

apiClient.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config as typeof error.config & { _retry?: boolean };
  if (
    error.response?.status !== 401 ||
    originalRequest?._retry ||
    originalRequest?.url?.includes('/auth/')
  ) {
    return Promise.reject(error);
  }
  originalRequest._retry = true;
  refreshRequest ??= axios
    .post<{ data: { accessToken: string; user: import('../types/auth').User } }>(
      `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}/auth/refresh`,
      undefined,
      { withCredentials: true },
    )
    .then((response) => {
      const { accessToken, user } = response.data.data;
      useAuthStore.setState({ accessToken, user });
      return accessToken;
    })
    .catch(() => {
      useAuthStore.setState({ accessToken: null, user: null });
      return null;
    })
    .finally(() => {
      refreshRequest = null;
    });
  const token = await refreshRequest;
  if (!token) return Promise.reject(error);
  originalRequest.headers.Authorization = `Bearer ${token}`;
  return apiClient(originalRequest);
});
