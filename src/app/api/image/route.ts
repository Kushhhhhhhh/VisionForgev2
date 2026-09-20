import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Job from "@/model/jobModel";
import Post from "@/model/postModel";
import { addImageJob } from "@/lib/queue";
import { checkRateLimit } from "@/lib/rateLimiter";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { allowed, retryAfterMs } = await checkRateLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${Math.ceil(retryAfterMs / 1000)}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    const { prompt, aspectRatio } = await request.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    await connectToDB();

    const jobId = uuidv4();
    await Job.create({ jobId, userId, prompt, aspectRatio: aspectRatio || "1:1" });
    await addImageJob({ jobId, userId, prompt, aspectRatio: aspectRatio || "1:1" });

    return NextResponse.json({ jobId }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const postId = url.searchParams.get("id");
  await connectToDB();

  if (postId) {
    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json(post);
  }

  const posts = await Post.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: authUserId } = getAuth(request);
    if (!authUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

    await connectToDB();
    const post = await Post.findById(postId);

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.userId.toString() !== authUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}