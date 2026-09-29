import type { ReactElement } from 'react';
import type { Message as MessageType } from '../types/message';
import { AttachmentList } from './AttachmentList';

type Props = {
  message: MessageType;
  currentUserId?: string;
  onEdit: (message: MessageType) => void;
  onDelete: (id: string) => void;
};
const senderName = (sender: MessageType['senderId']): string =>
  typeof sender === 'string' ? 'Squad member' : sender.name;
const senderId = (sender: MessageType['senderId']): string =>
  typeof sender === 'string' ? sender : sender._id;

export const Message = ({
  message,
  currentUserId,
  onEdit,
  onDelete,
}: Props): ReactElement => {
  const own = senderId(message.senderId) === currentUserId;

  return (
    <article className={`flex gap-3 mb-3 ${own ? 'flex-row-reverse text-right' : ''}`}>
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${
          own
            ? 'bg-gradient-to-tr from-brand-500 to-accent-indigo text-white'
            : 'bg-surface-800 text-brand-300 border border-surface-700'
        }`}
      >
        {senderName(message.senderId).slice(0, 2).toUpperCase()}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-xs ${
          own
            ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none'
            : 'bg-[#121B2B] text-slate-100 border border-surface-800 rounded-tl-none'
        }`}
      >
        <div className="mb-1 flex items-center gap-2 opacity-75 font-mono text-[10px]">
          <span className="font-semibold">{senderName(message.senderId)}</span>
          <time dateTime={message.createdAt}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>

        {message.content && (
          <p className="whitespace-pre-wrap break-words text-left leading-relaxed">
            {message.content}
          </p>
        )}

        {message.attachments.map((attachment) => (
          <a
            className="mt-2 block text-left underline font-mono text-[11px] text-brand-300 hover:text-white"
            href={attachment.url}
            key={attachment.url}
            target="_blank"
            rel="noreferrer"
          >
            📎 {attachment.name}
          </a>
        ))}

        <AttachmentList entityType="CHAT" entityId={message._id} />

        {own && (
          <div className="mt-2 flex justify-end gap-2 text-[10px] opacity-75 font-semibold">
            <button type="button" className="hover:underline" onClick={() => onEdit(message)}>
              Edit
            </button>
            <button
              type="button"
              className="hover:underline text-rose-200"
              onClick={() => onDelete(message._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

