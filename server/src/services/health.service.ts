import { getDatabaseHealth } from '../config/database.js';
import { getRedisHealth } from '../config/redis.js';

export const healthService = {
  getApplicationHealth: () => ({ status: 'ok' as const }),
  getDatabaseHealth,
  getRedisHealth,
};
