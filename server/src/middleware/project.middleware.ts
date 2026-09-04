import type { RequestHandler } from 'express';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';

export type ProjectRequest = OrganizationRequest & { project: ProjectDocument };

const setOrganization = async (request: RequestHandler extends never ? never : any, organizationId: string) => {
  const organizationRequest = request as OrganizationRequest;
  const membership = await OrganizationMemberModel.findOne({ organizationId, userId: organizationRequest.user._id });
  if (!membership) return false;
  const organization = await OrganizationModel.findById(organizationId);
  if (!organization) return false;
  organizationRequest.organization = organization;
  organizationRequest.membership = membership;
  return true;
};

export const requireProjectOrganizationAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const organizationId = request.body?.organizationId ?? request.query.organizationId;
    if (typeof organizationId !== 'string' || !(await setOrganization(request, organizationId))) {
      response.status(404).json({ error: { message: 'Organization not found' } });
      return;
    }
    next();
  })().catch(next);
};

export const requireProjectAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const project = await ProjectModel.findById(request.params.id);
    if (!project || !(await setOrganization(request, project.organizationId.toString())) ) {
      response.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    (request as unknown as ProjectRequest).project = project;
    next();
  })().catch(next);
};