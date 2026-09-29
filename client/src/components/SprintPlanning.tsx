import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateSprint, useSprints } from '../features/sprints';
import type { Sprint } from '../types/sprint';

const sprintStatusBadges: Record<string, string> = {
  PLANNED: 'badge-cyan',
  ACTIVE: 'badge-emerald',
  COMPLETED: 'badge-slate',
  CANCELLED: 'badge-rose',
};

export const SprintPlanning = ({
  projectId,
  onSelect,
}: {
  projectId: string;
  onSelect: (sprint: Sprint) => void;
}): ReactElement => {
  const sprints = useSprints(projectId);
  const create = useCreateSprint(projectId);
  const [form, setForm] = useState({ name: '', goal: '', startDate: '', endDate: '' });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const sprint = await create.mutateAsync(form);
    onSelect(sprint);
    setForm({ name: '', goal: '', startDate: '', endDate: '' });
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <div className="border-b border-surface-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="badge-cyan">AGILE CADENCE</span>
        </div>
        <h2 className="mt-1 text-xl font-bold text-white">Sprint Planning & Iterations</h2>
        <p className="mt-1 text-xs text-slate-400">
          Plan focused time-boxed delivery windows with measurable commitment goals.
        </p>
      </div>

      <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-4" onSubmit={(event) => void submit(event)}>
        <input
          className="input text-xs"
          placeholder="Sprint name (e.g. Sprint 44)"
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          className="input text-xs"
          placeholder="Sprint commitment goal"
          value={form.goal}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
        />
        <input
          className="input text-xs"
          type="date"
          required
          value={form.startDate}
          onChange={(event) => setForm({ ...form, startDate: event.target.value })}
        />
        <input
          className="input text-xs"
          type="date"
          required
          value={form.endDate}
          onChange={(event) => setForm({ ...form, endDate: event.target.value })}
        />
        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
          <button className="button text-xs" disabled={create.isPending || !form.name.trim()}>
            {create.isPending ? 'Provisioning...' : 'Create Sprint'}
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Existing Sprints ({sprints.data?.length ?? 0})
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(sprints.data ?? []).map((sprint) => (
            <button
              key={sprint._id}
              className="group rounded-xl border border-surface-800 bg-[#121B2B] p-4 text-left transition hover:border-brand-500/50 hover:bg-[#16233B]"
              onClick={() => onSelect(sprint)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-white text-sm group-hover:text-brand-300">
                  {sprint.name}
                </span>
                <span className={sprintStatusBadges[sprint.status] || 'badge-slate'}>
                  {sprint.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                {sprint.goal || 'No goal set for this sprint.'}
              </p>
              <div className="mt-3 pt-2 border-t border-surface-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{new Date(sprint.startDate).toLocaleDateString()}</span>
                <span>→</span>
                <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};