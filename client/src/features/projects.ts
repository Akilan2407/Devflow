import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { Project, ProjectListResponse, ProjectStatus } from '../types/project';

type ProjectInput = { organizationId: string; name: string; key: string; description?: string; status?: ProjectStatus; startDate?: string | null; endDate?: string | null; members?: string[] };
type ProjectFilters = { organizationId?: string; search?: string; status?: string; sort?: string; page?: number };

export const projectKeys = { all: ['projects'] as const, list: (filters: ProjectFilters) => ['projects', 'list', filters] as const, detail: (id: string) => ['projects', id] as const };

export const useProjects = (filters: ProjectFilters) => useQuery({
  queryKey: projectKeys.list(filters),
  queryFn: async () => (await apiClient.get<{ data: ProjectListResponse }>('/projects', { params: filters })).data.data,
  enabled: Boolean(filters.organizationId),
});

export const useProject = (id: string | undefined) => useQuery({
  queryKey: projectKeys.detail(id ?? ''),
  queryFn: async () => (await apiClient.get<{ data: Project }>(`/projects/${id}`)).data.data,
  enabled: Boolean(id),
});

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectInput) => (await apiClient.post<{ data: Project }>('/projects', input)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
};

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<ProjectInput>) => (await apiClient.patch<{ data: Project }>(`/projects/${id}`, input)).data.data,
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(id), project);
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

export const useArchiveProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await apiClient.post<{ data: Project }>(`/projects/${id}/archive`)).data.data,
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(id), project);
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

export const useDeleteProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.delete(`/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
};

export const useProjectMemberMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, remove }: { userId: string; remove?: boolean }) => {
      const response = remove
        ? await apiClient.delete<{ data: Project }>(`/projects/${id}/members/${userId}`)
        : await apiClient.post<{ data: Project }>(`/projects/${id}/members`, { userId });
      return response.data.data;
    },
    onSuccess: (project) => queryClient.setQueryData(projectKeys.detail(id), project),
  });
};