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
    <section className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-surface-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{team.name}</h2>
            <span className="badge-cyan text-[10px]">Active Squad</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{team.description || 'No description provided.'}</p>
        </div>
        <button className="button-danger text-xs" onClick={() => void removeTeam()}>
          Delete Squad
        </button>
      </div>

      <div>
        <h3 className="font-bold text-white text-sm">Squad Members</h3>
        <p className="mt-0.5 text-xs text-slate-400">Add or manage team members participating in this squad.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            className="input max-w-md font-mono text-xs"
            placeholder="User ID or Email..."
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
          <button className="button text-xs" onClick={() => void add()}>
            Add Member
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      </div>

      <div className="space-y-2">
        {team.members.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No members assigned yet.</p>
        ) : (
          team.members.map((member) => (
            <div
              className="flex items-center justify-between rounded-xl border border-surface-800 bg-[#121B2B] px-4 py-2.5 text-xs text-slate-200"
              key={member}
            >
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 font-bold grid place-items-center text-[10px]">
                  M
                </div>
                <span className="font-mono">{member}</span>
              </div>
              <button
                className="font-semibold text-rose-400 hover:text-rose-300 text-xs"
                onClick={() => void remove(member)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

