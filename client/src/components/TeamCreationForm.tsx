import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { apiClient } from '../lib/api';
import type { Team } from '../types/team';

const schema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().max(1000),
});
type Props = { organizationId: string; onCreated: (team: Team) => void };
export const TeamCreationForm = ({ organizationId, onCreated }: Props): ReactElement => {
  const [values, setValues] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      setError('A team name is required.');
      return;
    }
    try {
      const response = await apiClient.post<{ data: Team }>(
        `/organizations/${organizationId}/teams`,
        result.data,
      );
      onCreated(response.data.data);
      setValues({ name: '', description: '' });
      setError('');
    } catch {
      setError('Unable to create team.');
    }
  };
  return (
    <form className="rounded-xl bg-white p-5 shadow-sm" onSubmit={(event) => void submit(event)}>
      <h2 className="font-bold text-slate-900">Create team</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Team name"
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
        <input
          className="input max-w-md"
          placeholder="Description"
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
        <button className="button max-w-fit">Create team</button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
};
