import { z } from 'zod';
import { projectStatuses } from '../models/project.model.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const date = z.coerce.date().nullable().optional();

export const createProjectSchema = z.object({
  organizationId: objectId,
  name: z.string().trim().min(2).max(120),
  key: z.string().trim().min(2).max(12).regex(/^[a-z\d-]+$/i),
  description: z.string().trim().max(2000).optional().default(''),
  ownerId: objectId.optional(),
  members: z.array(objectId).optional().default([]),
  status: z.enum(projectStatuses).optional().default('PLANNING'),
  startDate: date,
  endDate: date,
});

export const updateProjectSchema = createProjectSchema.omit({ organizationId: true, ownerId: true }).partial();
export const projectMemberSchema = z.object({ userId: objectId });
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectMemberInput = z.infer<typeof projectMemberSchema>;