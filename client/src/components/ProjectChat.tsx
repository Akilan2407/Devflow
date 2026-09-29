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
    const onOnline = (user: PresenceUser) =>
      setOnline((current) => ({ ...current, [user.userId]: user }));
    const onOffline = ({ userId }: { userId: string }) =>
      setOnline((current) => {
        const next = { ...current };
        delete next[userId];
        return next;
      });
    const onTyping = (user: PresenceUser) =>
      setTyping((current) => ({ ...current, [user.userId]: user.name }));
    const onStopped = ({ userId }: { userId: string }) =>
      setTyping((current) => {
        const next = { ...current };
        delete next[userId];
        return next;
      });
    socket.on('USER_ONLINE', onOnline);
    socket.on('USER_OFFLINE', onOffline);
    socket.on('USER_TYPING', onTyping);
    socket.on('USER_STOPPED_TYPING', onStopped);
    return () => {
      socket.off('USER_ONLINE', onOnline);
      socket.off('USER_OFFLINE', onOffline);
      socket.off('USER_TYPING', onTyping);
      socket.off('USER_STOPPED_TYPING', onStopped);
    };
  }, [projectId]);

  const edit = (message: MessageType) => {
    const content = window.prompt('Edit message', message.content);
    if (content?.trim() && content.trim() !== message.content)
      void update.mutateAsync({ id: message._id, content: content.trim() });
  };
  const pages = history.data?.pages ?? [];

  return (
    <section className="glass-panel overflow-hidden border border-surface-800 shadow-2xl">
      <header className="border-b border-surface-800 bg-[#0A0F1A]/80 px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <h2 className="text-sm font-bold text-white">Squad Real-Time Chat</h2>
            <span className="badge-cyan text-[10px]">WEBSOCKET</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {Object.keys(online).length} online
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-surface-800/60">
          <OnlineUsers users={Object.values(online)} />
        </div>
      </header>

      <div className="bg-[#090D16]/50 p-4 min-h-[340px]">
        <MessageList
          projectId={projectId}
          pages={pages}
          hasNextPage={Boolean(history.hasNextPage)}
          isFetchingNextPage={history.isFetchingNextPage}
          fetchNextPage={() => void history.fetchNextPage()}
          currentUserId={currentUser?._id}
          onEdit={edit}
          onDelete={(id) => void remove.mutateAsync(id)}
        />
        <TypingIndicator names={Object.values(typing)} />
      </div>

      <div className="border-t border-surface-800 bg-[#0E1522]">
        <MessageInput projectId={projectId} />
      </div>
    </section>
  );
};

