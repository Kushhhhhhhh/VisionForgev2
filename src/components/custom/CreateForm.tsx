"use client";

import { useState, useRef, useEffect } from "react";
import PlaceholdersAndVanishInput from "@/components/ui/placeholders-and-vanish-input";
import { placeholders } from "@/data/data";
import { motion } from "framer-motion";
import {
  ImageIcon,
  Loader2,
  Download,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AspectRatio = "1:1" | "16:9" | "4:3";

export default function CreateForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (imageUrl && imageContainerRef.current) {
      imageContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setError("");
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
        setError(errorData.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setImageUrl(data.url);
      setPrompt("");
    } catch (error) {
      console.error("Failed to fetch API:", error);
      setError("An unexpected error occurred. Please try again later.");
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
      const sanitizedPrompt = prompt.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      link.href = imageUrl;
      link.download = `${sanitizedPrompt}.jpg`;
      link.click();
    }
  };

  const getDimensions = () => {
    const baseWidth = 400;
    switch (aspectRatio) {
      case "16:9":
        return { width: baseWidth, height: Math.round(baseWidth * (9 / 16)) };
      case "4:3":
        return { width: baseWidth, height: Math.round(baseWidth * (4 / 3)) };
      default:
        return { width: baseWidth, height: baseWidth };
    }
  };

  const dimensions = getDimensions();

  return (
    <main className="w-full space-y-4">
      <section className="flex flex-col md:flex-row gap-12 justify-between">

        <div className="w-full md:w-1/2 space-y-4 mt-10">
          <label
            htmlFor="prompt"
            className="block text-2xl md:text-4xl font-extrabold text-center mb-8"
          >
            Describe your image
          </label>
          <PlaceholdersAndVanishInput
            ref={inputRef}
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-center">Choose aspect ratio</h3>
            <div role="radiogroup" aria-label="Aspect Ratio Selection" className="flex flex-wrap gap-4 justify-center">
              <Button
                variant={aspectRatio === "1:1" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("1:1")}
                disabled={loading}
                title="Square (1:1)"
                role="radio"
                aria-checked={aspectRatio === "1:1"}
              >
                <Square className="w-6 h-6" />
                <span className="text-xs">Square</span>
                <span className="text-xs text-muted-foreground">1:1</span>
              </Button>
              <Button
                variant={aspectRatio === "16:9" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("16:9")}
                disabled={loading}
                title="Landscape (16:9)"
                role="radio"
                aria-checked={aspectRatio === "16:9"}
              >
                <RectangleHorizontal className="w-6 h-6" />
                <span className="text-xs">Landscape</span>
                <span className="text-xs text-muted-foreground">16:9</span>
              </Button>
              <Button
                variant={aspectRatio === "4:3" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 p-3 h-auto"
                onClick={() => setAspectRatio("4:3")}
                disabled={loading}
                title="Portrait (4:3)"
                role="radio"
                aria-checked={aspectRatio === "4:3"}
              >
                <RectangleVertical className="w-6 h-6" />
                <span className="text-xs">Portrait</span>
                <span className="text-xs text-muted-foreground">4:3</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8">
          <h2 className="text-xl md:text-2xl font-semibold mt-8 text-gray-900 text-center">
            Generated Image
          </h2>
          <motion.div
            ref={imageContainerRef}
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
            disabled={loading || !imageUrl}
            className={`mt-8 px-8 py-6
            bg-indigo-500 text-white font-bold
            border-4 border-black
            shadow-[8px_8px_0_0_rgba(0,0,0,1)]
            flex items-center gap-2
            transition-transform duration-150 active:translate-x-1 active:translate-y-1
            disabled:opacity-50 disabled:shadow-none disabled:border-gray-400
            uppercase tracking-wider
            rounded-none
            font-brutal
            ${loading ? "cursor-not-allowed" : ""}
          `}
          >
            <Download className="w-5 h-5" />
            {loading ? "Downloading..." : "Download"}
          </Button>
          {!imageUrl && !loading && (
            <p className="text-sm text-gray-500">Generate an image to enable download</p>
          )}
        </div>
      </section>
    </main>
  );
}