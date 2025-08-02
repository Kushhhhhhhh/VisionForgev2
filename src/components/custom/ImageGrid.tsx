"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageCard from "./ImageCard";
import { Loader2, ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageGrid() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/image", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/image?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages((prevImages) => prevImages.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
        <p className="text-gray-600">Loading your creations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
        <ImageOff className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600">{error}</p>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={fetchImages}
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (images.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center"
      >
        <ImageOff className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600">No images found. Start creating!</p>
        <Button asChild>
          <a href="/create">Generate Your First Image</a>
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {loading && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2 z-50"
          >
            <Loader2 className="animate-spin w-4 h-4" />
            <span className="text-sm">Updating gallery...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-6 lg:px-8"
      >
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ImageCard
                image={image}
                onDelete={handleDelete}
                isDeleting={deletingId === image._id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}