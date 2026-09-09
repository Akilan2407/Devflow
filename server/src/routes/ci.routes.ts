import { Router } from 'express';
import { getWorkflowRun, listWorkflowRuns, listWorkflows } from '../controllers/ci.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/organization.middleware.js';
import { requireProjectMember, requireProjectParamAccess } from '../middleware/project.middleware.js';

export const ciRouter = Router();
ciRouter.use('/projects/:projectId/ci', requireAuth, requireProjectParamAccess('projectId'), requireProjectMember, requirePermission('project:read'));
ciRouter.get('/projects/:projectId/ci/workflows', listWorkflows);
ciRouter.get('/projects/:projectId/ci/runs', listWorkflowRuns);
ciRouter.get('/projects/:projectId/ci/runs/:runId', getWorkflowRun);