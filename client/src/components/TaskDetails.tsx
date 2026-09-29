import type { ReactElement } from 'react';
import { useState } from 'react';
import { useDeleteTask, useUpdateTask, type TaskInput } from '../features/tasks';
import type { Task, TaskPriority, TaskStatus } from '../types/task';
import { CommentSection } from './CommentSection';
import { AttachmentList } from './AttachmentList';
import { FileUploader } from './FileUploader';
import { Trash2, CheckSquare, Layers, Award } from 'lucide-react';

export const TaskDetails = ({
  task,
  onChanged,
  onDeleted,
}: {
  task: Task;
  onChanged: (task: Task) => void;
  onDeleted: () => void;
}): ReactElement => {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const update = useUpdateTask(task._id);
  const remove = useDeleteTask(task._id);

  const save = async (values: Partial<TaskInput>) => onChanged(await update.mutateAsync(values));

  return (
    <aside className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-surface-800 pb-4">
        <div>
          <span className="badge-brand text-xs font-mono">{task.type}</span>
          <h2 className="mt-2 text-xl font-bold text-white tracking-tight">{task.title}</h2>
        </div>
        <button
          className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
          onClick={() => void remove.mutateAsync().then(onDeleted)}
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-surface-300 leading-relaxed">
        {task.description || 'No description provided for this work item.'}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
            Status
          </label>
          <select
            className="input w-full"
            value={status}
            onChange={(event) => {
              const value = event.target.value as TaskStatus;
              setStatus(value);
              void save({ status: value });
            }}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
            Priority
          </label>
          <select
            className="input w-full"
            value={priority}
            onChange={(event) => {
              const value = event.target.value as TaskPriority;
              setPriority(value);
              void save({ priority: value });
            }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-900/60 border border-surface-800">
        <Award className="w-4 h-4 text-brand-400" />
        <span className="text-xs font-semibold text-surface-400">Story Points:</span>
        <span className="text-xs font-mono font-bold text-white">{task.storyPoints ?? 0} SP</span>
      </div>

      <div className="space-y-4 pt-2 border-t border-surface-800">
        <FileUploader entityType="TASK" entityId={task._id} />
        <AttachmentList entityType="TASK" entityId={task._id} />
      </div>

      <div className="pt-2 border-t border-surface-800">
        <CommentSection entityType="TASK" entityId={task._id} />
      </div>
    </aside>
  );
};