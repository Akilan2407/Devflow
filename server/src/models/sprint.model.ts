import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

export const sprintStatuses = ['PLANNED', 'ACTIVE', 'COMPLETED'] as const;
export type SprintStatus = (typeof sprintStatuses)[number];

const sprintSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    goal: { type: String, default: '', maxlength: 2000 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: sprintStatuses, required: true, default: 'PLANNED' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

sprintSchema.index({ projectId: 1, startDate: -1 });

export type Sprint = InferSchemaType<typeof sprintSchema>;
export type SprintDocument = HydratedDocument<Sprint>;
export const SprintModel = model<Sprint>('Sprint', sprintSchema);