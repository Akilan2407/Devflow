import type { NextFunction, Request, Response } from 'express';
import { sprintService } from '../services/sprint.service.js';
import type { SprintRequest } from '../middleware/sprint.middleware.js';
import { createSprintSchema, updateSprintSchema } from '../validators/sprint.validators.js';

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
  try { response.json({ data: await sprintService.start(context(request).sprint) }); } catch (error) { next(error); }
};
export const completeSprint = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await sprintService.complete(context(request).sprint) }); } catch (error) { next(error); }
};
export const addTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await sprintService.addTask(context(request).sprint, param(request.params.taskId)); response.status(204).send(); } catch (error) { next(error); }
};
export const removeTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await sprintService.removeTask(context(request).sprint, param(request.params.taskId)); response.status(204).send(); } catch (error) { next(error); }
};