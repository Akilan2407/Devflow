import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

export const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/projects/${project._id}`} className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-500 hover:shadow-lg">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-widest text-cyan-700">{project.key}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{project.name}</h2></div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{project.status.replace('_', ' ')}</span>
    </div>
    <p className="mt-4 line-clamp-2 text-sm text-slate-500">{project.description || 'No description yet.'}</p>
    <p className="mt-5 text-xs font-semibold text-slate-400">{project.members.length} members</p>
  </Link>
);