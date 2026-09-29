import { useState, type ReactElement } from 'react';
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../features/notifications';

export const NotificationPage = (): ReactElement => {
  const [page, setPage] = useState(1);
  const notifications = useNotifications(page, 20);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();
  const data = notifications.data;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-cyan">REAL-TIME ACTIVITY</span>
            <span className="text-xs text-slate-500 font-mono">WebSocket Sync</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Notifications & Audit Events
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time event stream of task updates, sprint changes, and team mentions.
          </p>
        </div>

        <button
          className="button-secondary text-xs"
          type="button"
          onClick={() => void markAll.mutateAsync()}
        >
          Mark All as Read
        </button>
      </div>

      <section className="glass-panel overflow-hidden">
        {notifications.isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-surface-800/50 animate-pulse" />
            ))}
          </div>
        ) : data?.items.length ? (
          <div className="divide-y divide-surface-800">
            {data.items.map((item) => (
              <article
                className={`flex items-start gap-4 p-5 transition hover:bg-surface-800/40 ${
                  item.isRead ? 'opacity-60' : 'bg-brand-500/5'
                }`}
                key={item._id}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    item.isRead ? 'bg-surface-600' : 'bg-brand-400 shadow-sm shadow-brand-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-white text-sm">{item.title}</h2>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  <time className="mt-2 block text-[10px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                  {!item.isRead && (
                    <button
                      className="button-secondary text-[11px] py-1 px-2.5"
                      type="button"
                      onClick={() => void markRead.mutateAsync(item._id)}
                    >
                      Read
                    </button>
                  )}
                  <button
                    className="button-danger text-[11px] py-1 px-2.5"
                    type="button"
                    onClick={() => void remove.mutateAsync(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-slate-400">
            <p className="text-base font-semibold text-white">You're all caught up!</p>
            <p className="mt-1 text-xs text-slate-500">No unread notifications or security alerts.</p>
          </div>
        )}
      </section>

      {data && data.pagination.pages > 1 && (
        <nav className="flex items-center justify-between pt-4">
          <button
            className="button-secondary text-xs"
            disabled={page <= 1}
            type="button"
            onClick={() => setPage((value) => value - 1)}
          >
            ← Previous
          </button>
          <span className="text-xs font-mono text-slate-400">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            className="button-secondary text-xs"
            disabled={page >= data.pagination.pages}
            type="button"
            onClick={() => setPage((value) => value + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
};

