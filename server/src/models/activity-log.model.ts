import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const activityActions = ['LOGIN', 'LOGOUT', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_ASSIGNED', 'ISSUE_CREATED', 'ISSUE_UPDATED', 'SPRINT_STARTED', 'SPRINT_COMPLETED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'ROLE_CHANGED'] as const;
export type ActivityAction = (typeof activityActions)[number];
const activityLogSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, enum: activityActions, required: true, index: true },
  entityType: { type: String, required: true, maxlength: 50, index: true },
  entityId: { type: Schema.Types.ObjectId, default: null, index: true },
  description: { type: String, required: true, maxlength: 1000 },
  metadata: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: false });
activityLogSchema.index({ organizationId: 1, timestamp: -1 });
export type ActivityLog = InferSchemaType<typeof activityLogSchema>;
export type ActivityLogDocument = HydratedDocument<ActivityLog>;
export const ActivityLogModel = model<ActivityLog>('ActivityLog', activityLogSchema);
