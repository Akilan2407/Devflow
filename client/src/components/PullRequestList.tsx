import type { ReactElement } from 'react';
import type { GithubPullRequest } from '../types/github';
import { GitPullRequest, ExternalLink } from 'lucide-react';

export const PullRequestList = ({ pullRequests }: { pullRequests: GithubPullRequest[] }): ReactElement => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
        <GitPullRequest className="w-4 h-4 text-brand-400" />
        Pull Requests
      </h3>
      <span className="badge-surface">{pullRequests.length} total</span>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {pullRequests.length ? (
        pullRequests.map((pullRequest) => {
          const isOpen = pullRequest.state.toLowerCase() === 'open';
          return (
            <a
              className="glass-card group rounded-2xl p-4 transition-all hover:border-brand-500/50 block"
              href={pullRequest.html_url}
              target="_blank"
              rel="noreferrer"
              key={pullRequest.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-surface-400">#{pullRequest.number}</span>
                <span
                  className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
                    isOpen
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {pullRequest.state}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                {pullRequest.title}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-surface-400">
                <span>{pullRequest.user?.login ?? 'Unknown author'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-surface-500 group-hover:text-brand-400 transition-colors" />
              </div>
            </a>
          );
        })
      ) : (
        <p className="glass-card rounded-2xl p-6 text-sm text-surface-400 col-span-2 text-center">
          No pull requests found.
        </p>
      )}
    </div>
  </section>
);