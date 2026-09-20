import { Worker, Job } from "bullmq";
import { redisConnection } from "./redisConnection";
import { connectToDB } from "./db";
import JobModel from "@/model/jobModel";
import Post from "@/model/postModel";
import uploadImageToCloudinary from "./upload-to-cloud";
import { withRetry } from "./utils";
import type { ImageJobData } from "./queue";

async function main() {
  await connectToDB();

  const worker = new Worker<ImageJobData>(
    "image-generation",
    async (job: Job<ImageJobData>) => {
      const { jobId, userId, prompt, aspectRatio } = job.data;

      await JobModel.findOneAndUpdate({ jobId }, { status: "processing", $inc: { attempts: 1 } });

      const imageUrl = await withRetry(
        () => generateImage(jobId, prompt, aspectRatio),
        { maxAttempts: 3, baseDelayMs: 1500, label: `job:${jobId}` }
      );

      await JobModel.findOneAndUpdate({ jobId }, { status: "completed", imageUrl });
      await Post.create({ userId, imageUrl, prompt });
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    await JobModel.findOneAndUpdate(
      { jobId: job.data.jobId },
      { status: "failed", error: err.message }
    );
    console.error(`[WORKER] Job ${job.data.jobId} failed permanently:`, err.message);
  });

  worker.on("completed", job => console.log(`[WORKER] Job ${job.data.jobId} completed`));

  console.log("[WORKER] Ready — listening for image-generation jobs");

  // Graceful shutdown: finish in-flight jobs before exiting.
  // Without this, a restart (deploy, crash) leaves jobs stuck in "processing".
  const shutdown = async () => {
    await worker.close();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("[WORKER] Startup failed:", err);
  process.exit(1);
});

async function generateImage(jobId: string, prompt: string, aspectRatio: string): Promise<string> {
  const seed = Math.floor(Math.random() * 2147483647);
  let width = 1024, height = 1024;
  if (aspectRatio === "16:9") { width = 1280; height = 720; }
  else if (aspectRatio === "9:16") { width = 720; height = 1280; }

  const params = new URLSearchParams({
    model: "flux", width: String(width), height: String(height),
    seed: String(seed), nologo: "true", private: "true",
    key: process.env.POLLINATIONS_API_KEY || "",
  });

  const res = await fetch(
    `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    if (res.status === 402) throw new Error("Insufficient pollen balance.");
    if (res.status === 401) throw new Error("Invalid API Key.");
    if (res.status === 429) throw new Error("Rate limit exceeded.");
    throw new Error(`Generation failed: ${res.status}`);
  }

  const buf     = Buffer.from(await res.arrayBuffer());
  const dataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  return uploadImageToCloudinary(dataUri, jobId);
}