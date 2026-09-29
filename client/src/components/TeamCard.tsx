import type { ReactElement } from 'react';
import type { Team } from '../types/team';

type Props = { team: Team; selected: boolean; onSelect: () => void };
export const TeamCard = ({ team, selected, onSelect }: Props): ReactElement => (
  <button
    className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
      selected
        ? 'border-brand-500 bg-[#16233B] shadow-lg shadow-brand-500/10'
        : 'border-surface-800 bg-[#0E1522] hover:border-surface-700 hover:bg-[#121B2B]'
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center justify-between">
      <p className="font-bold text-white text-sm">{team.name}</p>
      <span className="badge-cyan text-[10px]">{team.members.length} members</span>
    </div>
    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{team.description || 'No team description provided.'}</p>
  </button>
);

