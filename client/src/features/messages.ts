import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { Message, MessagePage } from '../types/message';

export type MessageInput = { content: string; attachments?: { name: string; url: string; type: string; size: number }[] };
export const messageKeys = { all: ['messages'] as const, list: (projectId: string) => ['messages', projectId] as const };
export const useMessages = (projectId: string | undefined) => useInfiniteQuery({
  queryKey: messageKeys.list(projectId ?? ''),
  queryFn: async ({ pageParam }) => (await apiClient.get<{ data: MessagePage }>(`/projects/${projectId}/messages`, { params: { limit: 30, before: pageParam ?? undefined } })).data.data,
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.items.at(-1)?.createdAt ?? undefined : undefined,
  enabled: Boolean(projectId),
});
export const useSendMessage = (projectId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async (input: MessageInput) => (await apiClient.post<{ data: Message }>(`/projects/${projectId}/messages`, input)).data.data, onSuccess: () => client.invalidateQueries({ queryKey: messageKeys.list(projectId) }) }); };
export const useUpdateMessage = (projectId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async ({ id, content }: { id: string; content: string }) => (await apiClient.patch<{ data: Message }>(`/projects/${projectId}/messages/${id}`, { content })).data.data, onSuccess: () => client.invalidateQueries({ queryKey: messageKeys.list(projectId) }) }); };
export const useDeleteMessage = (projectId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async (id: string) => apiClient.delete(`/projects/${projectId}/messages/${id}`), onSuccess: () => client.invalidateQueries({ queryKey: messageKeys.list(projectId) }) }); };
export const markMessageRead = async (projectId: string, messageId: string): Promise<void> => { await apiClient.post(`/projects/${projectId}/messages/${messageId}/read`); };
