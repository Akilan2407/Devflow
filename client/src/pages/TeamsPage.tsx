import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { TeamCard } from '../components/TeamCard';
import { TeamCreationForm } from '../components/TeamCreationForm';
import { TeamDetails } from '../components/TeamDetails';
import type { Team } from '../types/team';

export const TeamsPage = (): ReactElement => {
  const { organizationId } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (!organizationId) return;
    void apiClient
      .get<{ data: { items: Team[] } }>(`/organizations/${organizationId}/teams`)
      .then((response) => {
        setTeams(response.data.data.items);
        setSelectedId(response.data.data.items[0]?._id ?? '');
      });
  }, [organizationId]);

  const selected = teams.find((team) => team._id === selectedId);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-surface-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="badge-cyan">ORGANIZATION SQUADS</span>
          <span className="text-xs text-slate-500 font-mono">Cross-Functional</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Engineering Squads & Teams
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Structure teams, assign members, and allocate sprint backlogs.
        </p>
      </div>

      {organizationId && (
        <TeamCreationForm
          organizationId={organizationId}
          onCreated={(team) => {
            setTeams((current) => [...current, team]);
            setSelectedId(team._id);
          }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Squads ({teams.length})
          </h2>
          {teams.length === 0 ? (
            <div className="glass-panel p-6 text-center text-xs text-slate-500">
              No squads created yet.
            </div>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                selected={team._id === selectedId}
                onSelect={() => setSelectedId(team._id)}
              />
            ))
          )}
        </div>

        <div>
          {selected ? (
            <TeamDetails
              team={selected}
              onChanged={(team) =>
                setTeams((current) => current.map((item) => (item._id === team._id ? team : item)))
              }
              onDeleted={() => {
                setTeams((current) => current.filter((team) => team._id !== selected._id));
                setSelectedId('');
              }}
            />
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400">
              <p>Select a squad on the left to view member roster and settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

