import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

redis.on('error', (error) => {
  console.warn('Redis unavailable; cache operations will fall back to MongoDB', error.message);
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
