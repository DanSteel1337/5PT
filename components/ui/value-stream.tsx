"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface ValueStreamProps {
  rate: number // Value per second
  symbol?: string
  className?: string
  particleCount?: number
}

export function ValueStream({ rate, symbol = "5PT", className = "", particleCount = 10 }: ValueStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      value: string
      x: number
      delay: number
    }>
  >([])

  useEffect(() => {
    if (!containerRef.current || rate <= 0) return

    // Calculate how many particles to show based on rate
    const actualCount = Math.min(Math.max(Math.ceil(rate * 2), 1), particleCount)

    // Create initial particles
    const initialParticles = Array.from({ length: actualCount }, (_, i) => ({
      id: i,
      value: (rate / actualCount).toFixed(2),
      x: Math.random() * 100, // Random horizontal position (%)
      delay: i * (3 / actualCount), // Stagger the particles
    }))

    setParticles(initialParticles)

    // Update particles periodically
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => {
          if (particle.delay > 0) {
            return { ...particle, delay: particle.delay - 0.1 }
          }

          // Reset particles that have completed their animation
          if (Math.random() < 0.1) {
            return {
              ...particle,
              x: Math.random() * 100,
              value: (rate / actualCount).toFixed(2),
            }
          }

          return particle
        }),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [rate, particleCount])

  return (
    <div ref={containerRef} className={`relative h-24 ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{ left: `${particle.x}%` }}
          initial={{
            y: "100%",
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: "-100%",
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeOut",
          }}
        >
          <span className="text-xs font-medium text-green-400 whitespace-nowrap">
            +{particle.value} {symbol}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
