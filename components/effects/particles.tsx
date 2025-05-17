"use client"

import { useRef, useState, useEffect } from "react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface ParticleProps {
  count?: number
  color?: string
  minSize?: number
  maxSize?: number
  minDuration?: number
  maxDuration?: number
  className?: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  direction: number
}

/**
 * Reusable particle effect component
 * Generates animated particles for background effects
 */
export function Particles({
  count = 20,
  color = "bg-purple-500/30",
  minSize = 2,
  maxSize = 5,
  minDuration = 5,
  maxDuration = 15,
  className = "",
}: ParticleProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const particles = useRef<Particle[]>([])
  const requestRef = useRef<number | null>(null)
  const [, setFrame] = useState(0) // Used only to trigger re-renders

  // Initialize particles
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    // Generate initial particles
    particles.current = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.9,
      direction: Math.random() * Math.PI * 2,
    }))

    // Force initial render
    setFrame(0)

    return () => {
      // Clean up animation frame on unmount
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [count, minSize, maxSize])

  // Animation loop
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    const animate = () => {
      // Create a new array instead of mutating the existing one
      const updatedParticles = particles.current.map((p) => {
        // Calculate new position
        const dx = Math.cos(p.direction) * p.speed
        const dy = Math.sin(p.direction) * p.speed
        let newX = p.x + dx
        let newY = p.y + dy
        let newDirection = p.direction

        // Bounce off edges
        if (newX <= 0 || newX >= width) {
          newDirection = Math.PI - newDirection
          newX = Math.max(0, Math.min(newX, width))
        }
        if (newY <= 0 || newY >= height) {
          newDirection = -newDirection
          newY = Math.max(0, Math.min(newY, height))
        }

        // Occasionally change direction slightly
        if (Math.random() < 0.02) {
          newDirection += (Math.random() - 0.5) * 0.2
        }

        // Occasionally change opacity
        const newOpacity = Math.max(0.1, Math.min(1, p.opacity + (Math.random() - 0.5) * 0.05))

        return {
          ...p,
          x: newX,
          y: newY,
          direction: newDirection,
          opacity: newOpacity,
        }
      })

      // Update ref without direct mutation
      particles.current = updatedParticles

      // Trigger re-render
      setFrame((prev) => prev + 1)

      // Continue animation loop
      requestRef.current = requestAnimationFrame(animate)
    }

    // Start animation loop
    requestRef.current = requestAnimationFrame(animate)

    // Cleanup function
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.current.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  )
}

export default Particles
