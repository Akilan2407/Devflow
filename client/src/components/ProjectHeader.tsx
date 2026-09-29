import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

const statusBadge: Record<string, string> = {
  PLANNING: 'badge-cyan',
  ACTIVE: 'badge-emerald',
  ON_HOLD: 'badge-amber',
  COMPLETED: 'badge-slate',
  ARCHIVED: 'badge-rose',
};

export const ProjectHeader = ({
  project,
  onArchive,
}: {
  project: Project;
  onArchive?: () => void;
}): ReactElement => (
  <header className="flex flex-wrap items-start justify-between gap-4 border-b border-surface-800/80 pb-6">
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Link className="text-brand-400 hover:text-brand-300 transition" to="/projects">
          ← All Projects
        </Link>
        <span className="text-slate-600">/</span>
        <span className="font-mono text-slate-400">{project.key}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {project.name}
        </h1>
        <span className={statusBadge[project.status] || 'badge-slate'}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <p className="mt-2 max-w-2xl text-xs text-slate-400 leading-relaxed">
        {project.description || 'Enterprise project repository and sprint workflow management.'}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2.5">
      <Link className="button-secondary text-xs" to={`/projects/${project._id}/issues`}>
        <span>🐞 Issues</span>
      </Link>
      {onArchive && project.status !== 'ARCHIVED' && (
        <button
          className="button-secondary text-xs text-amber-400 hover:border-amber-500/50"
          onClick={onArchive}
        >
          Archive
        </button>
      )}
      <Link className="button-secondary text-xs" to={`/projects/${project._id}/settings`}>
        <span>⚙️ Settings</span>
      </Link>
    </div>
  </header>
);