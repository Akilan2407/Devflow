import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/project';

export const ProjectHeader = ({ project, onArchive }: { project: Project; onArchive?: () => void }): ReactElement => <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
  <div><Link className="text-sm font-bold text-cyan-700" to="/projects">All projects</Link><div className="mt-3 flex items-center gap-3"><span className="text-sm font-bold text-slate-400">{project.key}</span><h1 className="text-3xl font-bold text-slate-900">{project.name}</h1></div><p className="mt-2 max-w-2xl text-slate-500">{project.description || 'No description yet.'}</p></div>
  <div className="flex gap-2">{onArchive && project.status !== 'ARCHIVED' && <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={onArchive}>Archive</button>}<Link className="button max-w-fit" to={`/projects/${project._id}/settings`}>Settings</Link></div>
</header>;