import { z } from 'zod';
import { sprintStatuses } from '../models/sprint.model.js';

const date = z.coerce.date();

export const createSprintSchema = z.object({
  name: z.string().trim().min(2).max(120),
  goal: z.string().trim().max(2000).optional().default(''),
  startDate: date,
  endDate: date,
});

export const updateSprintSchema = createSprintSchema.partial().extend({ status: z.enum(sprintStatuses).optional() });
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;