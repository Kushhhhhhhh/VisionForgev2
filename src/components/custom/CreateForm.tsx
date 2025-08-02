"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaceholdersAndVanishInput from "@/components/ui/placeholders-and-vanish-input";
import { placeholders } from "@/data/data";
import {
  ImageIcon,
  Loader2,
  Download,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Sparkles,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AspectRatio = "1:1" | "16:9" | "4:3";

export default function CreateForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
      setError("Please describe what you want to create");
      return;
    }

    setError("");
    setLoading(true);
    setIsGenerating(true);

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
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.url);
      toast.success("Image generated successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `visionforge-${prompt.substring(0, 20).replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col xl:flex-row gap-12 xl:gap-24"
      >
      
        <div className="w-full xl:w-[55%] space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Create AI Art
            </h1>
            <p className="text-xl text-gray-600">
              Describe your vision and let our AI bring it to life
            </p>
          </motion.div>

          <div className="space-y-8">
            <PlaceholdersAndVanishInput
              ref={inputRef}
              placeholders={placeholders}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError("");
              }}
              onSubmit={handleSubmit}
              value={prompt}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-center text-gray-800">
                Aspect Ratio
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { value: "1:1", icon: Square, label: "Square" },
                  { value: "16:9", icon: RectangleHorizontal, label: "Wide" },
                  { value: "3:4", icon: RectangleVertical, label: "Portrait" },
                ].map((ratio) => (
                  <Button
                    key={ratio.value}
                    variant={aspectRatio === ratio.value ? "default" : "outline"}
                    className={`flex flex-col items-center gap-2 p-4 h-auto min-w-[100px] transition-all ${aspectRatio === ratio.value
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "hover:bg-gray-100"
                      }`}
                    onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                    disabled={loading}
                  >
                    <ratio.icon className="w-6 h-6" />
                    <span className="text-sm">{ratio.label}</span>
                    <span className="text-xs opacity-80">{ratio.value}</span>
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-6"
            >
              <Button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                size="lg"
                className={`w-full py-7 text-lg font-bold transition-all ${loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Generate Image
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-full xl:w-[45%] flex flex-col items-center gap-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            Your Creation
          </motion.h2>

          <div className="w-full flex justify-center px-4">
            <motion.div
              ref={imageContainerRef}
              className={`relative rounded-xl overflow-hidden shadow-2xl w-[80vw] max-w-[500px] ${!imageUrl ? "bg-gray-100 border-2 border-dashed border-gray-300" : ""
                }`}
              style={{
                aspectRatio: aspectRatio.replace(':', '/')
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <Wand2 className="w-12 h-12 text-indigo-600 animate-pulse" />
                    </div>
                    <p className="mt-4 text-gray-700 font-medium">
                      Crafting your masterpiece...
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`AI generated: ${prompt}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <p className="text-lg">Your generated image will appear here</p>
                  <p className="text-sm mt-2">
                    Describe what you want to create and click "Generate"
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-md"
          >
            <Button
              onClick={handleDownload}
              disabled={!imageUrl || loading}
              size="lg"
              variant="outline"
              className={`w-full py-6 text-lg font-bold border-2 ${!imageUrl
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                }`}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Image
            </Button>
          </motion.div>

          {imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-500"
            >
              <p>Don't forget to save your creation!</p>
              <p className="mt-1">Commercial use allowed</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}