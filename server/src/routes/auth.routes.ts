import { Router } from 'express';
import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
authRouter.get('/me', requireAuth, getCurrentUser);
