import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateTask, useUpdateTask, type TaskInput } from '../features/tasks';
import type { Task } from '../types/task';

export const TaskForm = ({ projectId, task, onSaved }: { projectId: string; task?: Task; onSaved: (task: Task) => void }): ReactElement => {
  const [title, setTitle] = useState(task?.title ?? ''); const [description, setDescription] = useState(task?.description ?? '');
  const create = useCreateTask(projectId); const update = useUpdateTask(task?._id ?? '');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const input: TaskInput = { title, description }; const saved = task ? await update.mutateAsync(input) : await create.mutateAsync(input); onSaved(saved); if (!task) { setTitle(''); setDescription(''); } };
  return <form className="space-y-3" onSubmit={(event) => void submit(event)}><input className="input" required placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} /><textarea className="input min-h-24" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><button className="button max-w-fit" disabled={create.isPending || update.isPending}>{task ? 'Save task' : 'Add task'}</button></form>;
};