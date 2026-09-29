import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

const statusBadge: Record<string, string> = {
  PLANNING: 'badge-cyan',
  ACTIVE: 'badge-emerald',
  ON_HOLD: 'badge-amber',
  COMPLETED: 'badge-slate',
  ARCHIVED: 'badge-rose',
};

export const ProjectCard = ({ project }: { project: Project }) => (
  <Link
    to={`/projects/${project._id}`}
    className="group glass-card block relative overflow-hidden transition-all duration-200 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 font-mono font-bold text-xs border border-brand-500/30">
          {project.key}
        </div>
        <div>
          <h2 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
            {project.name}
          </h2>
          <span className="text-[10px] font-mono text-slate-500">ID: {project._id.substring(0, 8)}</span>
        </div>
      </div>
      <span className={statusBadge[project.status] || 'badge-slate'}>
        {project.status.replace('_', ' ')}
      </span>
    </div>

    <p className="mt-4 line-clamp-2 text-xs text-slate-400 leading-relaxed min-h-[32px]">
      {project.description || 'Enterprise project repository & sprint workflow.'}
    </p>

    <div className="mt-5 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-slate-400">
        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="font-semibold text-slate-300">{project.members.length}</span> members
      </div>

      <span className="font-semibold text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        Open Board <span>→</span>
      </span>
    </div>
  </Link>
);