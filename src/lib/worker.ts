import { createServer } from "node:http";
import { Worker, Job, UnrecoverableError } from "bullmq";
import { redisConnection } from "./redisConnection";
import { connectToDB } from "./db";
import JobModel from "@/model/jobModel";
import Post from "@/model/postModel";
import uploadImageToCloudinary, { type UploadedImage } from "./upload-to-cloud";
import type { ImageJobData } from "./queue";

async function main() {
  await connectToDB();

  const worker = new Worker<ImageJobData>(
    "image-generation",
    async (job: Job<ImageJobData>) => {
      const { jobId, userId, prompt, aspectRatio } = job.data;

      await JobModel.findOneAndUpdate({ jobId }, { status: "processing", $inc: { attempts: 1 } });

      const { url: imageUrl, width, height } = await generateImage(jobId, prompt, aspectRatio);

      await JobModel.findOneAndUpdate({ jobId }, { status: "completed", imageUrl });
      await Post.create({ userId, imageUrl, prompt, width, height });
    },
    {
      connection: redisConnection,
      concurrency: 5,
      // Idle polling counts against Upstash's command quota. New jobs still wake the worker
      // instantly, so a long drainDelay adds no latency. stalledInterval only affects how
      // fast a job orphaned by a crashed worker is recovered.
      drainDelay: 60,
      stalledInterval: 120_000,
    }
  );

  // BullMQ emits "failed" after every failed attempt, not just the last one.
  // Only mark the job failed once its retries are used up, otherwise the UI shows an error mid-retry.
  worker.on("failed", async (job, err) => {
    if (!job) return;
    const willRetry =
      job.attemptsMade < (job.opts.attempts ?? 1) && !(err instanceof UnrecoverableError);
    if (willRetry) {
      console.warn(
        `[WORKER] Job ${job.data.jobId} attempt ${job.attemptsMade} failed, retrying: ${err.message}`
      );
      return;
    }
    await JobModel.findOneAndUpdate(
      { jobId: job.data.jobId },
      { status: "failed", error: err.message }
    );
    console.error(`[WORKER] Job ${job.data.jobId} failed permanently:`, err.message);
  });

  worker.on("completed", job => console.log(`[WORKER] Job ${job.data.jobId} completed`));

  console.log("[WORKER] Ready — listening for image-generation jobs");

  // Hosts that only offer "web services" (e.g. Render's free tier) need something listening on $PORT.
  // Locally PORT is unset, so no server starts.
  const port = process.env.PORT;
  const healthServer = port
    ? createServer((_req, res) => {
        const healthy = worker.isRunning();
        res.writeHead(healthy ? 200 : 503, { "Content-Type": "text/plain" });
        res.end(healthy ? "ok" : "worker not running");
      }).listen(Number(port), "0.0.0.0", () => console.log(`[WORKER] Health endpoint listening on 0.0.0.0:${port}`))
    : null;

  // Graceful shutdown: finish in-flight jobs before exiting.
  // Without this, a restart (deploy, crash) leaves jobs stuck in "processing".
  const shutdown = async () => {
    healthServer?.close();
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

async function generateImage(jobId: string, prompt: string, aspectRatio: string): Promise<UploadedImage> {
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
    // Retrying can't fix these; UnrecoverableError makes BullMQ fail the job immediately
    if (res.status === 402) throw new UnrecoverableError("Insufficient pollen balance.");
    if (res.status === 401) throw new UnrecoverableError("Invalid API Key.");
    if (res.status === 429) throw new Error("Rate limit exceeded.");
    throw new Error(`Generation failed: ${res.status}`);
  }

  const buf     = Buffer.from(await res.arrayBuffer());
  const dataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  return uploadImageToCloudinary(dataUri, jobId);
}