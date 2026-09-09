import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

type GithubRepository = { id: number; name: string; full_name: string; html_url: string; owner: { login: string } };
type GithubBranch = { name: string; commit: { sha: string; url: string } };
type GithubCommit = { sha: string; html_url: string; commit: { message: string; author: { name: string; date: string } | null }; author: { login: string; avatar_url: string } | null };
type GithubPullRequest = { id: number; number: number; title: string; body: string | null; state: string; html_url: string; user: { login: string; avatar_url: string } | null; created_at: string; updated_at: string };
type GithubIssue = { id: number; number: number; title: string; body: string | null; state: string; html_url: string; user: { login: string; avatar_url: string } | null; created_at: string; updated_at: string };

const githubRequest = async <T>(path: string): Promise<T> => {
  if (!env.GITHUB_TOKEN) throw new AppError(503, 'GitHub integration is not configured');
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) {
    if (response.status === 404) throw new AppError(404, 'GitHub repository not found');
    throw new AppError(502, 'GitHub API request failed');
  }
  return response.json() as Promise<T>;
};

const repositoryPath = (owner: string, name: string) => `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;

export const githubService = {
  getRepository: (owner: string, name: string) => githubRequest<GithubRepository>(repositoryPath(owner, name)),
  getBranches: (owner: string, name: string) => githubRequest<GithubBranch[]>(`${repositoryPath(owner, name)}/branches?per_page=100`),
  getCommits: (owner: string, name: string) => githubRequest<GithubCommit[]>(`${repositoryPath(owner, name)}/commits?per_page=30`),
  getPullRequests: (owner: string, name: string) => githubRequest<GithubPullRequest[]>(`${repositoryPath(owner, name)}/pulls?state=all&sort=updated&direction=desc&per_page=30`),
  getIssues: async (owner: string, name: string) => (await githubRequest<GithubIssue[]>(`${repositoryPath(owner, name)}/issues?state=all&sort=updated&direction=desc&per_page=30`)).filter((issue) => !('pull_request' in issue)),
};