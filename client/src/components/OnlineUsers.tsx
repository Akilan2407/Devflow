import type { ReactElement } from 'react';
type User = { userId: string; name: string };
export const OnlineUsers = ({ users }: { users: User[] }): ReactElement => <div className="flex flex-wrap gap-2 px-4 py-3 text-xs text-slate-600"><span className="font-semibold">Online</span>{users.length ? users.map((user) => <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700" key={user.userId}>{user.name}</span>) : <span>Only you</span>}</div>;
