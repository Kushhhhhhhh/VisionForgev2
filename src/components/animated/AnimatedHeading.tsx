'use client'

import { motion } from 'framer-motion'

const AnimatedHeading = () => {
  return (
    <motion.h1
      className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Create Stunning{' '}
      <motion.span
        className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        AI-Generated Images
      </motion.span>
    </motion.h1>
  )
}

export default AnimatedHeading