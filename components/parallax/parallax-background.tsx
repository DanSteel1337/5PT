"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { x, y } = useParallax(ref)

  // Create a grid of dots for the background
  const gridSize = 20
  const dots = []

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      dots.push({
        id: `dot-${i}-${j}`,
        x: `${(i / gridSize) * 100}%`,
        y: `${(j / gridSize) * 100}%`,
        delay: (i + j) * 0.05,
      })
    }
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900 via-gray-900 to-black"></div>

      {/* Grid of dots */}
      <div className="absolute inset-0">
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: dot.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-500/10 filter blur-3xl"
        style={{
          x: x,
          y: y,
          left: "20%",
          top: "30%",
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-500/10 filter blur-3xl"
        style={{
          x: x,
          y: y,
          right: "20%",
          bottom: "30%",
        }}
      />

      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
    </div>
  )
}
