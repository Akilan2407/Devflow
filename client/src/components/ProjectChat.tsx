import { useEffect, useState, type ReactElement } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { getSocket } from '../lib/socket';
import { useDeleteMessage, useMessages, useUpdateMessage } from '../features/messages';
import type { Message as MessageType } from '../types/message';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { OnlineUsers } from './OnlineUsers';
import { TypingIndicator } from './TypingIndicator';

type PresenceUser = { userId: string; name: string };
export const ProjectChat = ({ projectId }: { projectId: string }): ReactElement => {
  const currentUser = useAuthStore((state) => state.user);
  const history = useMessages(projectId);
  const update = useUpdateMessage(projectId);
  const remove = useDeleteMessage(projectId);
  const [online, setOnline] = useState<Record<string, PresenceUser>>({});
  const [typing, setTyping] = useState<Record<string, string>>({});
  useEffect(() => {
    const socket = getSocket();
    const onOnline = (user: PresenceUser) => setOnline((current) => ({ ...current, [user.userId]: user }));
    const onOffline = ({ userId }: { userId: string }) => setOnline((current) => { const next = { ...current }; delete next[userId]; return next; });
    const onTyping = (user: PresenceUser) => setTyping((current) => ({ ...current, [user.userId]: user.name }));
    const onStopped = ({ userId }: { userId: string }) => setTyping((current) => { const next = { ...current }; delete next[userId]; return next; });
    socket.on('USER_ONLINE', onOnline); socket.on('USER_OFFLINE', onOffline); socket.on('USER_TYPING', onTyping); socket.on('USER_STOPPED_TYPING', onStopped);
    return () => { socket.off('USER_ONLINE', onOnline); socket.off('USER_OFFLINE', onOffline); socket.off('USER_TYPING', onTyping); socket.off('USER_STOPPED_TYPING', onStopped); };
  }, [projectId]);
  const edit = (message: MessageType) => { const content = window.prompt('Edit message', message.content); if (content?.trim() && content.trim() !== message.content) void update.mutateAsync({ id: message._id, content: content.trim() }); };
  const pages = history.data?.pages ?? [];
  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-200"><div className="flex items-center justify-between px-4 pt-4"><div><h2 className="text-lg font-bold text-slate-900">Project chat</h2><p className="text-xs text-slate-500">Talk with the project team</p></div><span className="text-xs text-slate-500">{Object.keys(online).length} online</span></div><OnlineUsers users={Object.values(online)} /></header><MessageList projectId={projectId} pages={pages} hasNextPage={Boolean(history.hasNextPage)} isFetchingNextPage={history.isFetchingNextPage} fetchNextPage={() => void history.fetchNextPage()} currentUserId={currentUser?._id} onEdit={edit} onDelete={(id) => void remove.mutateAsync(id)} /><TypingIndicator names={Object.values(typing)} /><MessageInput projectId={projectId} /></section>;
};
