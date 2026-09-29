import type { ReactElement } from 'react';
import type { Issue } from '../types/issue';
import { AlertCircle, Tag } from 'lucide-react';

export const IssueList = ({
  issues,
  onSelect,
}: {
  issues: Issue[];
  onSelect: (issue: Issue) => void;
}): ReactElement =>
  issues.length ? (
    <div className="space-y-3">
      {issues.map((issue) => (
        <button
          key={issue._id}
          className="glass-card group w-full rounded-2xl p-5 text-left transition-all hover:border-brand-500/50 hover:bg-surface-800/60"
          onClick={() => onSelect(issue)}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors text-base">
              {issue.title}
            </h3>
            <span className="badge-brand text-xs font-mono">{issue.status.replace('_', ' ')}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase text-surface-400">
            <span className="text-brand-400 font-mono">{issue.type}</span>
            <span>·</span>
            <span>{issue.priority} priority</span>
            <span>·</span>
            <span>{issue.severity} severity</span>
          </div>
          <p className="mt-2 text-xs text-surface-300 line-clamp-2 leading-relaxed">
            {issue.description || 'No description provided'}
          </p>
          {issue.labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {issue.labels.map((label) => (
                <span key={label} className="badge-surface text-[11px] font-mono flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-brand-400" />
                  {label}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  ) : (
    <div className="glass-card rounded-2xl border-dashed border-surface-700 p-12 text-center text-surface-400">
      <AlertCircle className="w-8 h-8 text-surface-500 mx-auto mb-2" />
      <p className="text-sm font-medium">No issues match these filters.</p>
    </div>
  );