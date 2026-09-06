import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireOrganizationAccess, requirePermission } from '../middleware/organization.middleware.js';
import { getActivityLogs } from '../controllers/activity-log.controller.js';
export const activityLogRouter = Router();
activityLogRouter.use(requireAuth);
activityLogRouter.get('/:id/activity', requireOrganizationAccess(), requirePermission('organization:read'), getActivityLogs);
