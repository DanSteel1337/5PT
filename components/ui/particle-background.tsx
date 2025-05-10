"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  particleColor?: string
  particleSize?: number
  particleSpeed?: number
}

export function ParticleBackground({
  className,
  particleCount = 50,
  particleColor = "#d4af37",
  particleSize = 2,
  particleSpeed = 0.5,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

  const initParticles = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * particleSize + 1,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: (Math.random() - 0.5) * particleSpeed,
        color: particleColor,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    particlesRef.current = particles
  }, [particleCount, particleColor, particleSize, particleSpeed])

  const drawParticles = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((particle) => {
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Connect particles with lines if they are close enough
      particlesRef.current.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 - distance / 1000})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      })

      // Update particle position
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1
      }
    })

    animationFrameRef.current = requestAnimationFrame(drawParticles)
  }, [])

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    initParticles()
  }, [initParticles])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)

    animationFrameRef.current = requestAnimationFrame(drawParticles)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [drawParticles, handleResize])

  return <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full -z-10", className)} />
}
