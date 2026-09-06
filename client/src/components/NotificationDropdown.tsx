import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../features/notifications';
import type { Notification } from '../types/notification';

export const NotificationDropdown = ({ items, onClose }: { items: Notification[]; onClose: () => void }): ReactElement => {
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  return <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><strong className="text-sm text-slate-900">Notifications</strong><button className="text-xs font-semibold text-cyan-700" type="button" onClick={() => void markAll.mutateAsync()}>Mark all read</button></div><div className="max-h-96 overflow-y-auto">{items.length ? items.slice(0, 8).map((item) => <button className={`block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${item.isRead ? 'opacity-60' : ''}`} key={item._id} type="button" onClick={() => { if (!item.isRead) void markRead.mutateAsync(item._id); onClose(); }}><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-slate-600">{item.message}</p><time className="mt-1 block text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</time></button>) : <p className="p-6 text-center text-sm text-slate-500">You are all caught up.</p>}</div><Link className="block border-t border-slate-200 px-4 py-3 text-center text-sm font-semibold text-cyan-700" to="/notifications" onClick={onClose}>View all notifications</Link></div>;
};
