import type { NextFunction, Request, Response } from 'express';
import { commentService } from '../services/comment.service.js';
import type { CommentRequest } from '../middleware/comment.middleware.js';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validators.js';

const param = (value: string | string[] | undefined): string => { if (typeof value !== 'string') throw new Error('Invalid route parameter'); return value; };
const context = (request: Request) => request as unknown as CommentRequest;

export const createComment = async (request: Request, response: Response, next: NextFunction): Promise<void> => { try { const value = context(request); response.status(201).json({ data: await commentService.create(value.organization._id.toString(), value.user._id.toString(), createCommentSchema.parse(request.body)) }); } catch (error) { next(error); } };
export const getComments = async (request: Request, response: Response, next: NextFunction): Promise<void> => { try { response.json({ data: await commentService.list(param(request.params.entityType), param(request.params.entityId)) }); } catch (error) { next(error); } };
export const updateComment = async (request: Request, response: Response, next: NextFunction): Promise<void> => { try { const value = context(request); if (value.comment?.authorId.toString() !== value.user._id.toString()) { response.status(403).json({ error: { message: 'Only the comment author can edit it' } }); return; } response.json({ data: await commentService.update(value.comment, value.organization._id.toString(), updateCommentSchema.parse(request.body)) }); } catch (error) { next(error); } };
export const deleteComment = async (request: Request, response: Response, next: NextFunction): Promise<void> => { try { const value = context(request); if (value.comment?.authorId.toString() !== value.user._id.toString()) { response.status(403).json({ error: { message: 'Only the comment author can delete it' } }); return; } await commentService.delete(value.comment); response.status(204).send(); } catch (error) { next(error); } };