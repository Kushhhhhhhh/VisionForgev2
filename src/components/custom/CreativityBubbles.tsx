"use client"

import { useEffect, useRef } from "react"

const bubbleColors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"]

export default function CreativityBubbles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createBubble = () => {
      const bubble = document.createElement("div")
      bubble.classList.add("absolute", "rounded-full", "opacity-50")

      const size = Math.random() * 100 + 50
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`

      bubble.classList.add(bubbleColors[Math.floor(Math.random() * bubbleColors.length)])

      bubble.style.left = `${Math.random() * 100}%`
      bubble.style.top = `${container.offsetHeight + size}px`

      container.appendChild(bubble)

      const animation = bubble.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 0.5 },
          { transform: `translateY(-${container.offsetHeight + size}px) scale(1.5)`, opacity: 0 },
        ],
        {
          duration: Math.random() * 5000 + 5000,
          easing: "linear",
        },
      )

      animation.onfinish = () => {
        bubble.remove()
        createBubble()
      }
    }

    for (let i = 0; i < 10; i++) {
      createBubble()
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
     
    </div>
  )
}