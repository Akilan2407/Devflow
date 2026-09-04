import { z } from 'zod';
import { taskPriorities, taskStatuses, taskTypes } from '../models/task.model.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const nullableObjectId = objectId.nullable().optional();
const nullableDate = z.coerce.date().nullable().optional();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10000).optional().default(''),
  status: z.enum(taskStatuses).optional().default('TODO'),
  priority: z.enum(taskPriorities).optional().default('MEDIUM'),
  type: z.enum(taskTypes).optional().default('TASK'),
  assigneeId: nullableObjectId,
  sprintId: nullableObjectId,
  labels: z.array(z.string().trim().min(1).max(50)).max(30).optional().default([]),
  storyPoints: z.number().int().min(0).max(100).nullable().optional(),
  dueDate: nullableDate,
  position: z.number().min(0).optional().default(0),
});

export const updateTaskSchema = createTaskSchema.partial();
export const assignTaskSchema = z.object({ assigneeId: nullableObjectId });
export const prioritySchema = z.object({ priority: z.enum(taskPriorities) });
export const statusSchema = z.object({ status: z.enum(taskStatuses) });
export const positionSchema = z.object({ position: z.number().min(0) });
export const labelSchema = z.object({ label: z.string().trim().min(1).max(50) });
export const labelsSchema = z.object({ labels: z.array(z.string().trim().min(1).max(50)).max(30) });
export const dueDateSchema = z.object({ dueDate: nullableDate });
export const storyPointsSchema = z.object({ storyPoints: z.number().int().min(0).max(100).nullable() });
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;