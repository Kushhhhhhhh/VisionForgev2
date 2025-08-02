"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Trash2, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface ImageCardProps {
  image: {
    _id: string
    imageUrl: string
    prompt: string
    createdAt?: string
  }
  onDelete: (id: string) => Promise<void>
  isDeleting?: boolean
}

export default function ImageCard({ image, onDelete, isDeleting = false }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!image?.imageUrl) {
      toast.error("No image URL found")
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch(image.imageUrl)
      if (!response.ok) throw new Error("Failed to fetch image")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `visionforge-${image._id.slice(-6)}.jpg`
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      toast.success("Download started!")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to download image")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(image._id)
      toast.success("Image deleted successfully")
    } catch (error) {
      toast.error("Failed to delete image")
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card
      className="overflow-hidden relative group transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-[4/3] sm:aspect-[1/1]">
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.prompt}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/70 flex items-end p-3 sm:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full flex flex-col justify-between sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white mb-4 hover:bg-white/10 w-full sm:w-auto"
                    onClick={() => window.open(image.imageUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full
                  </Button>

                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full sm:w-auto"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full sm:w-auto"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-1">
        <CardTitle
          className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2"
          title={image.prompt}
        >
          {image.prompt}
        </CardTitle>
        {image.createdAt && (
          <p className="text-xs text-gray-500">
            Created: {formatDate(image.createdAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}