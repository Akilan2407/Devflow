import type { Request, RequestHandler } from 'express';
import { TaskModel, type TaskDocument } from '../models/task.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';

export type TaskRequest = OrganizationRequest & { project: ProjectDocument; task: TaskDocument };

const attachProject = async (request: Request, projectId: string): Promise<ProjectDocument | null> => {
  const project = await ProjectModel.findById(projectId);
  if (!project) return null;
  const organizationRequest = request as unknown as OrganizationRequest;
  const membership = await OrganizationMemberModel.findOne({
    organizationId: project.organizationId,
    userId: organizationRequest.user._id,
  });
  if (!membership) return null;
  const organization = await OrganizationModel.findById(project.organizationId);
  if (!organization) return null;
  organizationRequest.organization = organization;
  organizationRequest.membership = membership;
  (request as unknown as TaskRequest).project = project;
  return project;
};

export const requireTaskProjectAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const projectId = request.params.projectId;
    if (typeof projectId !== 'string' || !(await attachProject(request, projectId))) {
      response.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    next();
  })().catch(next);
};

export const requireTaskAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const task = await TaskModel.findById(request.params.id);
    if (!task || !(await attachProject(request, task.projectId.toString()))) {
      response.status(404).json({ error: { message: 'Task not found' } });
      return;
    }
    (request as unknown as TaskRequest).task = task;
    next();
  })().catch(next);
};