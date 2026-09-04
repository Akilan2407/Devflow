import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import type { OrganizationMember } from '../types/organization';

export const MembersPage = (): ReactElement => {
  const { id } = useParams();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  useEffect(() => {
    void apiClient
      .get<{ data: OrganizationMember[] }>(`/organizations/${id}/members`)
      .then((response) => setMembers(response.data.data));
  }, [id]);
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <div className="mt-6 divide-y">
          {members.map((member) => (
            <div className="flex items-center justify-between py-4" key={member.userId._id}>
              <div>
                <p className="font-semibold text-slate-900">{member.userId.name}</p>
                <p className="text-sm text-slate-500">{member.userId.email}</p>
              </div>
              <span className="text-sm font-medium text-cyan-700">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
