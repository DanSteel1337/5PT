"use client"

import { useEffect, useRef } from "react"

interface ParticleEffectProps {
  count?: number
  duration?: number
  colors?: string[]
  size?: number
  spread?: number
  className?: string
  trigger?: "auto" | "hover" | "none"
}

export function ParticleEffect({
  count = 20,
  duration = 2,
  colors = ["#8B5CF6", "#6366F1", "#3B82F6", "#A855F7"],
  size = 6,
  spread = 50,
  className = "",
  trigger = "auto",
}: ParticleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (trigger !== "auto" || !containerRef.current) return

    const createParticle = () => {
      if (!containerRef.current) return

      const particle = document.createElement("div")
      const color = colors[Math.floor(Math.random() * colors.length)]

      particle.style.position = "absolute"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.backgroundColor = color
      particle.style.borderRadius = "50%"
      particle.style.pointerEvents = "none"

      // Random starting position
      const startX = Math.random() * containerRef.current.offsetWidth
      const startY = Math.random() * containerRef.current.offsetHeight

      // Random ending position
      const endX = startX + (Math.random() - 0.5) * spread * 2
      const endY = startY - spread * Math.random() - 10 // Always move up a bit

      particle.style.left = `${startX}px`
      particle.style.top = `${startY}px`

      containerRef.current.appendChild(particle)

      // Animate the particle
      const animation = particle.animate(
        [
          {
            transform: "translate(0, 0) scale(0)",
            opacity: 0,
          },
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
            offset: 0.1,
          },
          {
            transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: duration * 1000,
          easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
        },
      )

      animation.onfinish = () => {
        if (containerRef.current?.contains(particle)) {
          containerRef.current.removeChild(particle)
        }
      }
    }

    // Create particles periodically
    const interval = setInterval(() => {
      for (let i = 0; i < Math.ceil(count / 5); i++) {
        createParticle()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [count, duration, colors, size, spread, trigger])

  return <div ref={containerRef} className={`relative overflow-hidden ${className}`} />
}
