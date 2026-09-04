import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireCommentAccess, requireCommentEntityAccess } from '../middleware/comment.middleware.js';
import { createComment, deleteComment, getComments, updateComment } from '../controllers/comment.controller.js';

export const commentRouter = Router();
commentRouter.use(requireAuth);
commentRouter.post('/', requireCommentEntityAccess, createComment);
commentRouter.get('/:entityType/:entityId', requireCommentEntityAccess, getComments);
commentRouter.patch('/:id', requireCommentAccess, updateComment);
commentRouter.delete('/:id', requireCommentAccess, deleteComment);