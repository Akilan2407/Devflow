import type { DragEvent, ReactElement } from 'react';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../types/task';

type Props = { status: TaskStatus; tasks: Task[]; onSelect: (task: Task) => void; onDrop: (status: TaskStatus, index: number) => void; onDragStart: (task: Task) => void; onDragEnd: () => void };
const labels: Record<TaskStatus, string> = { TODO: 'To do', IN_PROGRESS: 'In progress', IN_REVIEW: 'In review', DONE: 'Done' };

export const KanbanColumn = ({ status, tasks, onSelect, onDrop, onDragStart, onDragEnd }: Props): ReactElement => {
  const points = tasks.reduce((total, task) => total + (task.storyPoints ?? 0), 0);
  const drop = (event: DragEvent<HTMLDivElement>, index = tasks.length) => { event.preventDefault(); onDrop(status, index); };
  return <section className="flex min-h-[28rem] min-w-[17rem] flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50" onDragOver={(event) => event.preventDefault()} onDrop={drop}><header className="flex items-center justify-between border-b border-slate-200 px-4 py-4"><div><h2 className="font-bold text-slate-900">{labels[status]}</h2><p className="mt-1 text-xs text-slate-400">{points} story points</p></div><span className="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-xs font-bold text-slate-600">{tasks.length}</span></header><div className="flex flex-1 flex-col gap-3 p-3">{tasks.map((task, index) => <div key={task._id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, index)}><TaskCard task={task} onSelect={() => onSelect(task)} draggable onDragStart={() => onDragStart(task)} onDragEnd={onDragEnd} /></div>)}{!tasks.length && <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">Drop tasks here</p>}</div></section>;
};