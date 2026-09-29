import type { ReactElement } from 'react';
import { useState } from 'react';
import { useProjectMemberMutation } from '../features/projects';
import type { Project } from '../types/project';
import { Users, UserPlus, Trash2, UserCheck } from 'lucide-react';

export const ProjectMemberList = ({
  project,
  onChanged,
}: {
  project: Project;
  onChanged: (project: Project) => void;
}): ReactElement => {
  const [userId, setUserId] = useState('');
  const mutation = useProjectMemberMutation(project._id);

  const memberName = (member: Project['members'][number]) =>
    typeof member === 'string' ? member : `${member.name} (${member.email})`;

  return (
    <section className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Project Members & Contributors</h2>
            <p className="text-xs text-surface-400">Assigned engineering squad members on this project</p>
          </div>
        </div>
        <span className="badge-surface">{project.members.length} members</span>
      </div>

      <div className="flex gap-3">
        <input
          className="input flex-1"
          placeholder="Enter User ID to invite..."
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
        <button
          className="button flex items-center gap-1.5"
          disabled={!userId.trim() || mutation.isPending}
          onClick={() =>
            void mutation.mutateAsync({ userId }).then((updated) => {
              onChanged(updated);
              setUserId('');
            })
          }
        >
          <UserPlus className="w-4 h-4" />
          <span>{mutation.isPending ? 'Adding...' : 'Add Member'}</span>
        </button>
      </div>

      <ul className="space-y-2 divide-y divide-surface-800/40">
        {project.members.map((member) => {
          const id = typeof member === 'string' ? member : member._id;
          return (
            <li
              className="flex items-center justify-between rounded-xl bg-surface-900/50 border border-surface-800/80 p-3.5 hover:border-surface-700 transition-colors"
              key={id}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-500/20 border border-brand-500/30 grid place-items-center text-xs font-bold text-brand-300">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">{memberName(member)}</span>
              </div>
              <button
                className="p-1.5 text-surface-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                onClick={() => void mutation.mutateAsync({ userId: id, remove: true }).then(onChanged)}
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};