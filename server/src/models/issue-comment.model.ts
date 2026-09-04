import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const issueCommentSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
  },
  { timestamps: true },
);

export type IssueComment = InferSchemaType<typeof issueCommentSchema>;
export type IssueCommentDocument = HydratedDocument<IssueComment>;
export const IssueCommentModel = model<IssueComment>('IssueComment', issueCommentSchema);