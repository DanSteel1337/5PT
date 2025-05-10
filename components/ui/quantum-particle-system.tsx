"use client"

import { useRef, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  entangled: boolean
  entangledWith?: number
  connectionStrength: number
}

interface QuantumParticleSystemProps {
  className?: string
}

export function QuantumParticleSystem({ className }: QuantumParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const { address } = useAccount()
  const { useInvestorInfo } = useInvestmentManager()
  const { data: investorInfo } = useInvestorInfo(address)

  // Determine entanglement factor based on user's investment data
  const [entanglementFactor, setEntanglementFactor] = useState(0.2)

  useEffect(() => {
    if (investorInfo) {
      // Calculate entanglement factor based on investment activity
      const totalDeposit = Number(investorInfo[0] || 0n)
      const directRefs = Number(investorInfo[1] || 0n)
      const calculatedFactor = Math.min(0.8, 0.2 + (totalDeposit / 1000000000000000000) * 0.1 + directRefs * 0.05)
      setEntanglementFactor(calculatedFactor)
    }
  }, [investorInfo])

  const initParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 100

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: getParticleColor(),
        opacity: Math.random() * 0.5 + 0.3,
        entangled: Math.random() < entanglementFactor,
        connectionStrength: Math.random() * 0.8 + 0.2,
      })
    }

    // Create entangled pairs
    particles.forEach((particle) => {
      if (particle.entangled && !particle.entangledWith) {
        // Find another particle to entangle with
        const availableParticles = particles.filter((p) => p.id !== particle.id && !p.entangled)

        if (availableParticles.length > 0) {
          const partnerIndex = Math.floor(Math.random() * availableParticles.length)
          const partner = availableParticles[partnerIndex]

          particle.entangledWith = partner.id
          partner.entangled = true
          partner.entangledWith = particle.id
          partner.connectionStrength = particle.connectionStrength
        }
      }
    })

    particlesRef.current = particles
  }

  const getParticleColor = () => {
    const colors = [
      "rgba(212, 175, 55, 1)", // Gold
      "rgba(245, 215, 110, 1)", // Light gold
      "rgba(184, 134, 11, 1)", // Dark gold
      "rgba(255, 255, 255, 0.8)", // White
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const drawParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections between entangled particles
    particlesRef.current.forEach((particle) => {
      if (particle.entangled && particle.entangledWith !== undefined) {
        const partner = particlesRef.current.find((p) => p.id === particle.entangledWith)
        if (partner) {
          // Draw quantum connection
          const gradient = ctx.createLinearGradient(particle.x, particle.y, partner.x, partner.y)
          gradient.addColorStop(0, `rgba(212, 175, 55, ${0.2 * particle.connectionStrength})`)
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.5 * particle.connectionStrength})`)
          gradient.addColorStop(1, `rgba(212, 175, 55, ${0.2 * particle.connectionStrength})`)

          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.lineWidth = 0.5 * particle.connectionStrength

          // Create a wavy line for quantum effect
          const distance = Math.sqrt(Math.pow(partner.x - particle.x, 2) + Math.pow(partner.y - particle.y, 2))

          const steps = Math.floor(distance / 5)
          ctx.moveTo(particle.x, particle.y)

          for (let i = 0; i <= steps; i++) {
            const x = particle.x + (partner.x - particle.x) * (i / steps)
            const y = particle.y + (partner.y - particle.y) * (i / steps)

            // Add quantum wave effect
            const waveAmplitude = 2 * particle.connectionStrength
            const waveFrequency = 0.1
            const offset = Math.sin(Date.now() * 0.001 + i * waveFrequency) * waveAmplitude

            const perpX = -(partner.y - particle.y) / distance
            const perpY = (partner.x - particle.x) / distance

            ctx.lineTo(x + perpX * offset, y + perpY * offset)
          }

          ctx.stroke()
        }
      }
    })

    // Draw particles
    particlesRef.current.forEach((particle) => {
      ctx.beginPath()

      // Create a radial gradient for each particle
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)

      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)

      ctx.fillStyle = gradient
      ctx.globalAlpha = particle.opacity

      // Draw the particle
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Add a glow effect for entangled particles
      if (particle.entangled) {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${0.1 * particle.connectionStrength})`
        ctx.fill()
      }

      // Update particle position
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1
      }

      // Quantum behavior: entangled particles influence each other
      if (particle.entangled && particle.entangledWith !== undefined) {
        const partner = particlesRef.current.find((p) => p.id === particle.entangledWith)
        if (partner) {
          // Subtle attraction/repulsion based on quantum state
          const dx = partner.x - particle.x
          const dy = partner.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 200) {
            // Attract when far apart
            particle.vx += (dx / distance) * 0.01 * particle.connectionStrength
            particle.vy += (dy / distance) * 0.01 * particle.connectionStrength
          } else if (distance < 50) {
            // Repel when too close
            particle.vx -= (dx / distance) * 0.01 * particle.connectionStrength
            particle.vy -= (dy / distance) * 0.01 * particle.connectionStrength
          }

          // Limit velocity
          const maxVelocity = 0.8
          const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
          if (velocity > maxVelocity) {
            particle.vx = (particle.vx / velocity) * maxVelocity
            particle.vy = (particle.vy / velocity) * maxVelocity
          }
        }
      }

      // Particles react to mouse
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          // Particles are repelled by mouse
          particle.vx -= (dx / distance) * 0.2
          particle.vy -= (dy / distance) * 0.2
        }
      }
    })

    animationRef.current = requestAnimationFrame(drawParticles)
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

    animationRef.current = requestAnimationFrame(drawParticles)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationRef.current)
    }
  }, [entanglementFactor])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full -z-10 ${className}`} />
}
