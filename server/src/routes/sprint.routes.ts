import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/organization.middleware.js';
import { requireSprintAccess, requireSprintProjectAccess } from '../middleware/sprint.middleware.js';
import { addTask, completeSprint, createSprint, deleteSprint, getSprint, listSprints, removeTask, startSprint, updateSprint } from '../controllers/sprint.controller.js';

export const sprintRouter = Router();
sprintRouter.use(requireAuth);
sprintRouter.post('/projects/:projectId/sprints', requireSprintProjectAccess, requirePermission('project:update'), createSprint);
sprintRouter.get('/projects/:projectId/sprints', requireSprintProjectAccess, requirePermission('project:read'), listSprints);
sprintRouter.get('/sprints/:id', requireSprintAccess, requirePermission('project:read'), getSprint);
sprintRouter.patch('/sprints/:id', requireSprintAccess, requirePermission('project:update'), updateSprint);
sprintRouter.delete('/sprints/:id', requireSprintAccess, requirePermission('project:delete'), deleteSprint);
sprintRouter.post('/sprints/:id/start', requireSprintAccess, requirePermission('project:update'), startSprint);
sprintRouter.post('/sprints/:id/complete', requireSprintAccess, requirePermission('project:update'), completeSprint);
sprintRouter.post('/sprints/:id/tasks/:taskId', requireSprintAccess, requirePermission('project:update'), addTask);
sprintRouter.delete('/sprints/:id/tasks/:taskId', requireSprintAccess, requirePermission('project:update'), removeTask);