import type { ReactElement } from 'react';
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useComments, useCreateComment, useDeleteComment, useUpdateComment, type CommentEntityType } from '../features/comments';
import type { Comment, CommentUser } from '../types/comment';
import { MessageSquare, Send, Trash2, Edit2, X } from 'lucide-react';

const userId = (user: CommentUser) => (typeof user === 'string' ? user : user._id);
const userName = (user: CommentUser) => (typeof user === 'string' ? user : user.name);
const avatar = (user: CommentUser) => (typeof user === 'string' ? user.slice(0, 1).toUpperCase() : user.avatar);
const mentionIds = (content: string) => [...content.matchAll(/@([a-f\d]{24})/gi)].map((match) => match[1]);

export const CommentSection = ({
  entityType,
  entityId,
}: {
  entityType: CommentEntityType;
  entityId: string;
}): ReactElement => {
  const currentUser = useAuthStore((state) => state.user);
  const comments = useComments(entityType, entityId);
  const create = useCreateComment(entityType, entityId);
  const update = useUpdateComment(entityType, entityId);
  const remove = useDeleteComment(entityType, entityId);
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const items = comments.data ?? [];

  const submit = async () => {
    if (!content.trim()) return;
    const mentions = mentionIds(content);
    if (editing) {
      await update.mutateAsync({ id: editing, content, mentions });
      setEditing(null);
    } else {
      await create.mutateAsync({ content, mentions });
    }
    setContent('');
  };

  const edit = (comment: Comment) => {
    setEditing(comment._id);
    setContent(comment.content);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-400" />
          Discussions & Comments
        </h3>
        <span className="badge-surface">{items.length}</span>
      </div>

      <div className="space-y-2">
        <textarea
          className="input w-full min-h-20 text-sm resize-none"
          placeholder="Write a comment... (use @mentions)"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="flex items-center justify-between">
          {editing ? (
            <button
              className="text-xs font-semibold text-surface-400 hover:text-surface-200 flex items-center gap-1"
              onClick={() => {
                setEditing(null);
                setContent('');
              }}
            >
              <X className="w-3.5 h-3.5" /> Cancel edit
            </button>
          ) : <div />}
          <button
            className="button flex items-center gap-1.5 text-xs py-1.5 px-3"
            onClick={() => void submit()}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{editing ? 'Update' : 'Post'}</span>
          </button>
        </div>
      </div>

      <ul className="space-y-3 pt-2">
        {items.map((comment) => {
          const mine = currentUser && userId(comment.authorId) === currentUser._id;
          return (
            <li
              className="glass-card rounded-xl p-3.5 flex gap-3 items-start transition-colors"
              key={comment._id}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-500/20 text-xs font-bold text-brand-300 border border-brand-500/30">
                {typeof comment.authorId !== 'string' && comment.authorId.avatar ? (
                  <img className="h-full w-full object-cover" src={comment.authorId.avatar} alt="" />
                ) : (
                  avatar(comment.authorId)
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-semibold text-white">{userName(comment.authorId)}</strong>
                    <time className="text-[11px] text-surface-400 font-mono" dateTime={comment.createdAt}>
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  {mine && (
                    <div className="flex items-center gap-1.5">
                      <button
                        className="text-surface-400 hover:text-brand-300 p-1"
                        onClick={() => edit(comment)}
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        className="text-surface-400 hover:text-rose-400 p-1"
                        onClick={() => void remove.mutateAsync(comment._id)}
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-1.5 whitespace-pre-wrap text-xs text-surface-200 leading-relaxed">
                  {comment.content.split(/(@\w+)/g).map((part, index) =>
                    part.startsWith('@') ? (
                      <strong className="text-brand-400 font-mono" key={index}>
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};