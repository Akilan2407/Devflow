import type { ReactElement } from 'react';
import type { IssueFilters as Filters } from '../features/issues';
import { Search } from 'lucide-react';

export const IssueFilters = ({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}): ReactElement => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative min-w-[200px] flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
      <input
        className="input w-full pl-9"
        placeholder="Search issues..."
        value={filters.search ?? ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />
    </div>
    <select
      className="input max-w-[140px]"
      value={filters.status ?? ''}
      onChange={(event) => onChange({ ...filters, status: event.target.value })}
    >
      <option value="">All statuses</option>
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="RESOLVED">Resolved</option>
      <option value="CLOSED">Closed</option>
      <option value="REOPENED">Reopened</option>
    </select>
    <select
      className="input max-w-[140px]"
      value={filters.priority ?? ''}
      onChange={(event) => onChange({ ...filters, priority: event.target.value })}
    >
      <option value="">All priorities</option>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
      <option value="CRITICAL">Critical</option>
    </select>
    <select
      className="input max-w-[140px]"
      value={filters.severity ?? ''}
      onChange={(event) => onChange({ ...filters, severity: event.target.value })}
    >
      <option value="">All severities</option>
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
      <option value="CRITICAL">Critical</option>
    </select>
    <select
      className="input max-w-[140px]"
      value={filters.type ?? ''}
      onChange={(event) => onChange({ ...filters, type: event.target.value })}
    >
      <option value="">All types</option>
      <option value="BUG">Bug</option>
      <option value="FEATURE">Feature</option>
      <option value="TASK">Task</option>
      <option value="IMPROVEMENT">Improvement</option>
    </select>
  </div>
);