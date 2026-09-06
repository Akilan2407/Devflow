import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const notificationTypes = ['TASK_ASSIGNED', 'TASK_UPDATED', 'ISSUE_ASSIGNED', 'ISSUE_UPDATED', 'COMMENT', 'MENTION', 'SPRINT_STARTED', 'SPRINT_COMPLETED', 'PROJECT_INVITATION', 'SYSTEM'] as const;
export type NotificationType = (typeof notificationTypes)[number];
const notificationSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
  type: { type: String, enum: notificationTypes, required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  entityType: { type: String, required: true, maxlength: 50 },
  entityId: { type: Schema.Types.ObjectId, default: null },
  isRead: { type: Boolean, default: false, index: true },
  dedupeKey: { type: String, required: true, unique: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
notificationSchema.index({ userId: 1, createdAt: -1 });
export type Notification = InferSchemaType<typeof notificationSchema>;
export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationModel = model<Notification>('Notification', notificationSchema);
