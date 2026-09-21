"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import * as m from "framer-motion/m";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MasonryGrid from "./MasonryGrid";

interface GalleryItem {
  _id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
  width?: number;
  height?: number;
}

const PAGE_LIMIT = 8;

export default function Gallery() {
  const { user } = useUser();
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const isAdmin = user?.publicMetadata?.isAdmin === true;

  const fetchPosts = async (cursor: string | null = null, append = false) => {
    // Guard against concurrent fetches (observer can fire twice before state updates)
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
      if (cursor) params.set("cursor", cursor);

      const response = await fetch(`/api/gallery?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data: { posts: GalleryItem[]; nextCursor: string | null } = await response.json();

      setNextCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
      setPosts(prev => {
        if (!append) return data.posts;
        // Dedupe by _id so a repeated page never produces duplicate React keys
        const seen = new Set(prev.map(p => p._id));
        return [...prev, ...data.posts.filter(p => !seen.has(p._id))];
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingMore || loading || !hasMore) return;
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            observer.disconnect(); // stop further triggers until the ref re-attaches with a new cursor
            setLoadingMore(true);
            fetchPosts(nextCursor, true);
          }
        },
        { threshold: 1 }
      );
      if (node) observer.observe(node);
      return () => observer.disconnect();
    },
    [loadingMore, loading, hasMore, nextCursor]
  );

  const handleDelete = async (postId: string) => {
    if (!isAdmin || !postId) return;

    setDeletingId(postId);
    try {
      const res = await fetch(`/api/gallery?id=${postId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 403) {
        toast.error("You need admin privileges to delete posts");
        return;
      }

      if (!res.ok) throw new Error(data.error || "Failed to delete post");

      setPosts(prev => prev.filter(p => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const wavingEmojis = ["👋", "🌟", "🎨", "🚀", "✨"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          Community Gallery
        </h1>
        <div className="flex justify-center gap-6 my-6">
          {wavingEmojis.map((emoji, i) => (
            <span
              key={i}
              role="img"
              aria-label={`wave-${i}`}
              className="bobbing text-2xl"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mt-2 text-lg">
          Welcome to the wonderful creations of <span className="font-semibold">VisionForge</span> —
          where imagination takes center stage! 🌟
        </p>
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">
          No posts yet. Be the first to create something!
        </p>
      ) : (
        <>
          <MasonryGrid
            items={posts}
            columns={{ base: 2, md: 3, lg: 4 }}
            renderItem={post => (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl overflow-hidden shadow-md bg-gray-100"
              >
                <img
                  src={post.imageUrl}
                  loading="lazy"
                  alt="AI generated artwork"
                  width={post.width}
                  height={post.height}
                  style={post.width && post.height ? { aspectRatio: `${post.width} / ${post.height}` } : undefined}
                  className="w-full h-auto block object-cover"
                />

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="absolute top-2 right-2 h-9 w-9 shadow-lg"
                    aria-label="Delete post"
                  >
                    {deletingId === post._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </m.div>
            )}
          />

          {hasMore && (
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {loadingMore && <Loader2 className="w-6 h-6 animate-spin" />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
