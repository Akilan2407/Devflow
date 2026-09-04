import type { ReactElement } from 'react';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';

export const TaskList = ({ tasks, onSelect }: { tasks: Task[]; onSelect: (task: Task) => void }): ReactElement => tasks.length ? <div className="space-y-3">{tasks.map((task) => <TaskCard key={task._id} task={task} onSelect={() => onSelect(task)} />)}</div> : <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No tasks match these filters.</p>;