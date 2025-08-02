"use client"

import { motion } from "framer-motion"
import { Cpu, Zap, Palette, UserCheck, Sparkles, Infinity } from "lucide-react"

export const features = [
  {
    icon: Sparkles,
    title: "Cutting-Edge AI",
    description: "Harness our advanced AI models to create breathtaking visuals that push creative boundaries.",
    color: "text-purple-500",
    delay: 0.1
  },
  {
    icon: Infinity,
    title: "Unlimited Possibilities",
    description: "Generate as many images as you need with no restrictions - your creativity is the limit.",
    color: "text-indigo-500",
    delay: 0.2
  },
  {
    icon: Palette,
    title: "Diverse Artistic Styles",
    description: "From photorealistic to anime, steampunk to abstract - explore endless visual styles.",
    color: "text-blue-500",
    delay: 0.3
  },
  {
    icon: Zap,
    title: "Lightning Fast Results",
    description: "Get high-quality images in seconds with our optimized AI architecture.",
    color: "text-yellow-500",
    delay: 0.4
  },
  {
    icon: UserCheck,
    title: "Intuitive Interface",
    description: "Designed for everyone - no technical skills required to create masterpieces.",
    color: "text-green-500",
    delay: 0.5
  },
  {
    icon: Cpu,
    title: "Constantly Improving",
    description: "We continuously update our models to deliver the most advanced AI generation.",
    color: "text-red-500",
    delay: 0.6
  }
];

export default function FeaturesList() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Why <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">VisionForge</span> Stands Out
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          The most comprehensive free AI image generation platform available today
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`${feature.color} mb-4`}>
              <feature.icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}