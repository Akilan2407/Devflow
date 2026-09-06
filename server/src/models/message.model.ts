import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const attachmentSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 255 },
  url: { type: String, required: true, trim: true, maxlength: 2000 },
  type: { type: String, required: true, trim: true, maxlength: 120 },
  size: { type: Number, required: true, min: 0 },
}, { _id: false });

const messageSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, trim: true, maxlength: 10000, default: '' },
  attachments: { type: [attachmentSchema], default: [] },
  readBy: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
}, { timestamps: true });

messageSchema.index({ projectId: 1, createdAt: -1 });
export type Message = InferSchemaType<typeof messageSchema>;
export type MessageDocument = HydratedDocument<Message>;
export const MessageModel = model<Message>('Message', messageSchema);
