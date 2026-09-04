import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  requireOrganizationAccess,
  requirePermission,
} from '../middleware/organization.middleware.js';
import { requireTeamAccess } from '../middleware/team.middleware.js';
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getTeam,
  getTeams,
  removeTeamMember,
  updateTeam,
} from '../controllers/team.controller.js';

export const teamRouter = Router();
teamRouter.use(requireAuth);
teamRouter.post(
  '/organizations/:organizationId/teams',
  requireOrganizationAccess('organizationId'),
  requirePermission('organization:update'),
  createTeam,
);
teamRouter.get(
  '/organizations/:organizationId/teams',
  requireOrganizationAccess('organizationId'),
  requirePermission('organization:read'),
  getTeams,
);
teamRouter.get('/teams/:id', requireTeamAccess, requirePermission('organization:read'), getTeam);
teamRouter.patch(
  '/teams/:id',
  requireTeamAccess,
  requirePermission('organization:update'),
  updateTeam,
);
teamRouter.delete(
  '/teams/:id',
  requireTeamAccess,
  requirePermission('organization:update'),
  deleteTeam,
);
teamRouter.post(
  '/teams/:id/members',
  requireTeamAccess,
  requirePermission('member:invite'),
  addTeamMember,
);
teamRouter.delete(
  '/teams/:id/members/:userId',
  requireTeamAccess,
  requirePermission('member:remove'),
  removeTeamMember,
);
