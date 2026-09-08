import { Router } from 'express';
import { deleteAttachment, downloadAttachment, listAttachments, uploadAttachment } from '../controllers/attachment.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { attachmentUpload } from '../middleware/attachment-upload.middleware.js';

export const attachmentRouter = Router();
attachmentRouter.use(requireAuth);
attachmentRouter.post('/', attachmentUpload.single('file'), uploadAttachment);
attachmentRouter.get('/:id/download', downloadAttachment);
attachmentRouter.get('/:entityType/:entityId', listAttachments);
attachmentRouter.delete('/:id', deleteAttachment);