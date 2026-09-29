import type { ReactElement } from 'react';
import { useState } from 'react';
import { useDeleteIssue, useIssue, useUpdateIssue } from '../features/issues';
import type { Issue, IssueStatus } from '../types/issue';
import { CommentSection } from './CommentSection';
import { IssueHistory } from './IssueHistory';
import { AttachmentList } from './AttachmentList';
import { FileUploader } from './FileUploader';
import { Trash2, AlertCircle } from 'lucide-react';

export const IssueDetails = ({ issue, onDeleted }: { issue: Issue; onDeleted: () => void }): ReactElement => {
  const details = useIssue(issue._id);
  const update = useUpdateIssue(issue._id);
  const remove = useDeleteIssue(issue._id);
  const [status, setStatus] = useState(issue.status);

  const save = (value: IssueStatus) => {
    setStatus(value);
    void update.mutateAsync({ status: value });
  };

  return (
    <aside className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-surface-800 pb-4">
        <div>
          <span className="badge-brand text-xs font-mono">{issue.type}</span>
          <h2 className="mt-2 text-xl font-bold text-white tracking-tight">{issue.title}</h2>
        </div>
        <button
          className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
          onClick={() => void remove.mutateAsync().then(onDeleted)}
          title="Delete Issue"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-surface-300 leading-relaxed">
        {issue.description || 'No description provided.'}
      </p>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
          Status
        </label>
        <select
          className="input w-full"
          value={status}
          onChange={(event) => save(event.target.value as IssueStatus)}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="REOPENED">Reopened</option>
        </select>
      </div>

      <div className="space-y-4 pt-2 border-t border-surface-800">
        <FileUploader entityType="ISSUE" entityId={issue._id} />
        <AttachmentList entityType="ISSUE" entityId={issue._id} />
      </div>

      <div className="pt-2 border-t border-surface-800">
        <CommentSection entityType="ISSUE" entityId={issue._id} />
      </div>

      {details.data && (
        <div className="pt-2 border-t border-surface-800">
          <IssueHistory history={details.data.history} />
        </div>
      )}
    </aside>
  );
};