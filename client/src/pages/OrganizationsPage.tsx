import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { useOrganizationStore } from '../stores/organization.store';
import type { Organization } from '../types/organization';

export const OrganizationsPage = (): ReactElement => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const selectedOrganization = useOrganizationStore((state) => state.selectedOrganization);
  const selectOrganization = useOrganizationStore((state) => state.selectOrganization);

  useEffect(() => {
    setLoading(true);
    void apiClient
      .get<{ data: Organization[] }>('/organizations')
      .then((response) => {
        setOrganizations(response.data.data);
        if (!selectedOrganization && response.data.data[0]) selectOrganization(response.data.data[0]);
      })
      .finally(() => setLoading(false));
  }, [selectOrganization, selectedOrganization]);

  const create = async (): Promise<void> => {
    if (!name.trim() || !slug.trim()) return;
    setCreating(true);
    try {
      const response = await apiClient.post<{ data: Organization }>('/organizations', {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
      });
      setOrganizations((current) => [...current, response.data.data]);
      selectOrganization(response.data.data);
      setName('');
      setSlug('');
    } catch {
      // Error handled by global interceptors
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-cyan">MULTI-TENANT HUB</span>
            <span className="text-xs text-slate-500 font-mono">Isolated Schemas</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Enterprise Workspaces
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Select or provision organizations to manage teams, projects, and CI/CD pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Active Workspace:</label>
          <select
            className="input max-w-xs font-semibold text-brand-300"
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
                {organization.name} ({organization.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Organization Spotlight Panel */}
      {selectedOrganization && (
        <section className="glass-panel p-6 sm:p-8 relative overflow-hidden border border-brand-500/30">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-extrabold text-xl shadow-lg shadow-brand-500/20">
                {selectedOrganization.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{selectedOrganization.name}</h2>
                  <span className="badge-emerald">Active Scope</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 font-mono">slug: {selectedOrganization.slug}</p>
                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  {selectedOrganization.description || 'Enterprise collaboration workspace with automated sprint intelligence.'}
                </p>
              </div>
            </div>

            <Link
              to="/projects"
              className="button px-6 shadow-md shadow-brand-500/20"
            >
              <span>Launch Projects</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Quick Nav Action Links */}
          <nav className="mt-8 flex flex-wrap gap-2.5 pt-6 border-t border-surface-800">
            <Link
              className="button-secondary text-xs"
              to={`/organizations/${selectedOrganization._id}/teams`}
            >
              👥 Teams
            </Link>
            <Link className="button-secondary text-xs" to="/projects">
              📁 Projects
            </Link>
            <Link
              className="button-secondary text-xs"
              to={`/organizations/${selectedOrganization._id}/members`}
            >
              👤 Members
            </Link>
            <Link
              className="button-secondary text-xs"
              to={`/organizations/${selectedOrganization._id}/settings`}
            >
              ⚙️ Workspace Settings
            </Link>
            <Link
              className="button-secondary text-xs"
              to={`/organizations/${selectedOrganization._id}/roles`}
            >
              🛡️ Role Management
            </Link>
          </nav>
        </section>
      )}

      {/* All Available Organizations Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>All Provisioned Workspaces</span>
            <span className="rounded-full bg-surface-800 px-2 py-0.5 text-xs text-slate-400">
              {organizations.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card animate-pulse h-40 rounded-xl" />
            ))}
          </div>
        ) : organizations.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <p className="text-slate-400">No organizations found. Create your first workspace below to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {organizations.map((org) => {
              const isSelected = selectedOrganization?._id === org._id;
              return (
                <div
                  key={org._id}
                  onClick={() => selectOrganization(org)}
                  className={`glass-card cursor-pointer relative overflow-hidden transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-500/50 bg-[#142036] shadow-lg shadow-brand-500/10'
                      : 'hover:border-surface-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-800 text-brand-400 font-bold border border-surface-700">
                        {org.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{org.name}</h3>
                        <p className="text-xs font-mono text-slate-400">{org.slug}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="badge-cyan text-[10px]">SELECTED</span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2">
                    {org.description || 'Enterprise collaboration workspace.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">ID: {org._id.substring(0, 8)}...</span>
                    <span className="font-semibold text-brand-400 flex items-center gap-1">
                      Manage <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Provision New Organization Section */}
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-emerald">TENANT PROVISIONING</span>
        </div>
        <h2 className="text-xl font-bold text-white">Create New Workspace</h2>
        <p className="mt-1 text-xs text-slate-400">
          Initialize a new isolated organization workspace with dedicated access control and storage quotas.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name</label>
            <input
              className="input"
              placeholder="Name (e.g. Acme Engineering)"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slug) {
                  setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                }
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Workspace Slug</label>
            <input
              className="input font-mono text-xs"
              placeholder="slug (e.g. acme-corp)"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              className="button w-full sm:w-auto h-[42px]"
              disabled={creating || !name.trim() || !slug.trim()}
              onClick={() => void create()}
            >
              {creating ? 'Provisioning...' : 'Create Organization'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

