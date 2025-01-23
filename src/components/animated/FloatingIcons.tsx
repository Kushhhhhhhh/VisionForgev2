import { motion } from "framer-motion"
import {
  Camera,
  Image,
  Palette,
  Wand2,
  Sparkles,
  Brush,
  Layers,
  Shapes,
  Lightbulb,
  Zap,
  Aperture,
  Compass,
} from "lucide-react"

const icons = [
  { Icon: Camera, delay: 0, duration: 20 },
  { Icon: Image, delay: 2, duration: 15 },
  { Icon: Palette, delay: 1, duration: 18 },
  { Icon: Wand2, delay: 3, duration: 22 },
  { Icon: Sparkles, delay: 0.5, duration: 17 },
  { Icon: Brush, delay: 2.5, duration: 19 },
  { Icon: Layers, delay: 1.5, duration: 21 },
  { Icon: Shapes, delay: 3.5, duration: 16 },
  { Icon: Lightbulb, delay: 0.7, duration: 23 },
  { Icon: Zap, delay: 2.7, duration: 14 },
  { Icon: Aperture, delay: 1.2, duration: 20 },
  { Icon: Compass, delay: 3.2, duration: 18 },
]

const FloatingIcons = () => {
  // Add a check for window
  const getRandomPosition = () => {
    if (typeof window !== "undefined") {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }
    }
    return { x: 0, y: 0 } // Fallback for server-side rendering
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, delay, duration }, index) => {
        const { x, y } = getRandomPosition()
        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              opacity: 0,
              scale: 0,
              x,
              y,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              x: [
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0),
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0),
                Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0),
              ],
              y: [
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 0),
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 0),
                Math.random() * (typeof window !== "undefined" ? window.innerHeight : 0),
              ],
            }}
            transition={{
              delay,
              duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-8 h-8 text-indigo-600 opacity-50" />
          </motion.div>
        )
      })}
    </div>
  )
}

export default FloatingIcons