"use client"

import { useState } from "react"
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
    <Card className="overflow-hidden relative group transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-[4/3] sm:aspect-square">
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.prompt}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />

          {/* Action bar: always visible on mobile (no hover on touch), hover-reveal on desktop */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 bg-white/90 hover:bg-white text-gray-900"
              onClick={() => window.open(image.imageUrl, "_blank")}
              aria-label="View full image"
              title="View full"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 bg-white/90 hover:bg-white text-gray-900"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label="Download image"
              title="Download"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-9 w-9"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete image"
              title="Delete"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
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