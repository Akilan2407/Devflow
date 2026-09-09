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
export type GithubWorkflow = { id: number; name: string; path: string; state: string; html_url: string; badge_url: string };
export type GithubWorkflowRun = { id: number; name: string | null; workflow_id: number; event: string; status: 'queued' | 'in_progress' | 'completed' | string; conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | string | null; head_branch: string | null; head_sha: string; head_commit: { message: string; author: { name: string; email: string } | null } | null; actor: { login: string; avatar_url: string } | null; html_url: string; created_at: string; updated_at: string; run_started_at: string | null; completed_at: string | null };