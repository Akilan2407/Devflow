import type { ReactElement } from 'react';
import type { Message as MessageType } from '../types/message';

type Props = { message: MessageType; currentUserId?: string; onEdit: (message: MessageType) => void; onDelete: (id: string) => void };
const senderName = (sender: MessageType['senderId']): string => typeof sender === 'string' ? 'Project member' : sender.name;
const senderId = (sender: MessageType['senderId']): string => typeof sender === 'string' ? sender : sender._id;

export const Message = ({ message, currentUserId, onEdit, onDelete }: Props): ReactElement => {
  const own = senderId(message.senderId) === currentUserId;
  return <article className={`flex gap-3 ${own ? 'flex-row-reverse text-right' : ''}`}>
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">{senderName(message.senderId).slice(0, 1).toUpperCase()}</div>
    <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${own ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <div className="mb-1 flex items-center gap-2 text-xs opacity-70"><span>{senderName(message.senderId)}</span><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>
      {message.content && <p className="whitespace-pre-wrap break-words text-left text-sm">{message.content}</p>}
      {message.attachments.map((attachment) => <a className="mt-2 block text-left text-sm underline" href={attachment.url} key={attachment.url} target="_blank" rel="noreferrer">{attachment.name}</a>)}
      {own && <div className="mt-2 flex justify-end gap-2 text-xs opacity-80"><button type="button" onClick={() => onEdit(message)}>Edit</button><button type="button" onClick={() => onDelete(message._id)}>Delete</button></div>}
    </div>
  </article>;
};
