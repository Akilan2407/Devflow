import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const teamSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export type Team = InferSchemaType<typeof teamSchema>;
export type TeamDocument = HydratedDocument<Team>;
export const TeamModel = model<Team>('Team', teamSchema);
