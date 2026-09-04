import type { Request, Response } from 'express';
import { healthService } from '../services/health.service.js';

export const getHealth = (_request: Request, response: Response): void => {
  response.status(200).json({ data: healthService.getApplicationHealth() });
};

export const getDatabaseHealth = (_request: Request, response: Response): void => {
  const health = healthService.getDatabaseHealth();
  response.status(health.connected ? 200 : 503).json({ data: health });
};

export const getRedisHealth = (_request: Request, response: Response): void => {
  const health = healthService.getRedisHealth();
  response.status(health.connected ? 200 : 503).json({ data: health });
};
