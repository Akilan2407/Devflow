import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import { organizationRoles } from '../utils/permissions.js';

const organizationMemberSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: organizationRoles, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export type OrganizationMember = InferSchemaType<typeof organizationMemberSchema>;
export type OrganizationMemberDocument = HydratedDocument<OrganizationMember>;
export const OrganizationMemberModel = model<OrganizationMember>(
  'OrganizationMember',
  organizationMemberSchema,
);
