import type { ReactElement } from 'react';
import { useState } from 'react';
import { useProjectMemberMutation } from '../features/projects';
import type { Project } from '../types/project';

export const ProjectMemberList = ({ project, onChanged }: { project: Project; onChanged: (project: Project) => void }): ReactElement => {
  const [userId, setUserId] = useState('');
  const mutation = useProjectMemberMutation(project._id);
  const memberName = (member: Project['members'][number]) => typeof member === 'string' ? member : `${member.name} (${member.email})`;
  return <section className="rounded-xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Project members</h2><div className="mt-4 flex gap-3"><input className="input max-w-md" placeholder="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} /><button className="button max-w-fit" onClick={() => void mutation.mutateAsync({ userId }).then((updated) => { onChanged(updated); setUserId(''); })}>Add member</button></div><ul className="mt-5 space-y-2">{project.members.map((member) => { const id = typeof member === 'string' ? member : member._id; return <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700" key={id}><span>{memberName(member)}</span><button className="font-semibold text-red-600" onClick={() => void mutation.mutateAsync({ userId: id, remove: true }).then(onChanged)}>Remove</button></li>; })}</ul></section>;
};