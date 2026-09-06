import { useEffect, useRef, useState, type ReactElement, type FormEvent } from 'react';
import { getSocket } from '../lib/socket';
import { useSendMessage } from '../features/messages';

type Props = { projectId: string; onSent?: () => void };
export const MessageInput = ({ projectId, onSent }: Props): ReactElement => {
  const [content, setContent] = useState('');
  const send = useSendMessage(projectId);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const typing = () => {
    const socket = getSocket();
    socket.emit('USER_TYPING', { projectId });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => socket.emit('USER_STOPPED_TYPING', { projectId }), 1200);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); const value = content.trim(); if (!value || send.isPending) return; await send.mutateAsync({ content: value }); setContent(''); onSent?.(); };
  return <form className="flex gap-2 border-t border-slate-200 p-3" onSubmit={(event) => void submit(event)}><textarea className="input min-h-11 resize-none py-2" value={content} placeholder="Write a message..." onChange={(event) => { setContent(event.target.value); typing(); }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit(event); } }} /><button className="button max-w-28 self-end" disabled={!content.trim() || send.isPending} type="submit">Send</button></form>;
};
