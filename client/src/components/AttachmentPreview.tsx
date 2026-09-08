import { useEffect, useState, type ReactElement } from 'react';
import type { Attachment } from '../types/attachment';
import { previewAttachment } from '../features/attachments';

export const AttachmentPreview = ({ attachment }: { attachment: Attachment }): ReactElement => {
  const [url, setUrl] = useState<string>();
  useEffect(() => { let active = true; let objectUrl: string | undefined; if (attachment.mimeType.startsWith('image/') || attachment.mimeType === 'application/pdf') void previewAttachment(attachment._id).then((value) => { objectUrl = value; if (active) setUrl(value); else URL.revokeObjectURL(value); }); return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); }; }, [attachment._id, attachment.mimeType]);
  if (attachment.mimeType.startsWith('image/') && url) return <img className="max-h-40 rounded-lg object-contain" src={url} alt={attachment.fileName} />;
  if (attachment.mimeType === 'application/pdf' && url) return <iframe className="h-48 w-full rounded-lg border" src={url} title={attachment.fileName} />;
  return <span className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-xs font-bold uppercase text-slate-500">{attachment.fileExtension}</span>;
};