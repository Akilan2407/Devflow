import type { ReactElement } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectHeader } from '../components/ProjectHeader';
import { useArchiveProject, useProject } from '../features/projects';
import { TaskDetails } from '../components/TaskDetails';
import { TaskForm } from '../components/TaskForm';
import { useTasks, type TaskFilters as TaskFilterValues } from '../features/tasks';
import type { Task } from '../types/task';
import { KanbanBoard } from '../components/KanbanBoard';
import { KanbanFilters } from '../components/KanbanFilters';
import { SprintPlanning } from '../components/SprintPlanning';
import { SprintDetails } from '../components/SprintDetails';
import type { Sprint } from '../types/sprint';
import { CommentSection } from '../components/CommentSection';
import { ProjectChat } from '../components/ProjectChat';
import { useProjectRealtime } from '../hooks/useProjectRealtime';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { AttachmentList } from '../components/AttachmentList';
import { FileUploader } from '../components/FileUploader';

type TabKey = 'kanban' | 'sprints' | 'analytics' | 'chat' | 'files' | 'comments';

export const ProjectDetailsPage = (): ReactElement => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProject(projectId);
  const archive = useArchiveProject(projectId ?? '');
  const [activeTab, setActiveTab] = useState<TabKey>('kanban');
  const [filters, setFilters] = useState<TaskFilterValues>({ limit: 100 });
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedSprint, setSelectedSprint] = useState<Sprint | undefined>();
  const tasks = useTasks(projectId, filters);
  useProjectRealtime(projectId);

  if (project.isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel h-28 animate-pulse" />
        <div className="glass-panel h-96 animate-pulse" />
      </div>
    );
  }

  if (!project.data) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Project not found</h2>
        <p className="mt-2 text-xs text-slate-500">The requested project could not be loaded or has been deleted.</p>
        <button className="button mt-4" onClick={() => navigate('/projects')}>
          Back to Projects
        </button>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: string; count?: number }[] = [
    { key: 'kanban', label: 'Kanban Board', icon: '📋', count: tasks.data?.items.length },
    { key: 'sprints', label: 'Sprint Planning', icon: '🏃' },
    { key: 'analytics', label: 'Analytics & Burndown', icon: '📊' },
    { key: 'chat', label: 'Real-time Chat', icon: '⚡' },
    { key: 'files', label: 'Attachments & Assets', icon: '📁' },
    { key: 'comments', label: 'Project Discussions', icon: '💬' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Project Header */}
      <ProjectHeader
        project={project.data}
        onArchive={() => void archive.mutateAsync().then(() => void project.refetch())}
      />

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-surface-800 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-surface-800/60 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="rounded-full bg-surface-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <KanbanFilters filters={filters} onChange={setFilters} />
            <TaskForm projectId={project.data._id} onSaved={() => void tasks.refetch()} />
          </div>

          {tasks.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card animate-pulse h-96 rounded-xl" />
              ))}
            </div>
          ) : (
            <KanbanBoard
              projectId={project.data._id}
              filters={filters}
              tasks={tasks.data?.items ?? []}
              onSelect={setSelectedTask}
            />
          )}

          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              onChanged={setSelectedTask}
              onDeleted={() => {
                setSelectedTask(undefined);
                void tasks.refetch();
              }}
            />
          )}
        </div>
      )}

      {/* Tab Content 2: Sprint Planning */}
      {activeTab === 'sprints' && (
        <div className="space-y-6">
          <SprintPlanning projectId={project.data._id} onSelect={setSelectedSprint} />
          {selectedSprint && (
            <SprintDetails
              sprint={selectedSprint}
              projectId={project.data._id}
              availableTasks={tasks.data?.items ?? []}
              onChanged={() => {
                setSelectedSprint(undefined);
                void tasks.refetch();
              }}
            />
          )}
        </div>
      )}

      {/* Tab Content 3: Analytics & Burndown */}
      {activeTab === 'analytics' && (
        <div className="glass-panel p-6">
          <AnalyticsDashboard projectId={project.data._id} />
        </div>
      )}

      {/* Tab Content 4: Real-time Team Chat */}
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto">
          <ProjectChat projectId={project.data._id} />
        </div>
      )}

      {/* Tab Content 5: Attachments & Files */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <FileUploader entityType="PROJECT" entityId={project.data._id} />
          <AttachmentList entityType="PROJECT" entityId={project.data._id} />
        </div>
      )}

      {/* Tab Content 6: Project Discussions */}
      {activeTab === 'comments' && (
        <div className="max-w-3xl mx-auto">
          <CommentSection entityType="PROJECT" entityId={project.data._id} />
        </div>
      )}
    </div>
  );
};

