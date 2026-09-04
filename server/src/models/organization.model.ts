import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: '', maxlength: 1000 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export type Organization = InferSchemaType<typeof organizationSchema>;
export type OrganizationDocument = HydratedDocument<Organization>;
export const OrganizationModel = model<Organization>('Organization', organizationSchema);
