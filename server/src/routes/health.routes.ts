import { Router } from 'express';
import { getDatabaseHealth, getHealth, getRedisHealth } from '../controllers/health.controller.js';

export const healthRouter = Router();

healthRouter.get('/', getHealth);
healthRouter.get('/database', getDatabaseHealth);
healthRouter.get('/redis', getRedisHealth);
