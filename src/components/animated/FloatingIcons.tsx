"use client"

import { motion } from "framer-motion"
import { Camera, Image, Palette, Wand2 } from "lucide-react"

const icons = [
  { Icon: Camera, delay: 0 },
  { Icon: Image, delay: 0.2 },
  { Icon: Palette, delay: 0.4 },
  { Icon: Wand2, delay: 0.6 },
]

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay,
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 2,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingIcons