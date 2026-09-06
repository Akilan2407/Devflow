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
    const refresh = () => { void client.invalidateQueries({ queryKey: notificationKeys.all }); };
    socket.on('NOTIFICATION_CREATED', refresh);
    return () => { socket.off('NOTIFICATION_CREATED', refresh); };
  }, [client, token]);
  if (!token) return null;
  return <div className="relative"><button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-lg text-slate-700 hover:bg-slate-50" type="button" onClick={() => setOpen((value) => !value)}>🔔<UnreadCounter count={notifications.data?.unread ?? 0} /></button>{open && <NotificationDropdown items={notifications.data?.items ?? []} onClose={() => setOpen(false)} />}</div>;
};
