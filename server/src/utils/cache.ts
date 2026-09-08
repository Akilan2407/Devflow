import { redis } from '../config/redis.js';

export const CACHE_TTL = {
  organization: 60,
  list: 30,
  detail: 60,
  analytics: 30,
} as const;

const cacheMetrics = { hits: 0, misses: 0, errors: 0 };

const reportRedisError = (operation: string, error: unknown): void => {
  cacheMetrics.errors += 1;
  console.warn(`Redis cache ${operation} failed; continuing with MongoDB`, error);
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redis.get(key);
    if (value === null) {
      cacheMetrics.misses += 1;
      return null;
    }
    cacheMetrics.hits += 1;
    return JSON.parse(value) as T;
  } catch (error) {
    reportRedisError('read', error);
    cacheMetrics.misses += 1;
    return null;
  }
};

export const setCache = async <T>(key: string, value: T, ttlSeconds: number): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    reportRedisError('write', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    reportRedisError('delete', error);
  }
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length) await redis.del(...keys);
    } while (cursor !== '0');
  } catch (error) {
    reportRedisError('pattern delete', error);
  }
};

export const cacheKey = (scope: string, values: Record<string, unknown>): string =>
  `devflow:${scope}:${JSON.stringify(values, Object.keys(values).sort())}`;

export const getCacheMetrics = (): Readonly<typeof cacheMetrics> => ({ ...cacheMetrics });