import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteProject, useProject, useUpdateProject } from '../features/projects';
import type { ProjectStatus } from '../types/project';
import { RepositorySettings } from '../components/RepositorySettings';

export const ProjectSettingsPage = (): ReactElement => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const update = useUpdateProject(projectId ?? '');
  const remove = useDeleteProject(projectId ?? '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  if (project.isLoading) return <main className="min-h-screen bg-slate-100 p-6">Loading project...</main>;
  if (!project.data) return <main className="min-h-screen bg-slate-100 p-6">Project not found.</main>;
  const currentName = name || project.data.name;
  const currentDescription = description || project.data.description;
  const currentStatus = status ?? project.data.status;
  return <main className="min-h-screen space-y-6 bg-slate-100 p-6 text-slate-900"><form className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-sm" onSubmit={(event) => { event.preventDefault(); void update.mutateAsync({ name: currentName, description: currentDescription, status: currentStatus }).then(() => navigate(`/projects/${projectId}`)); }}><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">{project.data.key}</p><h1 className="text-3xl font-bold">Project settings</h1></div><label className="block text-sm font-semibold">Name<input className="input mt-2" value={currentName} onChange={(event) => setName(event.target.value)} /></label><label className="block text-sm font-semibold">Description<textarea className="input mt-2 min-h-32" value={currentDescription} onChange={(event) => setDescription(event.target.value)} /></label><label className="block text-sm font-semibold">Status<select className="input mt-2" value={currentStatus} onChange={(event) => setStatus(event.target.value as ProjectStatus)}><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="COMPLETED">Completed</option><option value="ARCHIVED">Archived</option></select></label><div className="flex flex-wrap justify-between gap-3"><button type="button" className="font-semibold text-red-600" onClick={() => void remove.mutateAsync().then(() => navigate('/projects'))}>Delete project</button><button className="button max-w-fit" disabled={update.isPending}>Save changes</button></div></form>{projectId && <RepositorySettings projectId={projectId} />}</main>;
};