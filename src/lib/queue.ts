import { Queue } from "bullmq";
import { getRedisConnection } from "./redisConnection";

export interface ImageJobData {
  jobId: string;
  userId: string;
  prompt: string;
  aspectRatio: string;
}

let imageQueue: Queue<ImageJobData> | null = null;

function getImageQueue() {
  imageQueue ??= new Queue<ImageJobData>("image-generation", {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 }, // BullMQ handles retries too
      removeOnComplete: { count: 100 },
      removeOnFail:     { count: 50 },
    },
  });
  return imageQueue;
}

export async function addImageJob(data: ImageJobData) {
  return getImageQueue().add("generate", data, { jobId: data.jobId });
}
