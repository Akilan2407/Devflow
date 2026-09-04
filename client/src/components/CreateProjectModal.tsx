import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateProject } from '../features/projects';
import type { Project } from '../types/project';

export const CreateProjectModal = ({ organizationId, onCreated }: { organizationId: string; onCreated: (project: Project) => void }): ReactElement => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', key: '', description: '' });
  const create = useCreateProject();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const project = await create.mutateAsync({ ...form, organizationId });
    onCreated(project); setForm({ name: '', key: '', description: '' }); setOpen(false);
  };
  return <>
    <button className="button max-w-fit" onClick={() => setOpen(true)}>New project</button>
    {open && <div className="fixed inset-0 z-10 grid place-items-center bg-slate-950/40 p-4" onClick={() => setOpen(false)}>
      <form className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 text-slate-900 shadow-2xl" onSubmit={(event) => void submit(event)} onClick={(event) => event.stopPropagation()}>
        <div><h2 className="text-2xl font-bold">Create project</h2><p className="mt-1 text-sm text-slate-500">Give your team a clear place to ship work.</p></div>
        <input className="input" placeholder="Project name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="input" placeholder="Key (for example, WEB)" required value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} />
        <textarea className="input min-h-28" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <div className="flex justify-end gap-3"><button type="button" className="rounded-lg px-4 py-3 font-semibold text-slate-600" onClick={() => setOpen(false)}>Cancel</button><button className="button max-w-fit" disabled={create.isPending}>{create.isPending ? 'Creating...' : 'Create project'}</button></div>
      </form>
    </div>}
  </>;
};