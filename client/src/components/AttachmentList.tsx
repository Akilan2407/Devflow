import type { ReactElement } from 'react';
import { downloadAttachment, useAttachments, useDeleteAttachment } from '../features/attachments';
import type { AttachmentEntityType } from '../types/attachment';
import { AttachmentPreview } from './AttachmentPreview';
import { Download, Trash2, Paperclip } from 'lucide-react';

const size = (bytes: number): string =>
  bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const AttachmentList = ({
  entityType,
  entityId,
}: {
  entityType: AttachmentEntityType;
  entityId: string;
}): ReactElement => {
  const attachments = useAttachments(entityType, entityId);
  const remove = useDeleteAttachment(entityType, entityId);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-brand-400" />
          Attachments
        </h3>
        <span className="badge-surface text-[10px]">{attachments.data?.length ?? 0}</span>
      </div>

      {attachments.data?.length ? (
        <div className="space-y-2">
          {attachments.data.map((attachment) => (
            <article
              className="flex items-center gap-3 rounded-xl border border-surface-800 bg-surface-900/60 p-3 hover:border-surface-700 transition-colors"
              key={attachment._id}
            >
              <AttachmentPreview attachment={attachment} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{attachment.fileName}</p>
                <p className="text-[11px] text-surface-400 font-mono">
                  {size(attachment.fileSize)} ·{' '}
                  {typeof attachment.uploadedBy === 'string' ? 'Team Member' : attachment.uploadedBy.name} ·{' '}
                  {new Date(attachment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="p-1.5 text-surface-400 hover:text-brand-400 rounded-lg hover:bg-surface-800 transition-colors"
                  onClick={() => void downloadAttachment(attachment._id, attachment.fileName)}
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 text-surface-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  onClick={() => void remove.mutateAsync(attachment._id)}
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-xs text-surface-500 font-mono">No attachments attached.</p>
      )}
    </section>
  );
};