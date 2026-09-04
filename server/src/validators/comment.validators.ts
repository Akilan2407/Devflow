import { z } from 'zod';
import { commentEntityTypes } from '../models/comment.model.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
export const createCommentSchema = z.object({
  entityType: z.enum(commentEntityTypes),
  entityId: objectId,
  content: z.string().trim().min(1).max(5000),
  mentions: z.array(objectId).max(50).optional().default([]),
});
export const updateCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  mentions: z.array(objectId).max(50).optional(),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;