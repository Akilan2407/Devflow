import type { ReactElement } from 'react';
import { useState } from 'react';
import { useCreateIssue } from '../features/issues';
import type { Issue } from '../types/issue';
import { Plus } from 'lucide-react';

export const IssueForm = ({
  projectId,
  onSaved,
}: {
  projectId: string;
  onSaved: (issue: Issue) => void;
}): ReactElement => {
  const create = useCreateIssue(projectId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const issue = await create.mutateAsync({ title, description });
    onSaved(issue);
    setTitle('');
    setDescription('');
  };

  return (
    <form className="grid gap-3 md:grid-cols-[1.5fr_2fr_auto]" onSubmit={(event) => void submit(event)}>
      <input
        className="input"
        required
        placeholder="New issue title..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        className="input"
        placeholder="Brief description (optional)..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button className="button flex items-center justify-center gap-1.5" disabled={create.isPending}>
        <Plus className="w-4 h-4" />
        <span>{create.isPending ? 'Filing...' : 'Create Issue'}</span>
      </button>
    </form>
  );
};