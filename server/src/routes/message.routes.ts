import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/organization.middleware.js';
import { requireProjectAccess, requireProjectParamAccess } from '../middleware/project.middleware.js';
import { createMessage, deleteMessage, listMessages, markMessageRead, updateMessage } from '../controllers/message.controller.js';

export const messageRouter = Router();
messageRouter.use(requireAuth);
messageRouter.get('/projects/:id/messages', requireProjectAccess, requirePermission('project:read'), listMessages);
messageRouter.post('/projects/:id/messages', requireProjectAccess, requirePermission('project:read'), createMessage);
messageRouter.patch('/projects/:projectId/messages/:messageId', requireProjectParamAccess('projectId'), requirePermission('project:read'), updateMessage);
messageRouter.delete('/projects/:projectId/messages/:messageId', requireProjectParamAccess('projectId'), requirePermission('project:read'), deleteMessage);
messageRouter.post('/projects/:id/messages/:messageId/read', requireProjectAccess, requirePermission('project:read'), (request, response, next) => { request.params.id = request.params.messageId as string; return markMessageRead(request, response, next); });
