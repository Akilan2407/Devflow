import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectMemberList } from '../components/ProjectMemberList';
import { useArchiveProject, useProject } from '../features/projects';

export const ProjectDetailsPage = (): ReactElement => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const archive = useArchiveProject(projectId ?? '');
  if (project.isLoading) return <main className="min-h-screen bg-slate-100 p-6">Loading project...</main>;
  if (!project.data) return <main className="min-h-screen bg-slate-100 p-6">Project not found.</main>;
  return <main className="min-h-screen bg-slate-100 p-6 text-slate-900"><div className="mx-auto max-w-5xl space-y-6"><ProjectHeader project={project.data} onArchive={() => void archive.mutateAsync().then(() => void project.refetch())} /><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><section className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Status</p><p className="mt-2 text-2xl font-bold">{project.data.status.replace('_', ' ')}</p><p className="mt-8 text-sm text-slate-500">Created {new Date(project.data.createdAt).toLocaleDateString()}</p></section><ProjectMemberList project={project.data} onChanged={(updated) => project.data && project.refetch().then(() => updated)} /></div><button className="text-sm font-semibold text-cyan-700" onClick={() => navigate('/projects')}>Back to projects</button></div></main>;
};