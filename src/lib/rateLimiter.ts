import IORedis from "ioredis";

// Dedicated client — NOT shared with BullMQ.
// maxRetriesPerRequest: 2 means if Redis is down we fail fast and open
// (allow the request) instead of hanging the API route indefinitely.
const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 2,
  enableReadyCheck: false,
  lazyConnect: true, // don't connect at import time — only on first command
});

redis.on("error", (err: Error) => {
  console.error("[Redis/RateLimit] Connection error:", err.message);
});

interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export async function checkRateLimit(
  userId: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): Promise<RateLimitResult> {
  const { maxRequests = 5, windowMs = 60_000 } = options;
  const now   = Date.now();
  const key    = `ratelimit:${userId}`;
  // Unique member so two simultaneous requests don't collide on the same key
  const member = `${now}:${Math.random().toString(36).slice(2)}`;

  try {
    const results = await redis
      .pipeline()
      .zremrangebyscore(key, 0, now - windowMs) // drop timestamps outside window
      .zadd(key, now, member)                    // record this request
      .zcard(key)                                // count requests in window
      .pexpire(key, windowMs)                    // auto-clean the key
      .exec();

    const count = (results?.[2]?.[1] as number) ?? 0;

    if (count > maxRequests) {
      // Remove the entry we just added — this request is denied
      await redis.zrem(key, member);
      return { allowed: false, retryAfterMs: windowMs };
    }

    return { allowed: true, retryAfterMs: 0 };
  } catch {
    // Redis unavailable — fail open so a Redis outage doesn't block all users
    return { allowed: true, retryAfterMs: 0 };
  }
}