import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection";

export interface ImageJobData {
  jobId: string;
  userId: string;
  prompt: string;
  aspectRatio: string;
}

export const imageQueue = new Queue<ImageJobData>("image-generation", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 }, // BullMQ handles retries too
    removeOnComplete: { count: 100 },
    removeOnFail:     { count: 50 },
  },
});

export async function addImageJob(data: ImageJobData) {
  return imageQueue.add("generate", data, { jobId: data.jobId });
}