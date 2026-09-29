import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../features/notifications';
import type { Notification } from '../types/notification';

export const NotificationDropdown = ({
  items,
  onClose,
}: {
  items: Notification[];
  onClose: () => void;
}): ReactElement => {
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  return (
    <div className="absolute right-0 top-12 z-50 w-84 overflow-hidden rounded-2xl border border-surface-700 bg-[#0E1522] text-left shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-surface-800 px-4 py-3 bg-[#0A0F1A]">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Notifications</span>
        <button
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
          type="button"
          onClick={() => void markAll.mutateAsync()}
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-surface-800">
        {items.length ? (
          items.slice(0, 8).map((item) => (
            <button
              className={`block w-full p-4 text-left transition hover:bg-surface-800/60 ${
                item.isRead ? 'opacity-50' : 'bg-brand-500/5'
              }`}
              key={item._id}
              type="button"
              onClick={() => {
                if (!item.isRead) void markRead.mutateAsync(item._id);
                onClose();
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-white">{item.title}</p>
                {!item.isRead && <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0 mt-1" />}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">{item.message}</p>
              <time className="mt-2 block text-[10px] text-slate-500 font-mono">
                {new Date(item.createdAt).toLocaleString()}
              </time>
            </button>
          ))
        ) : (
          <p className="p-8 text-center text-xs text-slate-500">You are all caught up.</p>
        )}
      </div>

      <Link
        className="block border-t border-surface-800 bg-[#0A0F1A] px-4 py-2.5 text-center text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
        to="/notifications"
        onClick={onClose}
      >
        View all notifications →
      </Link>
    </div>
  );
};

