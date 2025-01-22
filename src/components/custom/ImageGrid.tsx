"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageCard from "./ImageCard";
import { Loader2 } from "lucide-react";

export default function ImageGrid() {

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/image", {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Failed to fetch images");
          return;
        }

        const data = await response.json();
        console.log(data);
        setImages(data); 
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/image?id=${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        console.error("Failed to delete image");
        return;
      }
  
      setImages((prevImages) => prevImages.filter((img) => img._id !== id));
      
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center text-center">
        <Loader2 className="animate-spin w-4 h-4 mr-4" /> Loading images...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id || index}  
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ImageCard image={image} onDelete={handleDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
}