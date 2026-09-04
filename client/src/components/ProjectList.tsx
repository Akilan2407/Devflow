import type { ReactElement } from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types/project';

export const ProjectList = ({ projects }: { projects: Project[] }): ReactElement => projects.length ? (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project._id} project={project} />)}</div>
) : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No projects match these filters.</div>;