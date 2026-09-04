import type { RequestHandler } from 'express';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import type { OrganizationRequest } from '../types/organization.types.js';
import type { Permission, OrganizationRole } from '../utils/permissions.js';
import { roleHasPermission } from '../utils/permissions.js';

export const requireAuthentication = ((request, response, next) => {
  if (!(request as { user?: unknown }).user) {
    response.status(401).json({ error: { message: 'Authentication required' } });
    return;
  }
  next();
}) as RequestHandler;

export const requireOrganizationAccess = (organizationParam = 'id'): RequestHandler =>
  ((request, response, next) => {
    void (async () => {
      const organizationId = request.params[organizationParam];
      const user = (request as unknown as OrganizationRequest).user;
      const membership = await OrganizationMemberModel.findOne({
        organizationId,
        userId: user._id,
      });
      if (!membership) {
        response.status(404).json({ error: { message: 'Organization not found' } });
        return;
      }
      const organization = await OrganizationModel.findById(organizationId);
      if (!organization) {
        response.status(404).json({ error: { message: 'Organization not found' } });
        return;
      }
      const organizationRequest = request as unknown as OrganizationRequest;
      organizationRequest.organization = organization;
      organizationRequest.membership = membership;
      next();
    })().catch(next);
  }) as RequestHandler;

export const requireRole = (...roles: OrganizationRole[]): RequestHandler =>
  ((request, response, next) => {
    const membership = (request as unknown as OrganizationRequest).membership;
    if (!membership || !roles.includes(membership.role)) {
      response.status(403).json({ error: { message: 'Insufficient permissions' } });
      return;
    }
    next();
  }) as RequestHandler;

export const requirePermission = (permission: Permission): RequestHandler =>
  ((request, response, next) => {
    const membership = (request as unknown as OrganizationRequest).membership;
    if (!membership || !roleHasPermission(membership.role, permission)) {
      response.status(403).json({ error: { message: 'Insufficient permissions' } });
      return;
    }
    next();
  }) as RequestHandler;
