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
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Workspace</p>
          <h1 className="text-3xl font-bold">Teams</h1>
        </header>
        {organizationId && (
          <TeamCreationForm
            organizationId={organizationId}
            onCreated={(team) => {
              setTeams((current) => [...current, team]);
              setSelectedId(team._id);
            }}
          />
        )}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            {teams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                selected={team._id === selectedId}
                onSelect={() => setSelectedId(team._id)}
              />
            ))}
          </div>
          {selected && (
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
          )}
        </div>
      </div>
    </main>
  );
};
