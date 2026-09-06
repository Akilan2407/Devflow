import type { NextFunction, Request, Response } from 'express';
import type { ProjectRequest } from '../middleware/project.middleware.js';
import { MessageModel } from '../models/message.model.js';
import { messageService } from '../services/message.service.js';
import { createMessageSchema, updateMessageSchema } from '../validators/message.validators.js';
import { emitSocketEvent, messageRoom, projectRoom, SocketEvent } from '../sockets/socket.events.js';

const context = (request: Request) => request as unknown as ProjectRequest;
const param = (value: string | string[] | undefined): string => { if (typeof value !== 'string') throw new Error('Invalid route parameter'); return value; };

export const createMessage = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const message = await messageService.create(value.organization._id.toString(), value.project._id.toString(), value.user._id.toString(), createMessageSchema.parse(request.body)); emitSocketEvent(SocketEvent.MESSAGE_SENT, [projectRoom(value.project._id.toString())], message); response.status(201).json({ data: message }); } catch (error) { next(error); }
};
export const listMessages = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const rawLimit = Number(request.query.limit); const limit = Math.min(Math.max(Number.isFinite(rawLimit) ? rawLimit : 30, 1), 100); const beforeValue = typeof request.query.before === 'string' ? new Date(request.query.before) : undefined; const before = beforeValue && !Number.isNaN(beforeValue.valueOf()) ? beforeValue : undefined; response.json({ data: await messageService.list(value.project._id.toString(), before, limit) }); } catch (error) { next(error); }
};
export const updateMessage = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const message = await MessageModel.findOne({ _id: param(request.params.messageId), projectId: value.project._id }); if (!message) { response.status(404).json({ error: { message: 'Message not found' } }); return; } if (message.senderId.toString() !== value.user._id.toString()) { response.status(403).json({ error: { message: 'Only the sender can edit this message' } }); return; } const updated = await messageService.update(message, updateMessageSchema.parse(request.body)); emitSocketEvent(SocketEvent.MESSAGE_UPDATED, [projectRoom(value.project._id.toString()), messageRoom(updated._id.toString())], updated); response.json({ data: updated }); } catch (error) { next(error); }
};
export const deleteMessage = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const message = await MessageModel.findOne({ _id: param(request.params.messageId), projectId: value.project._id }); if (!message) { response.status(404).json({ error: { message: 'Message not found' } }); return; } if (message.senderId.toString() !== value.user._id.toString()) { response.status(403).json({ error: { message: 'Only the sender can delete this message' } }); return; } await messageService.delete(message); emitSocketEvent(SocketEvent.MESSAGE_DELETED, [projectRoom(value.project._id.toString()), messageRoom(message._id.toString())], { _id: message._id, projectId: message.projectId }); response.status(204).send(); } catch (error) { next(error); }
};
export const markMessageRead = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const message = await messageService.markRead(value.project._id.toString(), param(request.params.id), value.user._id.toString()); if (!message) { response.status(404).json({ error: { message: 'Message not found' } }); return; } emitSocketEvent(SocketEvent.MESSAGE_READ, [projectRoom(value.project._id.toString()), messageRoom(message._id.toString())], { _id: message._id, projectId: message.projectId, userId: value.user._id }); response.json({ data: message }); } catch (error) { next(error); }
};
