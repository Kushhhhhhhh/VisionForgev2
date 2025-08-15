"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GalleryItem {
  _id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const PAGE_LIMIT = 8;

export default function Gallery() {
  const { user } = useUser();
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const fetchPosts = async (skip = 0, append = false) => {
    try {
      const response = await fetch(`/api/gallery?skip=${skip}&limit=${PAGE_LIMIT}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data: GalleryItem[] = await response.json();

      if (data.length < PAGE_LIMIT) setHasMore(false);
      setPosts(prev => (append ? [...prev, ...data] : data));
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
            setLoadingMore(true);
            fetchPosts(posts.length, true);
          }
        },
        { threshold: 1 }
      );
      if (node) observer.observe(node);
      return () => observer.disconnect();
    },
    [loadingMore, posts, loading, hasMore]
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

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const wavingEmojis = ["👋", "🌟", "🎨", "🚀", "✨"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
     
      <div className="text-center mb-6">
        <motion.h1
          className="text-4xl font-bold flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Community Gallery{" "}

        </motion.h1>
        <div className="flex justify-center gap-6 my-6">
          {wavingEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              role="img"
              aria-label={`wave-${i}`}
              animate={{
                y: [0, -8, 0, 8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="text-2xl"
            >
              {emoji}
            </motion.span>
          ))}
        </div>


        <motion.p
          className="text-gray-600 mt-2 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Welcome to the wonderful creations of <span className="font-semibold">VisionForge</span> —
          where imagination takes center stage! 🌟
        </motion.p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">
          No posts yet. Be the first to create something!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map(post => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <motion.img
                  src={post.imageUrl}
                  loading="lazy"
                  alt={post.prompt}
                  className="w-full h-96 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600 line-clamp-2">{post.prompt}</p>

                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      className="ml-2"
                    >
                      {deletingId === post._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

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
