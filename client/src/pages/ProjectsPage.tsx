import type { ReactElement } from 'react';
import { useState } from 'react';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { ProjectList } from '../components/ProjectList';
import { useProjects } from '../features/projects';
import { useOrganizationStore } from '../stores/organization.store';

export const ProjectsPage = (): ReactElement => {
  const organization = useOrganizationStore((state) => state.selectedOrganization);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const projects = useProjects({ organizationId: organization?._id, search, status, sort: 'name' });
  return <main className="min-h-screen bg-slate-100 p-6 text-slate-900"><div className="mx-auto max-w-6xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">{organization?.name ?? 'Workspace'}</p><h1 className="text-3xl font-bold">Projects</h1></div>{organization && <CreateProjectModal organizationId={organization._id} onCreated={() => void projects.refetch()} />}</header><div className="flex flex-wrap gap-3"><input className="input max-w-sm" placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="input max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="COMPLETED">Completed</option><option value="ARCHIVED">Archived</option></select></div>{!organization ? <p className="rounded-xl bg-white p-8 text-slate-500">Select an organization before viewing projects.</p> : projects.isLoading ? <p>Loading projects...</p> : <ProjectList projects={projects.data?.items ?? []} />}</div></main>;
};