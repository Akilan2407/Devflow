import type { ReactElement } from 'react';
import type { GithubCommit } from '../types/github';
import { GitCommit, ExternalLink } from 'lucide-react';

export const CommitList = ({ commits }: { commits: GithubCommit[] }): ReactElement => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
        <GitCommit className="w-4 h-4 text-brand-400" />
        Recent Commits
      </h3>
      <span className="badge-surface">{commits.length} commits</span>
    </div>
    <div className="divide-y divide-surface-800/60 rounded-2xl border border-surface-800/80 bg-surface-900/60 overflow-hidden">
      {commits.length ? (
        commits.map((commit) => (
          <a
            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-800/50"
            href={commit.html_url}
            target="_blank"
            rel="noreferrer"
            key={commit.sha}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white text-sm truncate">{commit.commit.message.split('\n')[0]}</p>
              <p className="mt-1 text-xs text-surface-400">
                {commit.author?.login ?? commit.commit.author?.name ?? 'Unknown author'} ·{' '}
                {new Date(commit.commit.author?.date ?? Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface-800 text-brand-300 border border-surface-700">
                {commit.sha.slice(0, 7)}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-surface-500" />
            </div>
          </a>
        ))
      ) : (
        <p className="p-6 text-sm text-surface-400 text-center">No recent commits found.</p>
      )}
    </div>
  </section>
);