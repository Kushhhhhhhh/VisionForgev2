import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
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
    const { userId, sessionClaims } = getAuth(request);

    if (!userId || !sessionClaims) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Valid Post ID required." }, { status: 400 });
    }

    // ✅ Extract primary email from claims (consistent with Clerk backend)
    const primaryEmail = sessionClaims.primaryEmail || sessionClaims.email;

    // ✅ Optional logging (remove in production)
    console.log("Session Claims:", JSON.stringify(sessionClaims, null, 2));
    console.log("Primary Email:", primaryEmail);

    // ✅ Use ENV variable (recommended) or fallback hardcoded
    const adminEmail = process.env.ADMIN_EMAIL || "fullstack.kush@gmail.com";
    const isAdmin = primaryEmail === adminEmail;

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized to delete this post." }, { status: 403 });
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
