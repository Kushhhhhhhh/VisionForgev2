import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post from "@/model/postModel";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to proceed." },
      { status: 401 }
    );
  }

  const { prompt }: { prompt: string } = await request.json();

  if (!prompt.trim()) {
    return NextResponse.json(
      { error: "Prompt cannot be empty." },
      { status: 400 }
    );
  }

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100000000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const width = 400;
  const height = 400;
  const model = "flux";

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    prompt
  )}?width=${width}&height=${height}&seed=${randomSeed}&model=${model}&nologo=True&enhance=True`;

  await connectToDB();

  const newPost = new Post({
    userId,
    imageUrl,
    prompt, 
  });

  await newPost.save();

  return NextResponse.json({ url: imageUrl });
}

export async function GET(request: NextRequest) {

  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to proceed." },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const postId = url.searchParams.get("id");

  await connectToDB();

  if (postId) {
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  }

  const posts = await Post.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("id");

  console.log("Received postId:", postId);

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required." },
      { status: 400 }
    );
  }

  await connectToDB();

  const post = await Post.findById(postId);
  console.log("Post found:", post);

  if (!post) {
    return NextResponse.json(
      { error: "Post not found." },
      { status: 404 }
    );
  }

  const { userId } = post;

  if (post.userId !== userId) {
    return NextResponse.json(
      { error: "Unauthorized to delete this post." },
      { status: 403 }
    );
  }

  await post.deleteOne();

  return NextResponse.json(
    { message: "Post deleted successfully." },
    { status: 200 }
  );
}