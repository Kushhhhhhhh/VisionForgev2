import { NextResponse, NextRequest } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post, { IPost } from "@/model/postModel";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "8");

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-userId")
      .lean<IPost[]>();

    const stringifiedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
    }));

    return NextResponse.json(stringifiedPosts);
  } catch (error) {
    console.error("Error in gallery GET route:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery posts." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

    // Check admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "fullstack.kush@gmail.com";
    if (email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized to delete this post." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Valid Post ID required." }, { status: 400 });
    }

    await connectToDB();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    await post.deleteOne();
    return NextResponse.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}