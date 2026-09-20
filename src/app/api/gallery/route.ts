import { NextResponse, NextRequest } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post, { IPost } from "@/model/postModel";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "8"), 50);

    const query = cursor && mongoose.Types.ObjectId.isValid(cursor)
      ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
      : {};

    // Fetch one extra to determine if another page exists
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select("-userId")
      .lean<IPost[]>();

    const hasMore = posts.length > limit;
    const page = posts.slice(0, limit).map(post => ({
      ...post,
      _id: post._id.toString(),
    }));

    return NextResponse.json({
      posts: page,
      nextCursor: hasMore ? page[page.length - 1]._id : null,
    });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (user.privateMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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