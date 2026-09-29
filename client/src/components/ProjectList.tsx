import type { ReactElement } from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types/project';

export const ProjectList = ({ projects }: { projects: Project[] }): ReactElement =>
  projects.length ? (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-surface-800 bg-[#0E1522]/50 p-12 text-center text-slate-400">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-800 text-slate-400">
        📁
      </div>
      <p className="font-semibold text-white">No projects found</p>
      <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or create a new project above.</p>
    </div>
  );