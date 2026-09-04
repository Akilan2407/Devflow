import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

export const connectRedis = async (): Promise<void> => {
  if (redis.status === 'wait') {
    await redis.connect();
  }
};

export const getRedisHealth = (): { connected: boolean; state: string } => ({
  connected: redis.status === 'ready',
  state: redis.status,
});

export const disconnectRedis = async (): Promise<void> => {
  if (redis.status !== 'end') {
    await redis.quit();
  }
};
