import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post from "@/model/postModel";
import { Client } from "@gradio/client";

// Helper function to generate a random seed
function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100000000) + 1;
}

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

  const randomSeed = 42; // Fixed seed for consistency
  const width = 800; // Increased resolution
  const height = 800;
  const guidance_scale = 7; // Improved detail
  const num_inference_steps = 20; // More inference steps

  try {
    const client = await Client.connect("black-forest-labs/FLUX.1-dev");
    const result = await client.predict("/infer", {
      prompt: prompt,
      seed: randomSeed,
      randomize_seed: false, // Disable randomization
      width: width,
      height: height,
      guidance_scale: guidance_scale,
      num_inference_steps: num_inference_steps,
    });

    console.log("Gradio response:", result);

    if (Array.isArray(result.data) && result.data.length > 0) {
      const imageData = result.data[0];
      if (typeof imageData === "object" && imageData !== null && "url" in imageData) {
        const imageUrl = imageData.url;

        await connectToDB();
        const newPost = new Post({
          userId,
          imageUrl,
          prompt,
        });
        await newPost.save();

        return NextResponse.json({ url: imageUrl });
      } else {
        console.error("Unexpected response format:", result.data);
        return NextResponse.json(
          { error: "Failed to generate image due to unexpected response format." },
          { status: 500 }
        );
      }
    } else {
      console.error("Unexpected response format:", result.data);
      return NextResponse.json(
        { error: "Failed to generate image due to unexpected response format." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again later." },
      { status: 500 }
    );
  }
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