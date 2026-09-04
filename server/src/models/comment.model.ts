import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const commentEntityTypes = ['PROJECT', 'TASK', 'ISSUE'] as const;
export type CommentEntityType = (typeof commentEntityTypes)[number];

const commentSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entityType: { type: String, enum: commentEntityTypes, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

commentSchema.index({ entityType: 1, entityId: 1, createdAt: 1 });

export type Comment = InferSchemaType<typeof commentSchema>;
export type CommentDocument = HydratedDocument<Comment>;
export const CommentModel = model<Comment>('Comment', commentSchema);