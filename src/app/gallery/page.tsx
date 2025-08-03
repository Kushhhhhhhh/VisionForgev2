"use client";

import { motion } from "framer-motion";
import { Paintbrush, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GalleryComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 sm:p-12 text-center">
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Gallery Under Construction
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            I'm working hard to prepare something amazing!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {["🎨", "✨", "🖼️", "🌈", "🚀"].map((emoji, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 4
                }}
                className="text-4xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          <p className="text-gray-500 mb-8">
            In the meantime, why not create some new masterpieces?
          </p>

          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 text-sm text-gray-400"
          >
            <p>Pssst... check back soon for amazing AI-generated artworks!</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}