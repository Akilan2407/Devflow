import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const attachment = z.object({ name: z.string().trim().min(1).max(255), url: z.string().url().max(2000), type: z.string().trim().min(1).max(120), size: z.number().int().nonnegative() });
export const createMessageSchema = z.object({ content: z.string().trim().max(10000).default(''), attachments: z.array(attachment).max(10).default([]) }).refine((value) => value.content.length > 0 || value.attachments.length > 0, 'Message must contain text or an attachment');
export const updateMessageSchema = z.object({ content: z.string().trim().min(1).max(10000) });
export const messageIdSchema = z.object({ id: objectId });
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
