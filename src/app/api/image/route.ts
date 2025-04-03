import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post from "@/model/postModel";
import axios from "axios";
import uploadImageToCloudinary from "@/lib/upload-to-cloud";

export async function POST(request: NextRequest) {
  console.log("API request received");
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      console.error("Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized. Please log in to proceed." },
        { status: 401 }
      );
    }

    // Parse request body
    const { prompt, aspectRatio }: { prompt: string; aspectRatio: string } = await request.json();

    if (!prompt.trim()) {
      console.error("Empty prompt received");
      return NextResponse.json(
        { error: "Prompt cannot be empty." },
        { status: 400 }
      );
    }

    // Set dimensions based on aspect ratio
    let width = 800;
    let height = 800;

    switch (aspectRatio) {
      case "1:1":
        width = 800;
        height = 800;
        break;
      case "16:9":
        width = 1280;
        height = 720;
        break;
      case "4:3":
        width = 768;
        height = 1024;
        break;
      default:
        console.warn(`Unsupported aspect ratio: ${aspectRatio}. Using default 1:1.`);
        break;
    }

    console.log("Calling Pollination AI for inference...");
    const response = await axios.get(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
      {
        params: {
          model: 'flux', // High-quality model
          width,
          height,
          seed: 42, // Reproducible results
          private: true, // Disable watermark and public visibility
          enhance: true, // Enhance prompt for better results
        },
        responseType: 'arraybuffer', // Get image as binary data
      }
    );

    // Convert image buffer to base64 data URI
    const imageBase64 = Buffer.from(response.data).toString('base64');
    const dataUri = `data:image/jpeg;base64,${imageBase64}`;

    // Upload to Cloudinary
    console.log("Uploading image to Cloudinary...");
    const cloudinaryUrl = await uploadImageToCloudinary(dataUri, prompt);

    // Save to MongoDB
    await connectToDB();
    const newPost = new Post({
      userId,
      imageUrl: cloudinaryUrl,
      prompt,
    });
    await newPost.save();

    console.log("Image URL saved successfully:", cloudinaryUrl);
    return NextResponse.json({ url: cloudinaryUrl });
  } catch (error: any) {
    console.error("Error in API route:", error.message || error);
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
  try {
    const { userId: authUserId } = getAuth(request);
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to proceed." },
        { status: 401 }
      );
    }

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

    if (post.userId.toString() !== authUserId) {
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
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return NextResponse.json(
      { error: "Failed to delete post. Please try again later." },
      { status: 500 }
    );
  }
}