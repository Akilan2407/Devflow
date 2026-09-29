import type { ReactElement } from 'react';
import {
  useSprintAction,
  useSprintTaskMutation,
  useSprint,
  useDeleteSprint,
} from '../features/sprints';
import { SprintBurndownChart } from './SprintBurndownChart';
import type { Sprint } from '../types/sprint';

const sprintStatusBadges: Record<string, string> = {
  PLANNED: 'badge-cyan',
  ACTIVE: 'badge-emerald',
  COMPLETED: 'badge-slate',
  CANCELLED: 'badge-rose',
};

export const SprintDetails = ({
  sprint,
  projectId,
  availableTasks,
  onChanged,
}: {
  sprint: Sprint;
  projectId: string;
  availableTasks: import('../types/task').Task[];
  onChanged: () => void;
}): ReactElement => {
  const details = useSprint(sprint._id);
  const start = useSprintAction(sprint._id, projectId, 'start');
  const complete = useSprintAction(sprint._id, projectId, 'complete');
  const remove = useDeleteSprint(sprint._id, projectId);
  const tasks = useSprintTaskMutation(sprint._id);

  const run = async (action: typeof start) => {
    await action.mutateAsync();
    onChanged();
  };

  const metrics = details.data?.metrics;
  const sprintTaskIds = new Set(details.data?.tasks.map((task) => task._id) ?? []);

  return (
    <section className="glass-panel p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">{sprint.name}</h2>
            <span className={sprintStatusBadges[sprint.status] || 'badge-slate'}>
              {sprint.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{sprint.goal || 'No goal set for this sprint.'}</p>
        </div>

        <div className="flex items-center gap-2">
          {sprint.status === 'PLANNED' && (
            <button className="button text-xs" onClick={() => void run(start)}>
              ▶ Start Sprint
            </button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button className="button text-xs" onClick={() => void run(complete)}>
              ✓ Complete Sprint
            </button>
          )}
          <button
            className="button-danger text-xs"
            onClick={() => void remove.mutateAsync().then(onChanged)}
          >
            Delete Sprint
          </button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
            <p className="text-[11px] font-semibold text-slate-400">Total Commitment</p>
            <strong className="mt-1 block text-2xl font-bold text-white">
              {metrics.totalStoryPoints} <span className="text-xs font-normal text-slate-500">pts</span>
            </strong>
          </div>
          <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
            <p className="text-[11px] font-semibold text-slate-400">Completed</p>
            <strong className="mt-1 block text-2xl font-bold text-emerald-400">
              {metrics.completedStoryPoints} <span className="text-xs font-normal text-slate-500">pts</span>
            </strong>
          </div>
          <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
            <p className="text-[11px] font-semibold text-slate-400">Remaining</p>
            <strong className="mt-1 block text-2xl font-bold text-amber-400">
              {metrics.remainingStoryPoints} <span className="text-xs font-normal text-slate-500">pts</span>
            </strong>
          </div>
          <div className="rounded-xl border border-surface-800 bg-[#121B2B] p-3">
            <p className="text-[11px] font-semibold text-slate-400">Burn Completion</p>
            <strong className="mt-1 block text-2xl font-bold text-brand-400">
              {metrics.completionPercentage}%
            </strong>
          </div>
        </div>
      )}

      {details.data && (
        <>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Sprint Burndown Telemetry
            </h3>
            <div className="rounded-xl border border-surface-800 bg-[#0A0F1A] p-4">
              <SprintBurndownChart
                tasks={details.data.tasks}
                startDate={sprint.startDate}
                endDate={sprint.endDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Sprint Backlog ({details.data.tasks.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {details.data.tasks.map((task) => (
                  <div
                    className="flex items-center justify-between rounded-xl border border-surface-800 bg-[#121B2B] px-3.5 py-2.5 text-xs text-white"
                    key={task._id}
                  >
                    <span className="truncate">{task.title}</span>
                    <button
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs ml-2"
                      onClick={() =>
                        void tasks.mutateAsync({ taskId: task._id, remove: true }).then(onChanged)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {details.data.tasks.length === 0 && (
                  <p className="text-xs text-slate-500 italic p-3">No tasks in sprint backlog.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Backlog Tasks
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableTasks
                  .filter((task) => !sprintTaskIds.has(task._id))
                  .map((task) => (
                    <div
                      className="flex items-center justify-between rounded-xl border border-surface-800 bg-[#121B2B] px-3.5 py-2.5 text-xs text-white"
                      key={task._id}
                    >
                      <span className="truncate">{task.title}</span>
                      <button
                        className="text-brand-400 hover:text-brand-300 font-semibold text-xs ml-2"
                        onClick={() =>
                          void tasks.mutateAsync({ taskId: task._id }).then(onChanged)
                        }
                      >
                        + Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};