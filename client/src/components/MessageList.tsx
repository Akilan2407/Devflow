import { useEffect, useMemo, useRef, type ReactElement } from 'react';
import { Message } from './Message';
import type { Message as MessageType } from '../types/message';
import { markMessageRead } from '../features/messages';

type Props = { projectId: string; pages: { items: MessageType[]; hasMore: boolean }[]; hasNextPage: boolean; isFetchingNextPage: boolean; fetchNextPage: () => void; currentUserId?: string; onEdit: (message: MessageType) => void; onDelete: (id: string) => void };
export const MessageList = ({ projectId, pages, hasNextPage, isFetchingNextPage, fetchNextPage, currentUserId, onEdit, onDelete }: Props): ReactElement => {
  const container = useRef<HTMLDivElement>(null);
  const messages = useMemo(() => pages.flatMap((page) => page.items).reverse(), [pages]);
  useEffect(() => { void Promise.all(messages.filter((message) => !message.readBy.includes(currentUserId ?? '')).map((message) => markMessageRead(projectId, message._id))); }, [currentUserId, messages, projectId]);
  return <div className="flex min-h-72 flex-1 flex-col gap-4 overflow-y-auto p-4" ref={container} onScroll={(event) => { if (event.currentTarget.scrollTop < 80 && hasNextPage && !isFetchingNextPage) fetchNextPage(); }}>
    {isFetchingNextPage && <p className="text-center text-xs text-slate-400">Loading earlier messages...</p>}
    {!messages.length && <p className="m-auto text-sm text-slate-500">No messages yet.</p>}
    {messages.map((message) => <Message key={message._id} message={message} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />)}
  </div>;
};
