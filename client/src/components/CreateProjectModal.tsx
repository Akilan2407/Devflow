import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateProject } from '../features/projects';
import type { Project } from '../types/project';

export const CreateProjectModal = ({
  organizationId,
  onCreated,
}: {
  organizationId: string;
  onCreated: (project: Project) => void;
}): ReactElement => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', key: '', description: '' });
  const create = useCreateProject();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const project = await create.mutateAsync({ ...form, organizationId });
    onCreated(project);
    setForm({ name: '', key: '', description: '' });
    setOpen(false);
  };

  return (
    <>
      <button className="button shadow-lg shadow-brand-500/20" onClick={() => setOpen(true)}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Project</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          <form
            className="w-full max-w-lg space-y-5 rounded-2xl border border-surface-700 bg-[#0E1522] p-6 sm:p-8 text-slate-100 shadow-2xl"
            onSubmit={(event) => void submit(event)}
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <span className="badge-cyan">PROJECT INITIALIZATION</span>
              <h2 className="mt-2 text-2xl font-bold text-white">Create Project</h2>
              <p className="mt-1 text-xs text-slate-400">
                Provision a repository and sprint board for your development squad.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
                <input
                  className="input"
                  placeholder="e.g. Core API Service"
                  required
                  value={form.name}
                  onChange={(event) => {
                    setForm({ ...form, name: event.target.value });
                    if (!form.key && event.target.value.length >= 2) {
                      setForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                        key: event.target.value.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, ''),
                      }));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Key Prefix</label>
                <input
                  className="input font-mono uppercase"
                  placeholder="e.g. CORE"
                  maxLength={6}
                  required
                  value={form.key}
                  onChange={(event) => setForm({ ...form, key: event.target.value.toUpperCase() })}
                />
                <span className="text-[10px] text-slate-500 font-mono">Used to prefix tasks (e.g. CORE-101)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  className="input min-h-24 text-xs"
                  placeholder="Briefly describe project objectives and scope..."
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="button-secondary text-xs"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="button text-xs"
                disabled={create.isPending || !form.name.trim() || !form.key.trim()}
              >
                {create.isPending ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};