import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateTask, useUpdateTask, type TaskInput } from '../features/tasks';
import type { Task } from '../types/task';

export const TaskForm = ({
  projectId,
  task,
  onSaved,
}: {
  projectId: string;
  task?: Task;
  onSaved: (task: Task) => void;
}): ReactElement => {
  const [open, setOpen] = useState(Boolean(task));
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const create = useCreateTask(projectId);
  const update = useUpdateTask(task?._id ?? '');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const input: TaskInput = { title, description };
    const saved = task ? await update.mutateAsync(input) : await create.mutateAsync(input);
    onSaved(saved);
    if (!task) {
      setTitle('');
      setDescription('');
      setOpen(false);
    }
  };

  if (!open && !task) {
    return (
      <button className="button text-xs" onClick={() => setOpen(true)}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Task</span>
      </button>
    );
  }

  return (
    <form
      className="glass-panel p-5 space-y-3 w-full max-w-xl"
      onSubmit={(event) => void submit(event)}
    >
      <div className="flex items-center justify-between pb-2 border-b border-surface-800">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {task ? 'Edit Task' : 'New Sprint Task'}
        </span>
        {!task && (
          <button
            type="button"
            className="text-xs text-slate-500 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        )}
      </div>

      <input
        className="input text-xs"
        required
        placeholder="Task title (e.g. Implement Kafka consumer)"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        className="input min-h-20 text-xs"
        placeholder="Acceptance criteria and technical details..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="flex justify-end gap-2 pt-1">
        {!task && (
          <button
            type="button"
            className="button-secondary text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        )}
        <button
          className="button text-xs"
          disabled={create.isPending || update.isPending || !title.trim()}
        >
          {task ? 'Save Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};