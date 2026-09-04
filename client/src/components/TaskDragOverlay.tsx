import type { ReactElement } from 'react';
import type { Task } from '../types/task';

export const TaskDragOverlay = ({ task }: { task: Task | null }): ReactElement | null => task ? <div className="pointer-events-none fixed right-6 top-6 z-20 w-64 rotate-2 rounded-lg border border-cyan-400 bg-white p-4 shadow-2xl"><p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Moving task</p><p className="mt-1 font-bold text-slate-900">{task.title}</p></div> : null;