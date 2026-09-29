import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCIRun, useCIRuns, useCIWorkflows, useRepository } from '../features/github';
import type { GithubWorkflowRun } from '../types/github';
import { WorkflowDetails } from './WorkflowDetails';
import { WorkflowList } from './WorkflowList';
import { PlayCircle, CheckCircle2, XCircle, Clock, GitBranch } from 'lucide-react';

const latestFor = (runs: GithubWorkflowRun[], matcher: RegExp): GithubWorkflowRun | undefined =>
  runs.find((run) => matcher.test(run.name ?? ''));

const statusBadge = (run: GithubWorkflowRun | undefined) => {
  if (!run) return <span className="text-xs text-surface-400 font-mono">No matching workflow</span>;
  const isSuccess = run.conclusion === 'success';
  const isFailed = run.conclusion === 'failure';
  const isRunning = run.status === 'in_progress';

  return (
    <div className="flex items-center gap-2 mt-1">
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
      {isFailed && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      {isRunning && <Clock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
      <span
        className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
          isSuccess
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : isFailed
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : isRunning
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-surface-800 text-surface-300 border border-surface-700'
        }`}
      >
        {run.status === 'in_progress' ? 'IN PROGRESS' : run.status.toUpperCase()}
        {run.conclusion ? ` · ${run.conclusion.toUpperCase()}` : ''}
      </span>
    </div>
  );
};

export const CICDDashboard = ({ projectId }: { projectId: string }): ReactElement => {
  const repository = useRepository(projectId);
  const enabled = Boolean(repository.data);
  const workflows = useCIWorkflows(projectId, enabled);
  const runs = useCIRuns(projectId, enabled);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useCIRun(projectId, selectedId);
  const allRuns = runs.data ?? [];
  const completed = allRuns.filter((run) => run.status === 'completed' && run.conclusion);
  const successPercentage = completed.length
    ? Math.round((completed.filter((run) => run.conclusion === 'success').length / completed.length) * 100)
    : null;
  const build = latestFor(allRuns, /build|compile|ci/i);
  const test = latestFor(allRuns, /test|check|quality/i);
  const deployment = latestFor(allRuns, /deploy|release|publish/i);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-400">CI/CD Pipeline Telemetry</p>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">GitHub Actions Pipeline</h2>
        </div>
      </div>

      {!enabled ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <GitBranch className="w-10 h-10 text-surface-500 mx-auto mb-3" />
          <p className="text-surface-300 font-medium">Connect a GitHub repository to monitor CI/CD pipelines.</p>
          <p className="text-surface-500 text-xs mt-1">Configure your repository in the Repository tab to sync automated workflows.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ['Build pipeline', build],
              ['Test suite', test],
              ['Deployment pipeline', deployment],
            ].map(([label, run]) => (
              <div className="glass-card rounded-2xl p-4" key={label as string}>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label as string}</p>
                <div className="mt-2">{statusBadge(run as GithubWorkflowRun | undefined)}</div>
              </div>
            ))}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Success Rate</p>
              <p className="mt-2 text-2xl font-bold text-white tracking-tight font-mono">
                {successPercentage === null ? (
                  <span className="text-sm font-normal text-surface-400">No runs</span>
                ) : (
                  <span className={successPercentage >= 80 ? 'text-emerald-400' : 'text-amber-400'}>{successPercentage}%</span>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <WorkflowList workflows={workflows.data ?? []} runs={allRuns} selectedId={selectedId} onSelect={setSelectedId} />
            <WorkflowDetails run={selected.data ?? (selectedId === null ? allRuns[0] : undefined)} />
          </div>
        </>
      )}
    </section>
  );
};