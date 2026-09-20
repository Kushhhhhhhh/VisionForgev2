import IORedis from "ioredis";

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Without this listener Node.js treats every retry as an unhandled error event
// and crashes / spams the console. This converts it to a quiet, handled log.
redisConnection.on("error", (err: Error) => {
  console.error("[Redis/BullMQ] Connection error:", err.message);
});