"use client"

import { useRef, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
  angle: number
  glowing: boolean
}

export function EnhancedParticleSystem({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const { address } = useAccount()
  const { useInvestorInfo } = useInvestmentManager()
  const { data: investorInfo } = useInvestorInfo(address)

  // Determine particle density based on user's investment data
  const [particleDensity, setParticleDensity] = useState(50)
  const [glowIntensity, setGlowIntensity] = useState(0.5)

  useEffect(() => {
    if (investorInfo) {
      // Calculate particle density based on investment activity
      const totalDeposit = Number(investorInfo[0] || 0n)
      const directRefs = Number(investorInfo[1] || 0n)
      const calculatedDensity = Math.min(150, 50 + (totalDeposit / 1000000000000000000) * 10 + directRefs * 3)
      setParticleDensity(calculatedDensity)

      // Calculate glow intensity
      const calculatedGlow = Math.min(1.0, 0.5 + (totalDeposit / 1000000000000000000) * 0.05 + directRefs * 0.02)
      setGlowIntensity(calculatedGlow)
    }
  }, [investorInfo])

  const initParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []

    // Create particles
    for (let i = 0; i < particleDensity; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        color: getParticleColor(),
        angle: Math.random() * Math.PI * 2,
        glowing: Math.random() > 0.7, // 30% of particles will glow
      })
    }

    particlesRef.current = particles
  }

  const getParticleColor = () => {
    const colors = [
      "rgba(212, 175, 55, 1)", // Gold
      "rgba(245, 215, 110, 1)", // Light gold
      "rgba(184, 134, 11, 1)", // Dark gold
      "rgba(255, 255, 255, 0.8)", // White
      "rgba(255, 223, 0, 1)", // Yellow gold
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const drawParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections between particles
    particlesRef.current.forEach((particle, i) => {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const otherParticle = particlesRef.current[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 100) * glowIntensity})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      }
    })

    // Draw particles
    particlesRef.current.forEach((particle) => {
      ctx.beginPath()

      // Create a radial gradient for each particle
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * (particle.glowing ? 3 : 2),
      )

      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.globalAlpha = particle.opacity * (particle.glowing ? 1.5 * glowIntensity : 1)

      // Draw the particle
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Add a glow effect for special particles
      if (particle.glowing) {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${0.1 * glowIntensity})`
        ctx.fill()
      }

      // Update particle position
      particle.x += Math.cos(particle.angle) * particle.speed
      particle.y += Math.sin(particle.angle) * particle.speed

      // Slightly change angle for organic movement
      particle.angle += (Math.random() - 0.5) * 0.05

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.angle = Math.PI - particle.angle
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.angle = -particle.angle
      }

      // Particles react to mouse
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          // Particles are attracted by mouse
          particle.angle = Math.atan2(dy, dx)
          particle.speed = 0.5 + (1 - distance / 100) * 1.5

          // Increase glow for particles near mouse
          if (distance < 50) {
            particle.glowing = true
            particle.opacity = Math.min(1, particle.opacity + 0.01)
          }
        } else {
          // Gradually return to normal speed
          particle.speed = Math.max(0.1, particle.speed * 0.98)
        }
      }
    })

    animationFrameRef.current = requestAnimationFrame(drawParticles)
  }

  const handleResize = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    initParticles()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    handleResize()
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    animationFrameRef.current = requestAnimationFrame(drawParticles)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [particleDensity, glowIntensity])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full -z-10 ${className}`} />
}
