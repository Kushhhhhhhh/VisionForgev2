"use client"

import { motion } from "framer-motion"
import AnimatedBackground from "../components/animated/AnimatedBackground"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"

const FloatingIcons = dynamic(() => import("@/components/animated/FloatingIcons"), { ssr: false });

const showcaseImages = Array.from({ length: 16 }, (_, i) => `/ai-image-${i + 1}.jpg`);

export default function Home() {
  return (
    <main className="min-h-screen py-20 relative overflow-hidden bg-white">
      <AnimatedBackground />
      <FloatingIcons />

      <div className="max-w-7xl mx-auto">

        <section className="space-y-6 text-center z-10">
          <div className="flex justify-center items-center my-10">
            <Link
              href="https://www.producthunt.com/products/vision-forge?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vision&#0045;forge" target="_blank">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=834213&theme=dark&t=1738234916609" alt="Vision&#0032;Forge - Stunning&#0032;AI&#0045;generated&#0032;images&#0044;&#0032;just&#0032;a&#0032;click&#0032;away&#0046; | Product Hunt"
                className="object-cover"
              />
            </Link>
          </div>

          <motion.h1
            className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Create Stunning{" "}
            <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
              AI-Generated Images
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto text-lg md:text-xl text-gray-700 max-w-3xl"
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
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started - It's Free
            </Link>
          </motion.div>
        </section>

        <section className="py-20 z-10 px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose VisionForge?
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              The most powerful free AI image generation platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast",
                description: "Generate high-quality images in seconds with our optimized AI models",
                icon: "⚡"
              },
              {
                title: "No Watermarks",
                description: "All images are completely free to use without any branding",
                icon: "🖼️"
              },
              {
                title: "Multiple Styles",
                description: "Photorealistic, digital art, anime, fantasy, and more",
                icon: "🎨"
              },
              {
                title: "High Resolution",
                description: "Crisp, clear images suitable for any project",
                icon: "🔍"
              },
              {
                title: "Easy to Use",
                description: "Simple interface that anyone can master in minutes",
                icon: "✨"
              },
              {
                title: "Free Forever",
                description: "No hidden costs - we believe in accessible AI for everyone",
                icon: "💎"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-purple-400 transition-all shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          className="relative py-20 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 transform -skew-y-2 origin-top-left z-0" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h2
                className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to <span className="text-yellow-300">Transform</span> Your Ideas?
              </motion.h2>

              <motion.p
                className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Join our community of 50,000+ creators generating stunning AI visuals every day. No credit card required.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center bg-white text-indigo-600 font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  Start Creating Now
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Explore Gallery
                </Link>
              </motion.div>

              <motion.div
                className="mt-8 flex items-center justify-center space-x-4 text-indigo-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="py-20 z-10 px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Gallery of Creations
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              See what our community has created with VisionForge
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {showcaseImages.map((image, index) => (
              <motion.div
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-purple-500 transition-all shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image
                  src={image}
                  alt={`AI generated image ${index + 1}`}
                  fill
                  className="object-cover group-hover:brightness-110 transition-all"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                  <span className="text-white font-medium">Prompt: {[
                    "Cyberpunk cityscape",
                    "Fantasy castle in clouds",
                    "Portrait of an elven queen",
                    "Futuristic spaceship",
                    "Surreal landscape",
                    "Cute anime character",
                    "Hyperrealistic wildlife",
                    "Steampunk machinery",
                    "Abstract cosmic art"
                  ][index % 9]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}