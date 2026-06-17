import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Safe wrapper functions that won't crash the app if Redis goes down
export async function cacheGet(key: string): Promise<string | null> {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    return await redis.get(key);
  } catch (err) {
    console.error('Redis cacheGet error:', err);
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds: number = 3600): Promise<boolean> {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    const result = await redis.set(key, value, 'EX', ttlSeconds);
    return result === 'OK';
  } catch (err) {
    console.error('Redis cacheSet error:', err);
    return false;
  }
}

export async function cacheInvalidate(key: string): Promise<boolean> {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    const result = await redis.del(key);
    return result > 0;
  } catch (err) {
    console.error('Redis cacheInvalidate error:', err);
    return false;
  }
}

export default redis;
