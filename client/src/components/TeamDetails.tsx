import type { ReactElement } from 'react';
import { useState } from 'react';
import { apiClient } from '../lib/api';
import type { Team } from '../types/team';

type Props = { team: Team; onChanged: (team: Team) => void; onDeleted: () => void };
export const TeamDetails = ({ team, onChanged, onDeleted }: Props): ReactElement => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const add = async (): Promise<void> => {
    try {
      const response = await apiClient.post<{ data: Team }>(`/teams/${team._id}/members`, {
        userId,
      });
      onChanged(response.data.data);
      setUserId('');
      setError('');
    } catch {
      setError('Unable to add member. Confirm the user belongs to this organization.');
    }
  };
  const remove = async (memberId: string): Promise<void> => {
    const response = await apiClient.delete<{ data: Team }>(
      `/teams/${team._id}/members/${memberId}`,
    );
    onChanged(response.data.data);
  };
  const removeTeam = async (): Promise<void> => {
    await apiClient.delete(`/teams/${team._id}`);
    onDeleted();
  };
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{team.name}</h2>
          <p className="mt-2 text-slate-500">{team.description || 'No description'}</p>
        </div>
        <button className="text-sm font-semibold text-red-600" onClick={() => void removeTeam()}>
          Delete
        </button>
      </div>
      <h3 className="mt-8 font-bold text-slate-900">Manage members</h3>
      <div className="mt-3 flex gap-3">
        <input
          className="input max-w-md"
          placeholder="User ID"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
        <button className="button max-w-fit" onClick={() => void add()}>
          Add member
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <ul className="mt-5 space-y-2">
        {team.members.map((member) => (
          <li
            className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm text-slate-700"
            key={member}
          >
            <span>{member}</span>
            <button className="font-semibold text-red-600" onClick={() => void remove(member)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
