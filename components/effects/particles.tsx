"use client"

import { useMemo } from "react"

interface ParticleProps {
  count?: number
  color?: string
  minSize?: number
  maxSize?: number
  minDuration?: number
  maxDuration?: number
  className?: string
}

/**
 * Reusable particle effect component
 * Generates animated particles for background effects
 */
export function Particles({
  count = 20,
  color = "bg-purple-500/30",
  minSize = 2,
  maxSize = 2,
  minDuration = 5,
  maxDuration = 15,
  className = "",
}: ParticleProps): JSX.Element {
  // Generate particles once to avoid recreating on each render
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: minSize + Math.random() * (maxSize - minSize),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${minDuration + Math.random() * (maxDuration - minDuration)}s`,
    }))
  }, [count, minSize, maxSize, minDuration, maxDuration])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-float ${color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default Particles
