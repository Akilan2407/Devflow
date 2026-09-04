import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectMemberList } from '../components/ProjectMemberList';
import { useArchiveProject, useProject } from '../features/projects';
import { TaskDetails } from '../components/TaskDetails';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { useTasks, type TaskFilters as TaskFilterValues } from '../features/tasks';
import type { Task } from '../types/task';
import { useState } from 'react';

export const ProjectDetailsPage = (): ReactElement => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const archive = useArchiveProject(projectId ?? '');
  const [filters, setFilters] = useState<TaskFilterValues>({});
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const tasks = useTasks(projectId, filters);
  if (project.isLoading) return <main className="min-h-screen bg-slate-100 p-6">Loading project...</main>;
  if (!project.data) return <main className="min-h-screen bg-slate-100 p-6">Project not found.</main>;
  return <main className="min-h-screen bg-slate-100 p-6 text-slate-900"><div className="mx-auto max-w-6xl space-y-6"><ProjectHeader project={project.data} onArchive={() => void archive.mutateAsync().then(() => void project.refetch())} /><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><section className="space-y-5"><div className="rounded-xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Tasks</p><div className="mt-4"><TaskForm projectId={project.data._id} onSaved={() => void tasks.refetch()} /></div></div><TaskFilters filters={filters} onChange={setFilters} />{tasks.isLoading ? <p>Loading tasks...</p> : <TaskList tasks={tasks.data?.items ?? []} onSelect={setSelectedTask} />}</section>{selectedTask ? <TaskDetails task={selectedTask} onChanged={setSelectedTask} onDeleted={() => { setSelectedTask(undefined); void tasks.refetch(); }} /> : <ProjectMemberList project={project.data} onChanged={() => void project.refetch()} />}</div><button className="text-sm font-semibold text-cyan-700" onClick={() => navigate('/projects')}>Back to projects</button></div></main>;
};