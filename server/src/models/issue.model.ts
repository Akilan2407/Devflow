import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const issueTypes = ['BUG', 'FEATURE', 'TASK', 'IMPROVEMENT'] as const;
export const issueSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export const issueStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED'] as const;
export const issuePriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type IssueType = (typeof issueTypes)[number];
export type IssueSeverity = (typeof issueSeverities)[number];
export type IssueStatus = (typeof issueStatuses)[number];
export type IssuePriority = (typeof issuePriorities)[number];

const issueSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 240 },
    description: { type: String, default: '', maxlength: 10000 },
    type: { type: String, enum: issueTypes, required: true, default: 'BUG' },
    status: { type: String, enum: issueStatuses, required: true, default: 'OPEN' },
    priority: { type: String, enum: issuePriorities, required: true, default: 'MEDIUM' },
    severity: { type: String, enum: issueSeverities, required: true, default: 'MEDIUM' },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    labels: { type: [String], default: [] },
    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', default: null },
  },
  { timestamps: true },
);

issueSchema.index({ projectId: 1, createdAt: -1 });
issueSchema.index({ organizationId: 1, projectId: 1, status: 1 });

export type Issue = InferSchemaType<typeof issueSchema>;
export type IssueDocument = HydratedDocument<Issue>;
export const IssueModel = model<Issue>('Issue', issueSchema);