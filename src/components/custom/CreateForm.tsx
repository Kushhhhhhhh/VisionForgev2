"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { placeholders } from "@/data/data";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateForm() {

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ prompt }),
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
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <p className="text-sm text-gray-500 italic font-bold mt-12 text-center">
       ( New features coming soon... )
      </p>
    </div>

    <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-8">
      <h2 className="text-xl md:text-2xl font-semibold mt-8 text-gray-900 text-center">
        Generated Image
      </h2>
      <motion.div
        className="bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative"
        style={{ width: "400px", height: "400px" }}
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
        disabled={loading}
      >
        <Download className="w-5 h-5" />
        Download Image
      </Button>
    </div>
  </section>
</main>
  );
}