import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { Task, TaskListResponse, TaskPriority, TaskStatus, TaskType } from '../types/task';

export type TaskFilters = { status?: string; priority?: string; type?: string; assigneeId?: string; search?: string; sort?: string };
export type TaskInput = { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; type?: TaskType; assigneeId?: string | null; labels?: string[]; storyPoints?: number | null; dueDate?: string | null; position?: number };
export const taskKeys = { all: ['tasks'] as const, list: (projectId: string, filters: TaskFilters) => ['tasks', projectId, filters] as const, detail: (id: string) => ['task', id] as const };

export const useTasks = (projectId: string | undefined, filters: TaskFilters) => useQuery({
  queryKey: taskKeys.list(projectId ?? '', filters),
  queryFn: async () => (await apiClient.get<{ data: TaskListResponse }>(`/projects/${projectId}/tasks`, { params: filters })).data.data,
  enabled: Boolean(projectId),
});
export const useTask = (id: string | undefined) => useQuery({ queryKey: taskKeys.detail(id ?? ''), queryFn: async () => (await apiClient.get<{ data: Task }>(`/tasks/${id}`)).data.data, enabled: Boolean(id) });
export const useCreateTask = (projectId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async (input: TaskInput) => (await apiClient.post<{ data: Task }>(`/projects/${projectId}/tasks`, input)).data.data, onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }) }); };
export const useUpdateTask = (taskId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async (input: Partial<TaskInput>) => (await apiClient.patch<{ data: Task }>(`/tasks/${taskId}`, input)).data.data, onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }) }); };
export const useDeleteTask = (taskId: string) => { const client = useQueryClient(); return useMutation({ mutationFn: async () => apiClient.delete(`/tasks/${taskId}`), onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }) }); };