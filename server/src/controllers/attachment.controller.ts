import type { NextFunction, Request, Response } from 'express';
import { attachmentEntityTypes, type AttachmentEntityType } from '../models/attachment.model.js';
import { attachmentService } from '../services/attachment.service.js';
import type { AuthenticatedRequest } from '../types/auth.types.js';

const userId = (request: Request): string => (request as unknown as AuthenticatedRequest).user._id.toString();
const param = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string' || !value) throw new Error('Invalid attachment parameter');
  return value;
};
const entityType = (value: unknown): AttachmentEntityType => {
  if (typeof value !== 'string' || !attachmentEntityTypes.includes(value as AttachmentEntityType)) throw new Error('Invalid attachment entity type');
  return value as AttachmentEntityType;
};

export const uploadAttachment = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    if (!request.file) { response.status(400).json({ error: { message: 'A valid attachment file is required' } }); return; }
    const attachment = await attachmentService.create(userId(request), entityType(request.body.entityType), request.body.entityId, request.file);
    response.status(201).json({ data: attachment });
  } catch (error) { next(error); }
};

export const listAttachments = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await attachmentService.list(userId(request), entityType(param(request.params.entityType)), param(request.params.entityId)) }); } catch (error) { next(error); }
};

export const downloadAttachment = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const attachment = await attachmentService.getForUser(userId(request), param(request.params.id)); response.download(attachment.filePath, attachment.fileName); } catch (error) { next(error); }
};

export const deleteAttachment = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await attachmentService.delete(userId(request), param(request.params.id)); response.status(204).send(); } catch (error) { next(error); }
};