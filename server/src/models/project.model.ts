import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const projectStatuses = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

const projectSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    key: { type: String, required: true, trim: true, uppercase: true, minlength: 2, maxlength: 12 },
    description: { type: String, default: '', maxlength: 2000 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: projectStatuses, default: 'PLANNING', required: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

projectSchema.index({ organizationId: 1, key: 1 }, { unique: true });
projectSchema.index({ organizationId: 1, createdAt: -1 });

export type Project = InferSchemaType<typeof projectSchema>;
export type ProjectDocument = HydratedDocument<Project>;
export const ProjectModel = model<Project>('Project', projectSchema);