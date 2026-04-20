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
  CheckCircle2,
  Layers
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

  const aspectRatios = [
    { value: "1:1", icon: Square, label: "Square" },
    { value: "16:9", icon: RectangleHorizontal, label: "Landscape" },
    { value: "4:3", icon: RectangleVertical, label: "Portrait" },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");

      setImageUrl(data.url);
      setPrompt("");
      toast.success("Masterpiece ready!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setIsGenerating(false), 800);
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
      link.download = `visionforge-${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Saved to your device");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Subtle Header */}
      <div className="flex flex-col items-center mb-10 text-center space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold tracking-widest uppercase"
        >
          <Sparkles className="w-3 h-3" />
          AI Generation Studio
        </motion.div>
        <h2 className="text-xl sm:text-3xl font-bold sm:tracking-tight text-slate-900">
          What are we creating today?
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Controls (4/12) */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <div className="p-1 sm:p-6 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/40 shadow-sm shadow-indigo-500/5 space-y-8">
            
            {/* Input Group */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 ml-1">
                <Layers className="w-4 h-4 text-indigo-500" />
                Prompt Description
              </label>
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                onSubmit={handleSubmit}
                value={prompt}
              />
              {error && (
                <p className="text-xs text-red-500 mt-2 ml-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" /> {error}
                </p>
              )}
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">Canvas Size</label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => {
                  const isActive = aspectRatio === ratio.value;
                  return (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${
                        isActive 
                          ? "border-indigo-500 bg-white shadow-sm shadow-indigo-200" 
                          : "border-transparent bg-slate-100/50 hover:bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ratio.icon className={`w-5 h-5 mb-1 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-indigo-600" : ""}`}>
                        {ratio.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Generate Masterpiece
                </div>
              )}
            </Button>
          </div>
          
          {/* Subtle Trust Badges */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">HD Quality</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Fast Process</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Commercial Ready</span>
          </div>
        </div>

        {/* Right Column: Preview (7/12) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div 
            ref={imageContainerRef}
            className="relative group w-full bg-slate-200/30 rounded-[2.5rem] border-8 border-white/50 overflow-hidden shadow-md transition-all duration-500"
            style={{ aspectRatio: aspectRatio.replace(':', '/') }}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                    <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 animate-pulse">Analyzing Prompt...</p>
                </motion.div>
              ) : null}

              {imageUrl ? (
                <motion.div key="image" className="relative w-full h-full">
                  <motion.img
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={imageUrl}
                    alt="AI Generated"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    onClick={handleDownload}
                    className="absolute bottom-6 right-6 bg-white hover:bg-white/90 text-slate-900 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save Image
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-inner mb-6">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">The Canvas Awaits</h3>
                  <p className="text-sm text-slate-500 max-w-[240px]">
                    Your creation will materialize here in stunning high definition.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {imageUrl && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest"
            >
              <CheckCircle2 className="w-3 h-3" />
              Generation Complete
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}