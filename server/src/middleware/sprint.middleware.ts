import type { Request, RequestHandler } from 'express';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import { SprintModel, type SprintDocument } from '../models/sprint.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';

export type SprintRequest = OrganizationRequest & { project: ProjectDocument; sprint: SprintDocument };

const attachProject = async (request: Request, projectId: string): Promise<ProjectDocument | null> => {
  const project = await ProjectModel.findById(projectId);
  if (!project) return null;
  const organizationRequest = request as unknown as OrganizationRequest;
  const membership = await OrganizationMemberModel.findOne({ organizationId: project.organizationId, userId: organizationRequest.user._id });
  if (!membership) return null;
  const organization = await OrganizationModel.findById(project.organizationId);
  if (!organization) return null;
  organizationRequest.organization = organization;
  organizationRequest.membership = membership;
  (request as unknown as SprintRequest).project = project;
  return project;
};

export const requireSprintProjectAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const projectId = request.params.projectId;
    if (typeof projectId !== 'string' || !(await attachProject(request, projectId))) {
      response.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    next();
  })().catch(next);
};

export const requireSprintAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const sprint = await SprintModel.findById(request.params.id);
    if (!sprint || !(await attachProject(request, sprint.projectId.toString()))) {
      response.status(404).json({ error: { message: 'Sprint not found' } });
      return;
    }
    (request as unknown as SprintRequest).sprint = sprint;
    next();
  })().catch(next);
};