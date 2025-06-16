"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ImageCardProps {
  image: {
    _id: string
    imageUrl: string
    prompt: string
  }
  onDelete: (id: string) => void
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = async () => {
    if (!image?.imageUrl) return;

    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-image-${image._id}.jpg`;
      link.target = "_blank";
      link.rel = "noopener";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  return (
    <Card className="overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <img src={image.imageUrl || "/placeholder.svg"} alt={image.prompt} className="w-full h-full object-cover" />
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(image._id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-sm md:text-lg font-medium text-gray-950" title={image.prompt}>
          {image.prompt}
        </CardTitle>
      </CardContent>
    </Card>
  )
}