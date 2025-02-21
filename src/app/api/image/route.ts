import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post from "@/model/postModel";
import { Client } from "@gradio/client";
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

    const { prompt }: { prompt: string } = await request.json();
    if (!prompt.trim()) {
      console.error("Empty prompt received");
      return NextResponse.json(
        { error: "Prompt cannot be empty." },
        { status: 400 }
      );
    }

    console.log("Connecting to Gradio client...");

    const client = await Client.connect("black-forest-labs/FLUX.1-dev");
    console.log("Calling Gradio model for inference...");

    const result = await client.predict("/infer", {
      prompt: prompt,
      seed: 42,
      randomize_seed: true,
      width: 800,
      height: 800,
      guidance_scale: 3.5,
      num_inference_steps: 12,
    });

    console.log("Gradio response:", result.data);

    if (Array.isArray(result.data) && result.data.length > 0) {
      const imageData = result.data[0];
      if (typeof imageData === "object" && imageData !== null && "url" in imageData) {
        const imageUrl = imageData.url;

        // Step 1: Upload the image to Cloudinary
        console.log("Uploading image to Cloudinary...");

        const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, prompt);

        // Step 2: Save the Cloudinary URL to MongoDB
        await connectToDB();
        const newPost = new Post({
          userId,
          imageUrl: cloudinaryUrl, // Use the Cloudinary URL instead of the Gradio URL
          prompt,
        });
        await newPost.save();

        console.log("Image URL saved successfully:", cloudinaryUrl);
        return NextResponse.json({ url: cloudinaryUrl });
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
    console.error("Error in API route:", error);
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
    // Extract the authenticated user's ID
    const { userId: authUserId } = getAuth(request);
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to proceed." },
        { status: 401 }
      );
    }

    // Extract postId from query parameters
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");
    console.log("Received postId:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Find the post by ID
    const post = await Post.findById(postId);
    console.log("Post found:", post);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    // Ensure the authenticated user is authorized to delete the post
    if (post.userId.toString() !== authUserId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this post." },
        { status: 403 }
      );
    }

    // Delete the post
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
<<<<<<< HEAD
}
=======

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
>>>>>>> da117817b1e7ce22473216720e0443a6b03d7691
