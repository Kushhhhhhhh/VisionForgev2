import IORedis from "ioredis";

let connection: IORedis | null = null;

export const isRedisConfigured = () => Boolean(process.env.REDIS_URL);

// Created on first use: every connection costs commands on Upstash's metered free tier.
export function getRedisConnection(): IORedis {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not set");
  }
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      keepAlive: 30_000, // TCP probes keep long idle blocking reads from being dropped
    });
    connection.on("error", (err: Error) => {
      console.error("[Redis/BullMQ] Connection error:", err.message);
    });
  }
  return connection;
}
