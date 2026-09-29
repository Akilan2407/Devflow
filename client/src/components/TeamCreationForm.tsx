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
      setError('A team name is required (min 2 chars).');
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
    <form className="glass-panel p-6" onSubmit={(event) => void submit(event)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="badge-cyan text-[10px]">SQUAD INITIALIZER</span>
      </div>
      <h2 className="font-bold text-white text-lg">Create Engineering Squad</h2>
      <p className="text-xs text-slate-400 mt-0.5">Form specialized cross-functional squads for targeted development.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Squad name (e.g. Frontend Core)"
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
        <input
          className="input max-w-md"
          placeholder="Mission description"
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
        <button className="button text-xs">Create Squad</button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </form>
  );
};

