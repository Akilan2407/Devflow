import type { ReactElement } from 'react';
import { useDeleteAttachment } from '../features/attachments';
import type { AttachmentEntityType } from '../types/attachment';
export const DeleteAttachment = ({ id, entityType, entityId }: { id: string; entityType: AttachmentEntityType; entityId: string }): ReactElement => { const remove = useDeleteAttachment(entityType, entityId); return <button className="text-xs font-semibold text-red-600" disabled={remove.isPending} onClick={() => void remove.mutateAsync(id)}>Delete</button>; };