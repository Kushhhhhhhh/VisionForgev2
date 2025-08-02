"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function SecondaryCallToAction() {
  return (
    <motion.section 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Unleash Your <span className="text-yellow-300">Creativity</span> Today
          </h2>
          
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Experience the easiest way to create professional-quality visuals with AI. No design skills required.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/create"
                className="inline-block bg-white text-indigo-700 font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Creating Free
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/gallery"
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 transition-all duration-300"
              >
                See Examples
              </Link>
            </motion.div>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-indigo-100 text-sm md:text-base">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Commercial use allowed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}