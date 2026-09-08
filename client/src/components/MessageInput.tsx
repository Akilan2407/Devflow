import { useEffect, useRef, useState, type ChangeEvent, type ReactElement, type FormEvent } from 'react';
import { getSocket } from '../lib/socket';
import { useSendMessage } from '../features/messages';
import { useUploadAttachment } from '../features/attachments';

type Props = { projectId: string; onSent?: () => void };
export const MessageInput = ({ projectId, onSent }: Props): ReactElement => {
  const [content, setContent] = useState(''); const [file, setFile] = useState<File>();
  const send = useSendMessage(projectId);
  const upload = useUploadAttachment('CHAT', '');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const typing = () => {
    const socket = getSocket();
    socket.emit('USER_TYPING', { projectId });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => socket.emit('USER_STOPPED_TYPING', { projectId }), 1200);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); const value = content.trim(); if ((!value && !file) || send.isPending) return; const message = await send.mutateAsync({ content: value }); if (file) await upload.mutateAsync({ file, targetId: message._id }); setContent(''); setFile(undefined); onSent?.(); };
  const selectFile = (event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0]);
  return <form className="flex gap-2 border-t border-slate-200 p-3" onSubmit={(event) => void submit(event)}><div className="min-w-0 flex-1"><textarea className="input min-h-11 resize-none py-2" value={content} placeholder="Write a message..." onChange={(event) => { setContent(event.target.value); typing(); }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit(event); } }} />{file && <p className="mt-1 truncate text-xs text-slate-500">{file.name}</p>}</div><label className="button max-w-fit self-end cursor-pointer">Attach<input className="hidden" type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip" onChange={selectFile} /></label><button className="button max-w-28 self-end" disabled={(!content.trim() && !file) || send.isPending} type="submit">Send</button></form>;
};
