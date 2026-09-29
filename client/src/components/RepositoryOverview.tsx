import type { ReactElement } from 'react';
import type { Repository } from '../types/github';
import { ExternalLink, GitBranch, GitFork } from 'lucide-react';

export const RepositoryOverview = ({ repository }: { repository: Repository }): ReactElement => (
  <section className="relative overflow-hidden rounded-2xl border border-surface-700/60 bg-gradient-to-br from-surface-900 via-surface-900/90 to-brand-950/40 p-6 shadow-xl">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-surface-800 border border-surface-700 text-brand-400 shrink-0">
          <GitFork className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Connected Repository</p>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white font-mono">
            {repository.owner}/{repository.name}
          </h2>
          <p className="mt-1 text-xs text-surface-400 font-mono">GitHub Repository ID: {repository.githubRepositoryId}</p>
        </div>
      </div>
      <a
        className="button-secondary flex items-center gap-2 text-xs"
        href={repository.url}
        target="_blank"
        rel="noreferrer"
      >
        <span>Open on GitHub</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </section>
);