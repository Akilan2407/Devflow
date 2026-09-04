import type { ReactElement } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Task } from '../types/task';

export const SprintBurndownChart = ({ tasks, startDate, endDate }: { tasks: Task[]; startDate: string; endDate: string }): ReactElement => {
  const total = tasks.reduce((sum, task) => sum + (task.storyPoints ?? 0), 0);
  const completed = tasks.filter((task) => task.status === 'DONE').reduce((sum, task) => sum + (task.storyPoints ?? 0), 0);
  const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000));
  const data = Array.from({ length: Math.min(days + 1, 15) }, (_, index) => ({ day: `Day ${index + 1}`, remaining: Math.max(total - Math.round((completed / Math.max(days, 1)) * index), 0), ideal: Math.max(total - Math.round((total / Math.max(days, 1)) * index), 0) }));
  return <div className="h-64 w-full"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" dot={false} /><Line type="monotone" dataKey="remaining" stroke="#0891b2" strokeWidth={3} /></LineChart></ResponsiveContainer></div>;
};