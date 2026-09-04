import type { ReactElement } from 'react';
import type { Team } from '../types/team';

type Props = { team: Team; selected: boolean; onSelect: () => void };
export const TeamCard = ({ team, selected, onSelect }: Props): ReactElement => (
  <button
    className={`w-full rounded-lg border p-4 text-left transition ${selected ? 'border-cyan-600 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-300'}`}
    onClick={onSelect}
  >
    <p className="font-bold text-slate-900">{team.name}</p>
    <p className="mt-1 text-sm text-slate-500">{team.description || 'No description'}</p>
    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-cyan-700">
      {team.members.length} members
    </p>
  </button>
);
