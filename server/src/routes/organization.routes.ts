import { Router } from 'express';
import {
  changeMemberRole,
  createOrganization,
  deleteOrganization,
  getMembers,
  getOrganization,
  inviteMember,
  listOrganizations,
  removeMember,
  updateOrganization,
} from '../controllers/organization.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  requireOrganizationAccess,
  requirePermission,
  requireRole,
} from '../middleware/organization.middleware.js';

export const organizationRouter = Router();
organizationRouter.use(requireAuth);
organizationRouter.post('/', createOrganization);
organizationRouter.get('/', listOrganizations);
organizationRouter.get(
  '/:id',
  requireOrganizationAccess,
  requirePermission('organization:read'),
  getOrganization,
);
organizationRouter.patch(
  '/:id',
  requireOrganizationAccess,
  requirePermission('organization:update'),
  updateOrganization,
);
organizationRouter.delete(
  '/:id',
  requireOrganizationAccess,
  requireRole('SUPER_ADMIN', 'ORGANIZATION_ADMIN'),
  deleteOrganization,
);
organizationRouter.post(
  '/:id/members',
  requireOrganizationAccess,
  requirePermission('member:invite'),
  inviteMember,
);
organizationRouter.get(
  '/:id/members',
  requireOrganizationAccess,
  requirePermission('organization:read'),
  getMembers,
);
organizationRouter.delete(
  '/:id/members/:userId',
  requireOrganizationAccess,
  requirePermission('member:remove'),
  removeMember,
);
organizationRouter.patch(
  '/:id/members/:userId/role',
  requireOrganizationAccess,
  requirePermission('member:updateRole'),
  changeMemberRole,
);
