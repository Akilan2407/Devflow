import { Router } from 'express';
import { connectRepository, disconnectRepository, getBranches, getCommits, getIssues, getPullRequests, getRepository } from '../controllers/repository.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/organization.middleware.js';
import { requireProjectAccess, requireProjectMember } from '../middleware/project.middleware.js';

export const repositoryRouter = Router();
repositoryRouter.use('/projects/:id/repository', requireAuth, requireProjectAccess, requireProjectMember);
repositoryRouter.post('/projects/:id/repository', requirePermission('project:update'), connectRepository);
repositoryRouter.delete('/projects/:id/repository', requirePermission('project:update'), disconnectRepository);
repositoryRouter.get('/projects/:id/repository', requirePermission('project:read'), getRepository);
repositoryRouter.get('/projects/:id/repository/branches', requirePermission('project:read'), getBranches);
repositoryRouter.get('/projects/:id/repository/commits', requirePermission('project:read'), getCommits);
repositoryRouter.get('/projects/:id/repository/pull-requests', requirePermission('project:read'), getPullRequests);
repositoryRouter.get('/projects/:id/repository/issues', requirePermission('project:read'), getIssues);