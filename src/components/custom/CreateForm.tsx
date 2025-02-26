"use client";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { placeholders } from "@/data/data";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Download, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type AspectRatio = "1:1" | "16:9" | "4:3";

export default function CreateForm() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Prompt cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Something went wrong"}`);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Failed to fetch API:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = prompt;
      link.click();
    }
  };

  // Calculate dimensions based on aspect ratio
  const getDimensions = () => {
    const baseWidth = 400; // Base width for the preview area
    switch (aspectRatio) {
      case "16:9":
        return { width: baseWidth, height: Math.round(baseWidth * (9 / 16)) };
      case "4:3":
        return { width: baseWidth, height: Math.round(baseWidth * (3 / 4)) };
      default:
        return { width: baseWidth, height: baseWidth }; // 1:1
    }
  };

  const dimensions = getDimensions();

  return (
    <main className="w-full space-y-4">
      <section className="flex flex-col md:flex-row gap-12 justify-between">
        {/* Left Section: Input Form */}
        <div className="w-full md:w-1/2 space-y-4 mt-10">
          <label
            htmlFor="prompt"
            className="block text-2xl md:text-4xl font-extrabold text-center mb-8"
          >
            Describe your image
          </label>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          {/* Aspect Ratio Selector */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-center">Choose aspect ratio</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant={aspectRatio === "1:1" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("1:1")}
              >
                <Square className="w-6 h-6" />
                <span className="text-xs">Square</span>
                <span className="text-xs text-muted-foreground">1:1</span>
              </Button>
              <Button
                variant={aspectRatio === "16:9" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("16:9")}
              >
                <RectangleHorizontal className="w-6 h-6" />
                <span className="text-xs">Landscape</span>
                <span className="text-xs text-muted-foreground">16:9</span>
              </Button>
              <Button
                variant={aspectRatio === "4:3" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("4:3")}
              >
                <RectangleVertical className="w-6 h-6" />
                <span className="text-xs">Portrait</span>
                <span className="text-xs text-muted-foreground">4:3</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section: Generated Image */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8">
          <h2 className="text-xl md:text-2xl font-semibold mt-8 text-gray-900 text-center">
            Generated Image
          </h2>
          <motion.div
            className="bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative"
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-gray-800 animate-spin" />
                <p className="text-gray-500 mt-2">Generating image...</p>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p>Your generated image will appear here</p>
              </div>
            )}
          </motion.div>
          <Button
            onClick={handleDownload}
            className="mt-8 px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2"
            disabled={loading || !imageUrl}
          >
            <Download className="w-5 h-5" />
            Download Image
          </Button>
        </div>
      </section>
    </main>
  );
}