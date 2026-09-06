import type { NextFunction, Request, Response } from 'express';
import { sprintService } from '../services/sprint.service.js';
import type { SprintRequest } from '../middleware/sprint.middleware.js';
import { createSprintSchema, updateSprintSchema } from '../validators/sprint.validators.js';
import { notificationService } from '../services/notification.service.js';
import { createActivityLog } from '../services/activity-log.service.js';

const param = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};
const context = (request: Request) => request as unknown as SprintRequest;

export const createSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); response.status(201).json({ data: await sprintService.create(value.organization._id.toString(), value.project._id.toString(), value.user._id.toString(), createSprintSchema.parse(request.body)) }); } catch (error) { next(error); }
};
export const listSprints = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await sprintService.list(param(request.params.projectId)) }); } catch (error) { next(error); }
};
export const getSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await sprintService.get(context(request).sprint) }); } catch (error) { next(error); }
};
export const updateSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await sprintService.update(context(request).sprint, updateSprintSchema.parse(request.body)) }); } catch (error) { next(error); }
};
export const deleteSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await sprintService.delete(context(request).sprint); response.status(204).send(); } catch (error) { next(error); }
};
export const startSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const sprint = await sprintService.start(value.sprint); await createActivityLog({ organizationId: value.organization._id.toString(), userId: value.user._id.toString(), action: 'SPRINT_STARTED', entityType: 'SPRINT', entityId: sprint._id.toString(), description: `Sprint ${sprint.name} started`, metadata: { projectId: value.project._id.toString() } }); const recipients = [...new Set([value.project.ownerId.toString(), ...value.project.members.map((member) => member.toString())])].filter((recipient) => recipient !== value.user._id.toString()); await notificationService.createMany(recipients.map((recipient) => ({ organizationId: value.organization._id.toString(), userId: recipient, projectId: value.project._id.toString(), type: 'SPRINT_STARTED' as const, title: 'Sprint started', message: sprint.name, entityType: 'SPRINT', entityId: sprint._id.toString(), dedupeKey: `sprint-started:${sprint._id}:${recipient}` }))); response.json({ data: sprint }); } catch (error) { next(error); }
};
export const completeSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); const sprint = await sprintService.complete(value.sprint); await createActivityLog({ organizationId: value.organization._id.toString(), userId: value.user._id.toString(), action: 'SPRINT_COMPLETED', entityType: 'SPRINT', entityId: sprint._id.toString(), description: `Sprint ${sprint.name} completed`, metadata: { projectId: value.project._id.toString() } }); const recipients = [...new Set([value.project.ownerId.toString(), ...value.project.members.map((member) => member.toString())])].filter((recipient) => recipient !== value.user._id.toString()); await notificationService.createMany(recipients.map((recipient) => ({ organizationId: value.organization._id.toString(), userId: recipient, projectId: value.project._id.toString(), type: 'SPRINT_COMPLETED' as const, title: 'Sprint completed', message: sprint.name, entityType: 'SPRINT', entityId: sprint._id.toString(), dedupeKey: `sprint-completed:${sprint._id}:${recipient}` }))); response.json({ data: sprint }); } catch (error) { next(error); }
};
export const addTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await sprintService.addTask(context(request).sprint, param(request.params.taskId)); response.status(204).send(); } catch (error) { next(error); }
};
export const removeTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await sprintService.removeTask(context(request).sprint, param(request.params.taskId)); response.status(204).send(); } catch (error) { next(error); }
};