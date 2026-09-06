import { z } from 'zod';
import { notificationTypes } from '../models/notification.model.js';
export const notificationTypeSchema = z.enum(notificationTypes);
export const notificationIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
export const createNotificationSchema = z.object({ organizationId: notificationIdSchema, projectId: notificationIdSchema.nullable().optional(), type: notificationTypeSchema, title: z.string().trim().min(1).max(200), message: z.string().trim().min(1).max(1000), entityType: z.string().trim().min(1).max(50), entityId: notificationIdSchema.nullable().optional() });
export type NotificationTypeInput = z.infer<typeof notificationTypeSchema>;
