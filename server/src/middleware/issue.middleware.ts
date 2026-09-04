import type { Request, RequestHandler } from 'express';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import { IssueModel, type IssueDocument } from '../models/issue.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';

export type IssueRequest = OrganizationRequest & { project: ProjectDocument; issue: IssueDocument };

const attachProject = async (request: Request, projectId: string): Promise<ProjectDocument | null> => {
  const project = await ProjectModel.findById(projectId);
  if (!project) return null;
  const context = request as unknown as OrganizationRequest;
  const membership = await OrganizationMemberModel.findOne({ organizationId: project.organizationId, userId: context.user._id });
  if (!membership) return null;
  const organization = await OrganizationModel.findById(project.organizationId);
  if (!organization) return null;
  context.organization = organization;
  context.membership = membership;
  (request as unknown as IssueRequest).project = project;
  return project;
};

export const requireIssueProjectAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const projectId = request.params.projectId;
    if (typeof projectId !== 'string' || !(await attachProject(request, projectId))) {
      response.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    next();
  })().catch(next);
};

export const requireIssueAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const issue = await IssueModel.findById(request.params.id);
    if (!issue || !(await attachProject(request, issue.projectId.toString()))) {
      response.status(404).json({ error: { message: 'Issue not found' } });
      return;
    }
    (request as unknown as IssueRequest).issue = issue;
    next();
  })().catch(next);
};