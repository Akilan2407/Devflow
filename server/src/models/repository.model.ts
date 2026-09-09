import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const repositorySchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    githubRepositoryId: { type: Number, required: true },
    owner: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    connectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

repositorySchema.index({ projectId: 1 }, { unique: true });
repositorySchema.index({ organizationId: 1, githubRepositoryId: 1 }, { unique: true });

export type Repository = InferSchemaType<typeof repositorySchema>;
export type RepositoryDocument = HydratedDocument<Repository>;
export const RepositoryModel = model<Repository>('Repository', repositorySchema);