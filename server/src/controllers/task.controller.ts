import type { NextFunction, Request, Response } from 'express';
import { taskService } from '../services/task.service.js';
import type { TaskRequest } from '../middleware/task.middleware.js';
import { assignTaskSchema, createTaskSchema, dueDateSchema, labelSchema, labelsSchema, positionSchema, prioritySchema, statusSchema, storyPointsSchema, updateTaskSchema } from '../validators/task.validators.js';
import { emitSocketEvent, organizationRoom, projectRoom, taskRoom, SocketEvent } from '../sockets/socket.events.js';
import { notificationService } from '../services/notification.service.js';
import { createActivityLog } from '../services/activity-log.service.js';

const param = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};
const queryParam = (value: unknown): string | undefined => typeof value === 'string' ? value : undefined;
const taskContext = (request: Request) => request as unknown as TaskRequest;

export const createTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const context = taskContext(request);
    const task = await taskService.create(context.organization._id.toString(), context.project._id.toString(), context.user._id.toString(), createTaskSchema.parse(request.body));
    await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_CREATED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} created`, metadata: { projectId: context.project._id.toString() } });
    emitSocketEvent(SocketEvent.TASK_CREATED, [organizationRoom(context.organization._id.toString()), projectRoom(context.project._id.toString())], task);
    response.status(201).json({ data: task });
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
  try { const context = taskContext(request); const input = updateTaskSchema.parse(request.body); const previousAssignee = context.task.assigneeId?.toString(); const task = await taskService.update(context.task, context.organization._id.toString(), input); await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_UPDATED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} updated`, metadata: { ...input, projectId: context.project._id.toString() } }); const rooms = [organizationRoom(context.organization._id.toString()), projectRoom(context.project._id.toString()), taskRoom(task._id.toString())]; emitSocketEvent(SocketEvent.TASK_UPDATED, rooms, task); if ('status' in input || 'position' in input) emitSocketEvent(SocketEvent.TASK_MOVED, rooms, task); const assigneeId = task.assigneeId?.toString(); if (assigneeId && assigneeId !== context.user._id.toString()) await notificationService.notify({ organizationId: context.organization._id.toString(), userId: assigneeId, projectId: context.project._id.toString(), type: previousAssignee !== assigneeId ? 'TASK_ASSIGNED' : 'TASK_UPDATED', title: previousAssignee !== assigneeId ? 'Task assigned to you' : 'Task updated', message: task.title, entityType: 'TASK', entityId: task._id.toString(), dedupeKey: `task:${task._id}:${task.updatedAt.toISOString()}:${assigneeId}` }); response.json({ data: task }); } catch (error) { next(error); }
};

export const deleteTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); const task = context.task; await taskService.delete(task); emitSocketEvent(SocketEvent.TASK_DELETED, [organizationRoom(context.organization._id.toString()), projectRoom(context.project._id.toString()), taskRoom(task._id.toString())], { _id: task._id, projectId: task.projectId }); response.status(204).send(); } catch (error) { next(error); }
};

const patch = (schema: { parse: (value: unknown) => Record<string, unknown> }) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); const values = schema.parse(request.body); const task = await taskService.patch(context.task, values); await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_UPDATED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} updated`, metadata: { ...values, projectId: context.project._id.toString() } }); const rooms = [organizationRoom(context.organization._id.toString()), projectRoom(context.project._id.toString()), taskRoom(task._id.toString())]; emitSocketEvent(SocketEvent.TASK_UPDATED, rooms, task); if ('status' in values || 'position' in values) emitSocketEvent(SocketEvent.TASK_MOVED, rooms, task); response.json({ data: task }); } catch (error) { next(error); }
};

export const assignTask = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); const assigneeId = assignTaskSchema.parse(request.body).assigneeId; const task = await taskService.assign(context.task, context.organization._id.toString(), assigneeId); await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_ASSIGNED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} assigned`, metadata: { assigneeId } }); if (assigneeId && assigneeId !== context.user._id.toString()) await notificationService.notify({ organizationId: context.organization._id.toString(), userId: assigneeId, projectId: context.project._id.toString(), type: 'TASK_ASSIGNED', title: 'Task assigned to you', message: task.title, entityType: 'TASK', entityId: task._id.toString(), dedupeKey: `task-assigned:${task._id}:${task.updatedAt.toISOString()}:${assigneeId}` }); response.json({ data: task }); } catch (error) { next(error); }
};
export const changePriority = patch(prioritySchema);
export const changeStatus = patch(statusSchema);
export const updatePosition = patch(positionSchema);
export const setDueDate = patch(dueDateSchema);
export const setStoryPoints = patch(storyPointsSchema);
export const replaceLabels = patch(labelsSchema);
export const addLabel = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); const { label } = labelSchema.parse(request.body); const task = await taskService.patch(context.task, { labels: [...new Set([...context.task.labels, label])] }); await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_UPDATED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} updated`, metadata: { labelAdded: label } }); response.json({ data: task }); } catch (error) { next(error); }
};
export const removeLabel = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const context = taskContext(request); const label = param(request.params.label); const task = await taskService.patch(context.task, { labels: context.task.labels.filter((item) => item !== label) }); await createActivityLog({ organizationId: context.organization._id.toString(), userId: context.user._id.toString(), action: 'TASK_UPDATED', entityType: 'TASK', entityId: task._id.toString(), description: `Task ${task.title} updated`, metadata: { labelRemoved: label } }); response.json({ data: task }); } catch (error) { next(error); }
};