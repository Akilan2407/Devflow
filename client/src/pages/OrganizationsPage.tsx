import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { useOrganizationStore } from '../stores/organization.store';
import type { Organization } from '../types/organization';

export const OrganizationsPage = (): ReactElement => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const selectedOrganization = useOrganizationStore((state) => state.selectedOrganization);
  const selectOrganization = useOrganizationStore((state) => state.selectOrganization);

  useEffect(() => {
    void apiClient.get<{ data: Organization[] }>('/organizations').then((response) => {
      setOrganizations(response.data.data);
      if (!selectedOrganization && response.data.data[0]) selectOrganization(response.data.data[0]);
    });
  }, [selectOrganization, selectedOrganization]);

  const create = async (): Promise<void> => {
    if (!name || !slug) return;
    const response = await apiClient.post<{ data: Organization }>('/organizations', { name, slug });
    setOrganizations((current) => [...current, response.data.data]);
    selectOrganization(response.data.data);
    setName('');
    setSlug('');
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">DevFlow</p>
            <h1 className="text-3xl font-bold">Organizations</h1>
          </div>
          <select
            className="input max-w-xs"
            value={selectedOrganization?._id ?? ''}
            onChange={(event) =>
              selectOrganization(
                organizations.find((item) => item._id === event.target.value) ?? null,
              )
            }
          >
            <option value="">Select organization</option>
            {organizations.map((organization) => (
              <option key={organization._id} value={organization._id}>
                {organization.name}
              </option>
            ))}
          </select>
        </header>
        {selectedOrganization && (
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">{selectedOrganization.name}</h2>
            <p className="mt-2 text-slate-500">
              {selectedOrganization.description || 'No description yet.'}
            </p>
            <nav className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                className="button max-w-fit"
                to={`/organizations/${selectedOrganization._id}/teams`}
              >
                Teams
              </Link>
              <Link className="button max-w-fit" to="/projects">
                Projects
              </Link>
              <Link
                className="button max-w-fit"
                to={`/organizations/${selectedOrganization._id}/members`}
              >
                Members
              </Link>
              <Link
                className="button max-w-fit"
                to={`/organizations/${selectedOrganization._id}/settings`}
              >
                Settings
              </Link>
              <Link
                className="button max-w-fit"
                to={`/organizations/${selectedOrganization._id}/roles`}
              >
                Role management
              </Link>
            </nav>
          </section>
        )}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Create organization</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              className="input max-w-xs"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              className="input max-w-xs"
              placeholder="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
            <button className="button max-w-fit" onClick={() => void create()}>
              Create
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
