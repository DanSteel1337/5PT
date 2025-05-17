"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "framer-motion"
import type { JSX } from "react/jsx-runtime"

// Define Particle class type
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  update: () => void
  draw: () => void
}

interface LogoProps {
  size?: number
  withText?: boolean
  className?: string
  href?: string
  animated?: boolean
}

export function Logo({
  size = 40,
  withText = true,
  className = "",
  href = "",
  animated = true,
}: LogoProps): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: false })

  useEffect(() => {
    setMounted(true)

    if (animated && mounted && canvasRef.current && isInView) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const particles: Particle[] = []
      const getOptimalParticleCount = (): number => {
        // Base count
        const baseCount = 8

        // Check if device is high-end
        const isHighEnd = typeof window !== "undefined" && window.navigator.hardwareConcurrency > 4

        // Scale based on size
        const sizeFactor = size > 50 ? 1.5 : 1

        return Math.floor(baseCount * (isHighEnd ? sizeFactor : 0.5))
      }
      const particleCount = getOptimalParticleCount()
      let animationId: number

      class ParticleImpl implements Particle {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string
        frameCount = 0
        updateFrequency: number

        constructor() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.size = Math.random() * 2 + 1 // Reduced size range
          this.speedX = (Math.random() - 0.5) * 0.8 // Reduced speed
          this.speedY = (Math.random() - 0.5) * 0.8 // Reduced speed
          this.color = `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`
          // Optimize update frequency based on device capability
          this.updateFrequency = window.navigator.hardwareConcurrency > 4 ? 1 : 2
        }

        update(): void {
          // Only update position every 1 or 2 frames based on device capability
          if (this.frameCount % this.updateFrequency === 0) {
            this.x += this.speedX
            this.y += this.speedY

            if (this.x > canvas.width || this.x < 0) {
              this.speedX = -this.speedX
            }

            if (this.y > canvas.height || this.y < 0) {
              this.speedY = -this.speedY
            }
          }
          this.frameCount++
        }

        draw(): void {
          if (!ctx) return
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const init = (): void => {
        for (let i = 0; i < particleCount; i++) {
          particles.push(new ParticleImpl())
        }
      }

      const animate = (): void => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < particles.length; i++) {
          particles[i].update()
          particles[i].draw()
        }

        animationId = requestAnimationFrame(animate)
      }

      init()
      animate()

      // Cleanup function
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
    }
  }, [mounted, animated, isInView, size])

  if (!mounted) return null

  const logoContent = (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0"
        style={{
          width: size,
          height: size,
        }}
      >
        {animated && isInView && (
          <canvas
            ref={canvasRef}
            width={size * 1.5}
            height={size * 1.5}
            className="absolute -left-[25%] -top-[25%] z-0 pointer-events-none"
            style={{ willChange: "transform" }}
          />
        )}
        <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
        <div
          className="relative w-full h-full z-10"
          style={{ filter: "hue-rotate(60deg) drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))" }}
        >
          <Image src="/images/5pt-logo.png" alt="5PT Logo" width={size} height={size} className="object-contain" />
        </div>
      </div>
      {withText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse-slow">
            5PT
          </span>
          <span className="text-xs text-purple-300/80 -mt-1">FINANCE</span>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{logoContent}</Link>
  }

  return logoContent
}
