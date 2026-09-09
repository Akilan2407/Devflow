export type Repository = {
  _id: string;
  projectId: string;
  githubRepositoryId: number;
  owner: string;
  name: string;
  url: string;
  connectedBy: string;
  createdAt: string;
};

export type GithubBranch = { name: string; commit: { sha: string; url: string } };
export type GithubCommit = { sha: string; html_url: string; commit: { message: string; author: { name: string; date: string } | null }; author: { login: string; avatar_url: string } | null };
export type GithubPullRequest = { id: number; number: number; title: string; body: string | null; state: string; html_url: string; user: { login: string; avatar_url: string } | null; created_at: string; updated_at: string };
export type GithubIssue = GithubPullRequest;