import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/organization.middleware.js';
import { requireProjectAccess, requireProjectOrganizationAccess } from '../middleware/project.middleware.js';
import { addProjectMember, archiveProject, createProject, deleteProject, getProject, listProjects, removeProjectMember, updateProject } from '../controllers/project.controller.js';

export const projectRouter = Router();
projectRouter.use(requireAuth);
projectRouter.post('/', requireProjectOrganizationAccess, requirePermission('project:create'), createProject);
projectRouter.get('/', requireProjectOrganizationAccess, requirePermission('project:read'), listProjects);
projectRouter.get('/:id', requireProjectAccess, requirePermission('project:read'), getProject);
projectRouter.patch('/:id', requireProjectAccess, requirePermission('project:update'), updateProject);
projectRouter.post('/:id/archive', requireProjectAccess, requirePermission('project:update'), archiveProject);
projectRouter.delete('/:id', requireProjectAccess, requirePermission('project:delete'), deleteProject);
projectRouter.post('/:id/members', requireProjectAccess, requirePermission('member:invite'), addProjectMember);
projectRouter.delete('/:id/members/:userId', requireProjectAccess, requirePermission('member:remove'), removeProjectMember);