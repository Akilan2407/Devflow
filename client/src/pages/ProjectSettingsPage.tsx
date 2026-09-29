import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDeleteProject, useProject, useUpdateProject } from '../features/projects';
import type { ProjectStatus } from '../types/project';
import { RepositorySettings } from '../components/RepositorySettings';
import { CICDDashboard } from '../components/CICDDashboard';

export const ProjectSettingsPage = (): ReactElement => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const update = useUpdateProject(projectId ?? '');
  const remove = useDeleteProject(projectId ?? '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus | null>(null);

  if (project.isLoading) {
    return <div className="glass-panel p-12 animate-pulse h-64" />;
  }

  if (!project.data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400">
        Project not found.
      </div>
    );
  }

  const currentName = name || project.data.name;
  const currentDescription = description || project.data.description;
  const currentStatus = status ?? project.data.status;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-2">
            <Link className="text-brand-400 hover:text-brand-300" to={`/projects/${projectId}`}>
              ← Project Board
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-mono">{project.data.key}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Project Settings & Integrations
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure project metadata, GitHub repository integration, and CI/CD pipelines.
          </p>
        </div>
      </div>

      <form
        className="glass-panel p-6 sm:p-8 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void update
            .mutateAsync({
              name: currentName,
              description: currentDescription,
              status: currentStatus,
            })
            .then(() => navigate(`/projects/${projectId}`));
        }}
      >
        <h2 className="text-lg font-bold text-white">General Information</h2>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
          <input
            className="input"
            value={currentName}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            className="input min-h-28 text-xs"
            value={currentDescription}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Lifecycle Status</label>
          <select
            className="input font-medium text-brand-300"
            value={currentStatus}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
          >
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-800">
          <button
            type="button"
            className="button-danger text-xs"
            onClick={() =>
              void remove.mutateAsync().then(() => navigate('/projects'))
            }
          >
            Delete Project Permanently
          </button>
          <button className="button text-xs" disabled={update.isPending}>
            {update.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {projectId && (
        <div className="space-y-8">
          <div className="glass-panel p-6 sm:p-8">
            <RepositorySettings projectId={projectId} />
          </div>
          <div className="glass-panel p-6 sm:p-8">
            <CICDDashboard projectId={projectId} />
          </div>
        </div>
      )}
    </div>
  );
};