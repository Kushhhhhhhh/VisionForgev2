"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type React from "react"

const GRID_SIZE = 20
const DOT_SIZE = 4

interface Dot {
  x: number
  y: number
  opacity: number
}

export default function InteractiveGrid() {
  const [dots, setDots] = useState<Dot[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDots = () => {
      if (!containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      const newDots: Dot[] = []

      for (let x = 0; x < width; x += GRID_SIZE) {
        for (let y = 0; y < height; y += GRID_SIZE) {
          newDots.push({ x, y, opacity: 0.1 })
        }
      }

      setDots(newDots)
    }

    updateDots()
    window.addEventListener("resize", updateDots)

    return () => {
      window.removeEventListener("resize", updateDots)
    }
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const { left, top } = containerRef.current.getBoundingClientRect()
    const mouseX = event.clientX - left
    const mouseY = event.clientY - top

    setDots((prevDots) =>
      prevDots.map((dot) => {
        const distance = Math.sqrt(Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2))
        const maxDistance = 100
        const opacity = Math.max(0.1, 1 - distance / maxDistance)
        return { ...dot, opacity }
      }),
    )
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-indigo-400"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            left: dot.x,
            top: dot.y,
          }}
          animate={{ opacity: dot.opacity }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  )
}