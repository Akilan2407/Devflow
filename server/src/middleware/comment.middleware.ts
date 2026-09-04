import type { Request, RequestHandler } from 'express';
import { CommentModel, type CommentDocument } from '../models/comment.model.js';
import { IssueModel } from '../models/issue.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import { TaskModel } from '../models/task.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';

export type CommentRequest = OrganizationRequest & { comment?: CommentDocument; project: ProjectDocument };

const resolveEntityProject = async (entityType: string, entityId: string): Promise<ProjectDocument | null> => {
  if (entityType === 'PROJECT') return ProjectModel.findById(entityId);
  if (entityType === 'TASK') {
    const task = await TaskModel.findById(entityId).select('projectId');
    return task ? ProjectModel.findById(task.projectId) : null;
  }
  if (entityType === 'ISSUE') {
    const issue = await IssueModel.findById(entityId).select('projectId');
    return issue ? ProjectModel.findById(issue.projectId) : null;
  }
  return null;
};

export const requireCommentEntityAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const entityType = request.body?.entityType ?? request.params.entityType;
    const entityId = request.body?.entityId ?? request.params.entityId;
    const project = typeof entityType === 'string' && typeof entityId === 'string'
      ? await resolveEntityProject(entityType, entityId)
      : null;
    const context = request as unknown as OrganizationRequest;
    const membership = project
      ? await OrganizationMemberModel.findOne({ organizationId: project.organizationId, userId: context.user._id })
      : null;
    const organization = project && membership ? await OrganizationModel.findById(project.organizationId) : null;
    if (!project || !membership || !organization) {
      response.status(404).json({ error: { message: 'Resource not found' } });
      return;
    }
    context.organization = organization;
    context.membership = membership;
    (request as unknown as CommentRequest).project = project;
    next();
  })().catch(next);
};

export const requireCommentAccess: RequestHandler = (request, response, next) => {
  void (async () => {
    const comment = await CommentModel.findById(request.params.id);
    if (!comment) {
      response.status(404).json({ error: { message: 'Comment not found' } });
      return;
    }
    const project = await resolveEntityProject(comment.entityType, comment.entityId.toString());
    const context = request as unknown as OrganizationRequest;
    const membership = project
      ? await OrganizationMemberModel.findOne({ organizationId: project.organizationId, userId: context.user._id })
      : null;
    const organization = project && membership ? await OrganizationModel.findById(project.organizationId) : null;
    if (!project || !membership || !organization) {
      response.status(404).json({ error: { message: 'Comment not found' } });
      return;
    }
    context.organization = organization;
    context.membership = membership;
    const commentRequest = request as unknown as CommentRequest;
    commentRequest.project = project;
    commentRequest.comment = comment;
    next();
  })().catch(next);
};