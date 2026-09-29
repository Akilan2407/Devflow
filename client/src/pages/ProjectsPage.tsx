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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-cyan">{organization?.name ?? 'Workspace Scope'}</span>
            <span className="text-xs text-slate-500 font-mono">Sprint Boards & Repos</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Projects & Workspaces
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage agile development boards, pull requests, tasks, and CI/CD pipelines.
          </p>
        </div>

        {organization && (
          <CreateProjectModal
            organizationId={organization._id}
            onCreated={() => void projects.refetch()}
          />
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-surface-800 bg-[#0E1522]/80 p-4 backdrop-blur-md">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="input pl-10"
              placeholder="Search projects by name or key..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="input max-w-xs font-medium text-slate-200"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Total: <span className="font-bold text-brand-400">{projects.data?.items.length ?? 0}</span> projects
        </div>
      </div>

      {/* Projects Grid Content */}
      {!organization ? (
        <div className="rounded-2xl border border-surface-800 bg-[#0E1522] p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-white">No active organization selected.</p>
          <p className="mt-1 text-xs text-slate-500">Please select or create an organization first.</p>
        </div>
      ) : projects.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse h-44 rounded-xl" />
          ))}
        </div>
      ) : (
        <ProjectList projects={projects.data?.items ?? []} />
      )}
    </div>
  );
};