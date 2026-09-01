import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowSecs = Math.floor(windowMs / 1000);

  const pipeline = redis.multi();
  pipeline.incr(key);
  pipeline.expire(key, windowSecs, 'NX');

  const results = await pipeline.exec();
  
  if (!results) {
    throw new Error('Redis pipeline failed');
  }

  const currentCount = results[0][1] as number;
  const success = currentCount <= limit;
  const remaining = Math.max(0, limit - currentCount);
  const reset = now + windowMs;

  return {
    success,
    remaining,
    reset,
  };
}

export const API_RATE_LIMIT = { limit: 100, windowMs: 60 * 1000 };
export const AUTH_RATE_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };
export const UPLOAD_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };
