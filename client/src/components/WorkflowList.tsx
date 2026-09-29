import type { ReactElement } from 'react';
import type { GithubWorkflow, GithubWorkflowRun } from '../types/github';
import { Play, CheckCircle2, XCircle, Clock } from 'lucide-react';

const statusLabel = (run: GithubWorkflowRun | undefined): string =>
  run?.status === 'in_progress' ? 'IN PROGRESS' : run?.status?.toUpperCase() ?? 'NO RUNS';
const conclusionLabel = (run: GithubWorkflowRun | undefined): string =>
  run?.conclusion?.toUpperCase() ?? 'PENDING';

export const WorkflowList = ({
  workflows,
  runs,
  selectedId,
  onSelect,
}: {
  workflows: GithubWorkflow[];
  runs: GithubWorkflowRun[];
  selectedId: number | null;
  onSelect: (runId: number) => void;
}): ReactElement => (
  <section className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400">Workflows</h3>
      <span className="badge-surface">{workflows.length} configured</span>
    </div>
    <div className="overflow-hidden rounded-2xl border border-surface-800/80 bg-surface-900/60 divide-y divide-surface-800/60">
      {workflows.length ? (
        workflows.map((workflow) => {
          const run = runs.find((item) => item.workflow_id === workflow.id);
          const isSelected = selectedId === run?.id;
          const isSuccess = run?.conclusion === 'success';
          const isFailed = run?.conclusion === 'failure';
          const isRunning = run?.status === 'in_progress';

          return (
            <button
              className={`flex w-full items-center justify-between gap-4 p-4 text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-brand-500/10 border-l-2 border-brand-500'
                  : 'hover:bg-surface-800/50'
              }`}
              type="button"
              key={workflow.id}
              onClick={() => {
                if (run) onSelect(run.id);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isFailed
                      ? 'bg-rose-500/10 text-rose-400'
                      : isRunning
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-surface-800 text-surface-400'
                  }`}
                >
                  <Play className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-white truncate text-sm">{workflow.name}</span>
                  <span className="mt-0.5 block text-xs font-mono text-surface-500 truncate">{workflow.path}</span>
                </div>
              </div>

              <div className="text-right text-xs shrink-0">
                <span
                  className={`block font-semibold ${
                    isSuccess
                      ? 'text-emerald-400'
                      : isFailed
                      ? 'text-rose-400'
                      : isRunning
                      ? 'text-amber-400'
                      : 'text-surface-400'
                  }`}
                >
                  {statusLabel(run)}
                </span>
                <span className="mt-0.5 block font-mono text-surface-500">{conclusionLabel(run)}</span>
              </div>
            </button>
          );
        })
      ) : (
        <p className="p-6 text-sm text-surface-400 text-center">No GitHub Actions workflows found.</p>
      )}
    </div>
  </section>
);