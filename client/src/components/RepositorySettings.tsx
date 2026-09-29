import type { ReactElement } from 'react';
import { useState } from 'react';
import { useBranches, useCommits, useConnectRepository, useDisconnectRepository, useGithubIssues, usePullRequests, useRepository } from '../features/github';
import { CommitList } from './CommitList';
import { GitHubIssueList } from './GitHubIssueList';
import { PullRequestList } from './PullRequestList';
import { RepositoryOverview } from './RepositoryOverview';
import { GitBranch, GitFork, Link2, Unlink } from 'lucide-react';

export const RepositorySettings = ({ projectId }: { projectId: string }): ReactElement => {
  const repository = useRepository(projectId);
  const connect = useConnectRepository(projectId);
  const disconnect = useDisconnectRepository(projectId);
  const hasRepository = Boolean(repository.data);
  const branches = useBranches(projectId, hasRepository);
  const commits = useCommits(projectId, hasRepository);
  const pullRequests = usePullRequests(projectId, hasRepository);
  const issues = useGithubIssues(projectId, hasRepository);
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-400">VCS Integration</p>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">GitHub Repository Link</h2>
        </div>
      </div>

      {hasRepository && repository.data ? (
        <div className="space-y-6">
          <RepositoryOverview repository={repository.data} />
          
          <div className="flex justify-end">
            <button
              type="button"
              className="button-danger flex items-center gap-2"
              disabled={disconnect.isPending}
              onClick={() => void disconnect.mutateAsync()}
            >
              <Unlink className="w-4 h-4" />
              <span>{disconnect.isPending ? 'Disconnecting...' : 'Disconnect Repository'}</span>
            </button>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-400" /> Active Branches
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {(branches.data ?? []).map((branch) => (
                <span className="badge-surface font-mono text-xs flex items-center gap-1.5" key={branch.name}>
                  <GitBranch className="w-3 h-3 text-brand-400" />
                  {branch.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <CommitList commits={commits.data ?? []} />
            <PullRequestList pullRequests={pullRequests.data ?? []} />
            <GitHubIssueList issues={issues.data ?? []} />
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect GitHub Repository</h3>
              <p className="text-xs text-surface-400">Provide the repository owner and repository name to link CI/CD & VCS telemetry.</p>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void connect.mutateAsync({ owner, name });
            }}
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
                GitHub Owner / Organization
              </label>
              <input
                className="input w-full"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="e.g. facebook"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
                Repository Name
              </label>
              <input
                className="input w-full"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. react"
                required
              />
            </div>
            <button className="button w-full flex items-center justify-center gap-2" disabled={connect.isPending}>
              <Link2 className="w-4 h-4" />
              <span>{connect.isPending ? 'Connecting repository...' : 'Connect Repository'}</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};