import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const attachmentEntityTypes = ['PROJECT', 'TASK', 'ISSUE', 'CHAT'] as const;
export type AttachmentEntityType = (typeof attachmentEntityTypes)[number];

const attachmentSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  entityType: { type: String, enum: attachmentEntityTypes, required: true, index: true },
  entityId: { type: Schema.Types.ObjectId, required: true, index: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  fileExtension: { type: String, required: true },
  filePath: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

attachmentSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
export type Attachment = InferSchemaType<typeof attachmentSchema>;
export type AttachmentDocument = HydratedDocument<Attachment>;
export const AttachmentModel = model<Attachment>('Attachment', attachmentSchema);