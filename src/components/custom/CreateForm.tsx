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
  Wand2,
  Palette,
  Clock,
  CheckCircle2
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
      imageContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImageUrl(data.url);
      setPrompt("");
      toast.success("Image generated successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
      setError(error.message);
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
      link.download = `visionforge-${prompt.substring(0, 20).replace(/\s+/g, "-") || "creation"}.jpg`;
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

  const aspectRatios = [
    { value: "1:1", icon: Square, label: "Square", description: "Perfect for social media" },
    { value: "16:9", icon: RectangleHorizontal, label: "Landscape", description: "Ideal for desktop wallpapers" },
    { value: "4:3", icon: RectangleVertical, label: "Portrait", description: "Great for mobile & stories" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      
      <main className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16"
        >
          {/* Left Column - Input Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI Image Generator</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Bring Your Ideas
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  to Life with AI
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg">
                Transform your imagination into stunning visuals. Just describe what you want to see, and watch the magic happen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    Your Prompt
                  </label>
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
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </motion.p>
                )}

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Aspect Ratio
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                        disabled={loading}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          aspectRatio === ratio.value
                            ? "border-indigo-600 bg-indigo-50/50"
                            : "border-slate-200 hover:border-indigo-300 hover:bg-white"
                        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <ratio.icon className={`w-6 h-6 ${
                            aspectRatio === ratio.value ? "text-indigo-600" : "text-slate-500"
                          }`} />
                          <div>
                            <div className={`font-medium ${
                              aspectRatio === ratio.value ? "text-indigo-600" : "text-slate-700"
                            }`}>
                              {ratio.label}
                            </div>
                            <div className="text-xs text-slate-500">{ratio.value}</div>
                          </div>
                          {aspectRatio === ratio.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !prompt.trim()}
                  size="lg"
                  className={`w-full py-7 text-lg font-semibold rounded-xl transition-all ${
                    loading
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Creating your masterpiece...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-3" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>HD Quality</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Fast Generation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Commercial Use</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Preview Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-xl sticky top-8 space-y-6"
            >
              <div className="text-center lg:text-left space-y-2">
                <h2 className="text-2xl font-semibold text-slate-800">Preview</h2>
                <p className="text-slate-500">Your generated image will appear here</p>
              </div>

              <motion.div
                ref={imageContainerRef}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-white border border-white/50"
                style={{
                  aspectRatio: aspectRatio.replace(':', '/')
                }}
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping" />
                        <Wand2 className="relative w-12 h-12 text-indigo-600 animate-pulse" />
                      </div>
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-slate-700 font-medium"
                      >
                        Crafting your vision...
                      </motion.p>
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-slate-500"
                      >
                        This may take a few seconds
                      </motion.p>
                    </motion.div>
                  ) : null}

                  {imageUrl ? (
                    <motion.img
                      key="image"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={imageUrl}
                      alt={`AI generated: ${prompt}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-8"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                        <ImageIcon className="w-12 h-12 text-indigo-400" />
                      </div>
                      <p className="text-slate-600 text-center text-lg font-medium">
                        Ready to create something amazing
                      </p>
                      <p className="text-slate-400 text-center text-sm mt-2 max-w-xs">
                        Enter your prompt above and watch the AI transform your words into art
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {imageUrl && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-4 right-4 flex gap-2"
                  >
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      className="bg-white/90 hover:bg-white text-indigo-600 backdrop-blur-sm border border-white/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {imageUrl && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-sm text-slate-500 bg-white/50 backdrop-blur-sm rounded-lg p-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Image generated successfully</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}