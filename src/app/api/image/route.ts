import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Post from "@/model/postModel";
import uploadImageToCloudinary from "@/lib/upload-to-cloud";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { prompt, aspectRatio }: { prompt: string; aspectRatio: string } = await request.json();
    
    // 1. Setup dimensions & seed
    const seed = Math.floor(Math.random() * 2147483647); // Max seed from docs is 2147483647
    let width = 1024, height = 1024;

    if (aspectRatio === "16:9") { width = 1280; height = 720; }
    else if (aspectRatio === "4:3") { width = 1024; height = 768; }

    // 2. Construct URL based on docs: https://gen.pollinations.ai/image/{prompt}
    const params = new URLSearchParams({
      model: 'flux',         // Verified model ID from docs
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      nologo: 'true',
      private: 'true',
      key: process.env.POLLINATIONS_API_KEY || "", // Using query param for key as per docs
    });

    const pollUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params.toString()}`;

    console.log(`[POLLINATIONS] Requesting: ${pollUrl}`);

    // 3. Perform Fetch
    const response = await fetch(pollUrl, {
      method: 'GET',
      // We still include the header for safety, but the 'key' param above is more direct
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[POLLINATIONS ERROR] Status: ${response.status}`, errorData);
      
      // Map documentation error codes to user messages
      if (response.status === 402) throw new Error("Insufficient pollen balance.");
      if (response.status === 401) throw new Error("Invalid API Key.");
      if (response.status === 429) throw new Error("Rate limit exceeded.");
      
      throw new Error(`Generation failed with status ${response.status}`);
    }

    // 4. Handle Image Data (Returns image/jpeg as per docs)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageBase64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${imageBase64}`;

    console.log("[CLOUDINARY] Uploading...");
    const cloudinaryUrl = await uploadImageToCloudinary(dataUri, prompt);

    await connectToDB();
    const newPost = new Post({ userId, imageUrl: cloudinaryUrl, prompt, seed });
    await newPost.save();

    return NextResponse.json({ url: cloudinaryUrl });

  } catch (error: any) {
    console.error("[ERROR] Process failed:", error.message);
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