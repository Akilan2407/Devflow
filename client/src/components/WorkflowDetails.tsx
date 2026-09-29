import type { ReactElement } from 'react';
import type { GithubWorkflowRun } from '../types/github';
import { ExternalLink, GitCommit, GitBranch, User, Clock, CheckCircle2, XCircle } from 'lucide-react';

const formatTime = (value: string | null): string =>
  value ? new Date(value).toLocaleString() : 'Not completed';

const duration = (run: GithubWorkflowRun): string => {
  const start = run.run_started_at ?? run.created_at;
  const end = run.completed_at ?? (run.status === 'completed' ? run.updated_at : null);
  if (!end) return 'Running';
  const seconds = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000));
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

export const WorkflowDetails = ({ run }: { run: GithubWorkflowRun | undefined }): ReactElement => (
  <section className="glass-card rounded-2xl p-6">
    {run ? (
      <>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-surface-400">
                Run #{run.id} · {run.event}
              </p>
            </div>
            <h3 className="mt-1 text-xl font-bold text-white tracking-tight">{run.name ?? 'Unnamed workflow'}</h3>
          </div>
          <a
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors py-1.5 px-3 rounded-lg bg-brand-500/10 border border-brand-500/20"
            href={run.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</dt>
            <dd className="mt-1 font-semibold text-white">
              {run.status === 'in_progress' ? 'IN PROGRESS' : run.status.toUpperCase()}
            </dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Conclusion</dt>
            <dd className="mt-1 font-semibold text-white">
              {run.conclusion?.toUpperCase() ?? 'PENDING'}
            </dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" /> Branch
            </dt>
            <dd className="mt-1 font-mono text-xs font-semibold text-surface-200">{run.head_branch ?? 'Detached HEAD'}</dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" /> Commit SHA
            </dt>
            <dd className="mt-1 font-mono text-xs font-semibold text-brand-300">{run.head_sha.slice(0, 12)}</dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Triggered By
            </dt>
            <dd className="mt-1 font-semibold text-surface-200">{run.actor?.login ?? run.head_commit?.author?.name ?? 'Unknown'}</dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Duration
            </dt>
            <dd className="mt-1 font-mono font-semibold text-surface-200">{duration(run)}</dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Started</dt>
            <dd className="mt-1 text-xs text-surface-300">{formatTime(run.run_started_at ?? run.created_at)}</dd>
          </div>
          <div className="rounded-xl border border-surface-800/80 bg-surface-900/60 p-3.5">
            <dt className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Completed</dt>
            <dd className="mt-1 text-xs text-surface-300">{formatTime(run.completed_at)}</dd>
          </div>
        </dl>
      </>
    ) : (
      <p className="text-sm text-surface-400 text-center py-8">Select a workflow run to view its details.</p>
    )}
  </section>
);