import crypto from 'crypto';
import { redis } from './rate-limit';

export function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
  const hash = crypto.createHash('sha256').update(parts.join(':')).digest('hex');
  return `idempotency:${prefix}:${hash}`;
}

export async function checkIdempotency(key: string): Promise<{ exists: boolean; result?: unknown }> {
  const data = await redis.get(key);
  
  if (!data) {
    return { exists: false };
  }

  try {
    const result = JSON.parse(data);
    return { exists: true, result };
  } catch (e) {
    return { exists: true };
  }
}

export async function setIdempotencyResult(
  key: string,
  result: unknown,
  ttlSeconds: number = 86400
): Promise<void> {
  await redis.set(key, JSON.stringify(result), 'EX', ttlSeconds);
}
