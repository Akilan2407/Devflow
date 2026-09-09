import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { GithubBranch, GithubCommit, GithubIssue, GithubPullRequest, GithubWorkflow, GithubWorkflowRun, Repository } from '../types/github';

export const repositoryKeys = { detail: (projectId: string) => ['repositories', projectId] as const, branches: (projectId: string) => ['repositories', projectId, 'branches'] as const, commits: (projectId: string) => ['repositories', projectId, 'commits'] as const, pullRequests: (projectId: string) => ['repositories', projectId, 'pull-requests'] as const, issues: (projectId: string) => ['repositories', projectId, 'issues'] as const };
export const ciKeys = { workflows: (projectId: string) => ['ci', projectId, 'workflows'] as const, runs: (projectId: string) => ['ci', projectId, 'runs'] as const, run: (projectId: string, runId: number) => ['ci', projectId, 'runs', runId] as const };

export const useRepository = (projectId: string) => useQuery({
  queryKey: repositoryKeys.detail(projectId),
  queryFn: async () => (await apiClient.get<{ data: Repository }>(`/projects/${projectId}/repository`)).data.data,
  enabled: Boolean(projectId),
  retry: false,
});

export const useConnectRepository = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { owner: string; name: string }) => (await apiClient.post<{ data: Repository }>(`/projects/${projectId}/repository`, input)).data.data,
    onSuccess: (repository) => queryClient.setQueryData(repositoryKeys.detail(projectId), repository),
  });
};

export const useDisconnectRepository = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.delete(`/projects/${projectId}/repository`),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: repositoryKeys.detail(projectId) });
      queryClient.removeQueries({ queryKey: ['repositories', projectId] });
    },
  });
};

const useRepositoryData = <T,>(projectId: string, resource: string, key: readonly string[], enabled: boolean) => useQuery({
  queryKey: key,
  queryFn: async () => (await apiClient.get<{ data: T[] }>(`/projects/${projectId}/repository/${resource}`)).data.data,
  enabled: Boolean(projectId) && enabled,
});

export const useBranches = (projectId: string, enabled: boolean) => useRepositoryData<GithubBranch>(projectId, 'branches', repositoryKeys.branches(projectId), enabled);
export const useCommits = (projectId: string, enabled: boolean) => useRepositoryData<GithubCommit>(projectId, 'commits', repositoryKeys.commits(projectId), enabled);
export const usePullRequests = (projectId: string, enabled: boolean) => useRepositoryData<GithubPullRequest>(projectId, 'pull-requests', repositoryKeys.pullRequests(projectId), enabled);
export const useGithubIssues = (projectId: string, enabled: boolean) => useRepositoryData<GithubIssue>(projectId, 'issues', repositoryKeys.issues(projectId), enabled);

export const useCIWorkflows = (projectId: string, enabled: boolean) => useQuery({
  queryKey: ciKeys.workflows(projectId),
  queryFn: async () => (await apiClient.get<{ data: GithubWorkflow[] }>(`/projects/${projectId}/ci/workflows`)).data.data,
  enabled: Boolean(projectId) && enabled,
});

export const useCIRuns = (projectId: string, enabled: boolean) => useQuery({
  queryKey: ciKeys.runs(projectId),
  queryFn: async () => (await apiClient.get<{ data: GithubWorkflowRun[] }>(`/projects/${projectId}/ci/runs`)).data.data,
  enabled: Boolean(projectId) && enabled,
});

export const useCIRun = (projectId: string, runId: number | null) => useQuery({
  queryKey: ciKeys.run(projectId, runId ?? 0),
  queryFn: async () => (await apiClient.get<{ data: GithubWorkflowRun }>(`/projects/${projectId}/ci/runs/${runId}`)).data.data,
  enabled: Boolean(projectId) && runId !== null,
});