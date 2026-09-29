import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { OrganizationMember } from '../types/organization';

const roleBadgeMap: Record<string, string> = {
  ADMIN: 'badge-rose',
  MEMBER: 'badge-cyan',
  VIEWER: 'badge-slate',
};

export const MembersPage = (): ReactElement => {
  const { id } = useParams();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void apiClient
      .get<{ data: OrganizationMember[] }>(`/organizations/${id}/members`)
      .then((response) => setMembers(response.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-surface-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="badge-cyan">RBAC ACCESS CONTROL</span>
          <span className="text-xs text-slate-500 font-mono">Tenant Permissions</span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Organization Members & Roles
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          View and audit user access levels (ADMIN, MEMBER, VIEWER) for this organization workspace.
        </p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="border-b border-surface-800 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-white text-base">Active Roster ({members.length})</h2>
          <span className="text-xs font-mono text-slate-400">SOC2 Audit Log Active</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-surface-800/50 animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No members found.</div>
        ) : (
          <div className="divide-y divide-surface-800">
            {members.map((member) => (
              <div
                className="flex items-center justify-between px-6 py-4 hover:bg-surface-800/30 transition"
                key={member.userId._id}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500/20 to-accent-indigo/20 text-brand-400 font-bold border border-brand-500/30">
                    {member.userId.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{member.userId.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{member.userId.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={roleBadgeMap[member.role] || 'badge-slate'}>
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

