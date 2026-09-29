import type { DragEvent, ReactElement } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../types/task';

type Props = {
  status: TaskStatus;
  tasks: Task[];
  onSelect: (task: Task) => void;
  onDrop: (status: TaskStatus, index: number) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
};

const labels: Record<TaskStatus, { title: string; color: string }> = {
  TODO: { title: 'To Do', color: 'text-slate-300' },
  IN_PROGRESS: { title: 'In Progress', color: 'text-brand-400' },
  IN_REVIEW: { title: 'In Review', color: 'text-accent-purple' },
  DONE: { title: 'Done', color: 'text-emerald-400' },
};

export const KanbanColumn = ({
  status,
  tasks,
  onSelect,
  onDrop,
  onDragStart,
  onDragEnd,
}: Props): ReactElement => {
  const points = tasks.reduce((total, task) => total + (task.storyPoints ?? 0), 0);
  const drop = (event: DragEvent<HTMLDivElement>, index = tasks.length) => {
    event.preventDefault();
    onDrop(status, index);
  };

  return (
    <section
      className="flex min-h-[30rem] min-w-[18rem] flex-1 flex-col rounded-2xl border border-surface-800 bg-[#0E1522]/90 backdrop-blur-md"
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
    >
      <header className="flex items-center justify-between border-b border-surface-800 px-4 py-3.5 bg-[#0A0F1A]/60 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <h2 className={`font-bold text-sm ${labels[status].color}`}>{labels[status].title}</h2>
          <span className="rounded-full bg-surface-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            {tasks.length}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-semibold">{points} pts</span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3 overflow-y-auto max-h-[calc(100vh-280px)]">
        {tasks.map((task, index) => (
          <div
            key={task._id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => drop(event, index)}
          >
            <TaskCard
              task={task}
              onSelect={() => onSelect(task)}
              draggable
              onDragStart={() => onDragStart(task)}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
        {!tasks.length && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-surface-800 p-6 text-center text-xs text-slate-600">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
};