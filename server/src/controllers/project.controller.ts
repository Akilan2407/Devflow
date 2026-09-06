import type { NextFunction, Request, Response } from 'express';
import { projectService } from '../services/project.service.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import type { ProjectRequest } from '../middleware/project.middleware.js';
import { createProjectSchema, projectMemberSchema, updateProjectSchema } from '../validators/project.validators.js';
import { emitSocketEvent, organizationRoom, projectRoom, SocketEvent } from '../sockets/socket.events.js';

const projectParam = (value: string | string[] | undefined): string => {
  if (typeof value !== 'string') throw new Error('Invalid route parameter');
  return value;
};

const queryParam = (value: unknown): string => {
  if (typeof value !== 'string') throw new Error('Invalid query parameter');
  return value;
};
export const createProject = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createProjectSchema.parse(request.body);
    const project = await projectService.create((request as unknown as OrganizationRequest).user._id.toString(), input);
    response.status(201).json({ data: project });
  } catch (error) { next(error); }
};

export const listProjects = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    const status = typeof request.query.status === 'string' ? request.query.status : undefined;
    const search = typeof request.query.search === 'string' ? request.query.search : undefined;
    const sort = typeof request.query.sort === 'string' ? request.query.sort : '-createdAt';
    response.json({ data: await projectService.list(queryParam(request.query.organizationId), { page, limit, search, status, sort }) });
  } catch (error) { next(error); }
};

export const getProject = (request: Request, response: Response): void => {
  response.json({ data: (request as unknown as ProjectRequest).project });
};

export const updateProject = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = request as unknown as ProjectRequest; const project = await projectService.update(value.project, updateProjectSchema.parse(request.body)); emitSocketEvent(SocketEvent.PROJECT_UPDATED, [organizationRoom(value.project.organizationId.toString()), projectRoom(value.project._id.toString())], project); response.json({ data: project }); } catch (error) { next(error); }
};

export const archiveProject = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = request as unknown as ProjectRequest; const project = await projectService.archive(value.project); emitSocketEvent(SocketEvent.PROJECT_UPDATED, [organizationRoom(value.project.organizationId.toString()), projectRoom(value.project._id.toString())], project); response.json({ data: project }); } catch (error) { next(error); }
};

export const deleteProject = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { await projectService.delete((request as unknown as ProjectRequest).project); response.status(204).send(); } catch (error) { next(error); }
};

export const addProjectMember = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await projectService.addMember((request as unknown as ProjectRequest).project, projectMemberSchema.parse(request.body)) }); } catch (error) { next(error); }
};

export const removeProjectMember = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { response.json({ data: await projectService.removeMember((request as unknown as ProjectRequest).project, projectParam(request.params.userId)) }); } catch (error) { next(error); }
};