import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { search } from '../controllers/search.controller.js';
export const searchRouter = Router();
searchRouter.get('/', requireAuth, search);
