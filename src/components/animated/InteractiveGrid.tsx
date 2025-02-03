"use client"

import { useEffect, useRef, useState } from "react"

const GRID_SIZE = 20
const DOT_SIZE = 4

interface Dot {
  x: number
  y: number
}

export default function StaticGrid() {
  const [dots, setDots] = useState<Dot[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDots = () => {
      if (!containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      const newDots: Dot[] = []

      for (let x = 0; x < width; x += GRID_SIZE) {
        for (let y = 0; y < height; y += GRID_SIZE) {
          newDots.push({ x, y })
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

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-indigo-400"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            left: dot.x,
            top: dot.y,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  )
}