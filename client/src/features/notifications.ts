import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { NotificationPage } from '../types/notification';

export const notificationKeys = { all: ['notifications'] as const, list: (page: number) => ['notifications', page] as const };
export const useNotifications = (page = 1, limit = 20, enabled = true) => useQuery({ queryKey: notificationKeys.list(page), queryFn: async () => (await apiClient.get<{ data: NotificationPage }>('/notifications', { params: { page, limit } })).data.data, enabled });
export const useMarkNotificationRead = () => { const client = useQueryClient(); return useMutation({ mutationFn: async (id: string) => apiClient.post(`/notifications/${id}/read`), onSuccess: () => client.invalidateQueries({ queryKey: notificationKeys.all }) }); };
export const useMarkAllNotificationsRead = () => { const client = useQueryClient(); return useMutation({ mutationFn: async () => apiClient.post('/notifications/read-all'), onSuccess: () => client.invalidateQueries({ queryKey: notificationKeys.all }) }); };
export const useDeleteNotification = () => { const client = useQueryClient(); return useMutation({ mutationFn: async (id: string) => apiClient.delete(`/notifications/${id}`), onSuccess: () => client.invalidateQueries({ queryKey: notificationKeys.all }) }); };
