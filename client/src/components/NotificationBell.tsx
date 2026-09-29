import { useEffect, useState, type ReactElement } from 'react';
import { useNotifications, notificationKeys } from '../features/notifications';
import { getSocket } from '../lib/socket';
import { useAuthStore } from '../stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationDropdown } from './NotificationDropdown';
import { UnreadCounter } from './UnreadCounter';

export const NotificationBell = (): ReactElement | null => {
  const token = useAuthStore((state) => state.accessToken);
  const client = useQueryClient();
  const notifications = useNotifications(1, 20, Boolean(token));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    const refresh = () => {
      void client.invalidateQueries({ queryKey: notificationKeys.all });
    };
    socket.on('NOTIFICATION_CREATED', refresh);
    return () => {
      socket.off('NOTIFICATION_CREATED', refresh);
    };
  }, [client, token]);

  if (!token) return null;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-surface-800 bg-[#0E1522] text-slate-300 hover:border-brand-500/50 hover:text-white transition"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <UnreadCounter count={notifications.data?.unread ?? 0} />
      </button>
      {open && (
        <NotificationDropdown
          items={notifications.data?.items ?? []}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

