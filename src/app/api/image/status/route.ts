import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Job from "@/model/jobModel";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobId = new URL(request.url).searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  await connectToDB();
  const job = await Job.findOne({ jobId, userId }); // userId check prevents peeking others' jobs

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // Return only what the frontend needs
  return NextResponse.json({
    jobId:    job.jobId,
    status:   job.status,           // "pending" | "processing" | "completed" | "failed"
    imageUrl: job.imageUrl ?? null,
    error:    job.error ?? null,
    attempts: job.attempts,
  });
}