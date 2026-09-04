import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const issueHistorySchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true, trim: true, maxlength: 80 },
    field: { type: String, default: null, maxlength: 80 },
    from: { type: Schema.Types.Mixed, default: null },
    to: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export type IssueHistory = InferSchemaType<typeof issueHistorySchema>;
export type IssueHistoryDocument = HydratedDocument<IssueHistory>;
export const IssueHistoryModel = model<IssueHistory>('IssueHistory', issueHistorySchema);