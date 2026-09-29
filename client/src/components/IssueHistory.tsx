import type { ReactElement } from 'react';
import type { IssueHistory as History, IssueUser } from '../types/issue';
import { History as HistoryIcon, Activity } from 'lucide-react';

const name = (user: IssueUser) => (typeof user === 'string' ? user : user.name);

export const IssueHistory = ({ history }: { history: History[] }): ReactElement => (
  <section className="space-y-3">
    <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
      <HistoryIcon className="w-3.5 h-3.5 text-brand-400" />
      Audit Trail & History
    </h3>
    <ul className="space-y-2.5">
      {history.map((entry) => (
        <li
          key={entry._id}
          className="flex items-center gap-2 text-xs text-surface-300 bg-surface-900/40 p-2.5 rounded-lg border border-surface-800"
        >
          <Activity className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <strong className="text-white">{name(entry.actorId)}</strong>{' '}
            <span className="text-surface-400">{entry.action.toLowerCase().replace('_', ' ')}</span>
            {entry.field && <span className="font-mono text-brand-300"> ({entry.field})</span>}
          </div>
          <span className="text-[11px] font-mono text-surface-500 shrink-0">
            {new Date(entry.createdAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  </section>
);