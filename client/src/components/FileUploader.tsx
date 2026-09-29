import { useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import { useUploadAttachment } from '../features/attachments';
import type { AttachmentEntityType } from '../types/attachment';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const allowed = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'zip']);

export const FileUploader = ({
  entityType,
  entityId,
  onUploaded,
}: {
  entityType: AttachmentEntityType;
  entityId: string;
  onUploaded?: (file: File) => void;
}): ReactElement => {
  const input = useRef<HTMLInputElement>(null);
  const upload = useUploadAttachment(entityType, entityId);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.toLowerCase().split('.').pop() ?? '';
    if (!allowed.has(extension) || file.size > 10 * 1024 * 1024) {
      setMessage('Use an allowed file type up to 10 MB.');
      return;
    }
    setMessage('Uploading file...');
    setProgress(0);
    try {
      await upload.mutateAsync({ file, onProgress: setProgress });
      setProgress(100);
      setMessage('Upload complete.');
      onUploaded?.(file);
    } catch {
      setMessage('Upload failed. Please try again.');
    } finally {
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={input}
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip"
        onChange={(event) => void choose(event)}
      />
      <button
        className="button-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
        type="button"
        disabled={upload.isPending}
        onClick={() => input.current?.click()}
      >
        {upload.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" /> : <Upload className="w-3.5 h-3.5" />}
        <span>{upload.isPending ? 'Uploading...' : 'Attach File'}</span>
      </button>

      {upload.isPending && (
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-800">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {message && (
        <p
          className={`text-xs flex items-center gap-1 font-mono ${
            message.includes('failed') || message.includes('Use') ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {message.includes('failed') || message.includes('Use') ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
};