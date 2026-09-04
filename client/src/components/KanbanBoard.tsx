import type { ReactElement } from 'react';
import { useState } from 'react';
import { useMoveTask, type TaskFilters } from '../features/tasks';
import type { Task, TaskStatus } from '../types/task';
import { KanbanColumn } from './KanbanColumn';
import { TaskDragOverlay } from './TaskDragOverlay';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export const KanbanBoard = ({ projectId, filters, tasks, onSelect }: { projectId: string; filters: TaskFilters; tasks: Task[]; onSelect: (task: Task) => void }): ReactElement => {
  const [dragged, setDragged] = useState<Task | null>(null);
  const move = useMoveTask(projectId, filters);
  const drop = (status: TaskStatus, index: number) => {
    if (!dragged) { setDragged(null); return; }
    const originalIndex = tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position).findIndex((task) => task._id === dragged._id);
    const sameColumn = tasks.filter((task) => task.status === status && task._id !== dragged._id).sort((a, b) => a.position - b.position);
    const adjustedIndex = dragged.status === status && originalIndex >= 0 && originalIndex < index ? index - 1 : index;
    const previous = sameColumn[adjustedIndex - 1];
    const next = sameColumn[adjustedIndex];
    const position = previous && next ? (previous.position + next.position) / 2 : previous ? previous.position + 1 : next ? Math.max(next.position / 2, 0.5) : 0;
    if (dragged.status === status && position === dragged.position) { setDragged(null); return; }
    void move.mutateAsync({ taskId: dragged._id, status, position }).catch(() => undefined);
    setDragged(null);
  };
  return <><div className="flex gap-4 overflow-x-auto pb-3">{statuses.map((status) => <KanbanColumn key={status} status={status} tasks={tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position)} onSelect={onSelect} onDrop={drop} onDragStart={setDragged} onDragEnd={() => setDragged(null)} />)}</div><TaskDragOverlay task={dragged} /></>;
};