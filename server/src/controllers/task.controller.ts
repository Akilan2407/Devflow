import type { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/task.service.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import type { TaskRequest } from '../middleware/task.middleware.js';
import { assignTaskSchema, createTaskSchema, dueDateSchema, labelSchema, labelsSchema, positionSchema, prioritySchema, statusSchema, storyPointsSchema, updateTaskSchema } from '../validators/task.validators.js';

const param = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};
const queryParam = (value: unknown): string | undefined => typeof value === 'string' ? value : undefined;
const taskContext = (request: Request) => request as unknown as TaskRequest;

export const createTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const context = taskContext(request);
    response.status(201).json({ data: await taskService.create(context.organization._id.toString(), context.project._id.toString(), context.user._id.toString(), createTaskSchema.parse(request.body)) });
  } catch (error) { next(error); }
};

export const listTasks = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    response.json({ data: await taskService.list(param(request.params.projectId), { page, limit, search: queryParam(request.query.search), status: queryParam(request.query.status), priority: queryParam(request.query.priority), type: queryParam(request.query.type), assigneeId: queryParam(request.query.assigneeId), label: queryParam(request.query.label), sprintId: queryParam(request.query.sprintId), sort: queryParam(request.query.sort) ?? 'position' }) });
  } catch (error) { next(error); }
};

export const getTask = (request: Request, response: Response): void => { response.json({ data: taskContext(request).task }); };

export const updateTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); response.json({ data: await taskService.update(context.task, context.organization._id.toString(), updateTaskSchema.parse(request.body)) }); } catch (error) { next(error); }
};

export const deleteTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await taskService.delete(taskContext(request).task); response.status(204).send(); } catch (error) { next(error); }
};

const patch = (schema: { parse: (value: unknown) => Record<string, unknown> }) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await taskService.patch(taskContext(request).task, schema.parse(request.body)) }); } catch (error) { next(error); }
};

export const assignTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); response.json({ data: await taskService.assign(context.task, context.organization._id.toString(), assignTaskSchema.parse(request.body).assigneeId) }); } catch (error) { next(error); }
};
export const changePriority = patch(prioritySchema);
export const changeStatus = patch(statusSchema);
export const updatePosition = patch(positionSchema);
export const setDueDate = patch(dueDateSchema);
export const setStoryPoints = patch(storyPointsSchema);
export const replaceLabels = patch(labelsSchema);
export const addLabel = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const task = taskContext(request).task; const { label } = labelSchema.parse(request.body); response.json({ data: await taskService.patch(task, { labels: [...new Set([...task.labels, label])] }) }); } catch (error) { next(error); }
};
export const removeLabel = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const task = taskContext(request).task; const label = param(request.params.label); response.json({ data: await taskService.patch(task, { labels: task.labels.filter((item) => item !== label) }) }); } catch (error) { next(error); }
};