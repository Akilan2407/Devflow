import type { ReactElement } from 'react';
import { TaskFilters } from './TaskFilters';
import type { TaskFilters as Filters } from '../features/tasks';

export const KanbanFilters = ({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }): ReactElement => <div className="rounded-xl border border-slate-200 bg-white p-4"><TaskFilters filters={filters} onChange={onChange} /></div>;