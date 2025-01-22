"use client"

import { motion } from "framer-motion"
import AnimatedBackground from "../components/animated/AnimatedBackground"
import FloatingIcons from "../components/animated/FloatingIcons"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen py-20 flex justify-center relative overflow-hidden">
      <AnimatedBackground />
      <FloatingIcons />
      <section className="space-y-6 text-center z-10 px-4">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Create Stunning{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            AI-Generated Images
          </span>
        </motion.h1>
        <motion.p
          className="mx-auto max-w-[800px] text-lg md:text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Turn simple prompts into breathtaking AI-generated visuals. Unlock your creativity with the power of
          artificial intelligence and bring your ideas to life effortlessly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/create"
            className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </main>
  );
}