"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "framer-motion"

interface LogoProps {
  size?: number
  withText?: boolean
  className?: string
  href?: string
  animated?: boolean
}

export function Logo({ size = 40, withText = true, className = "", href = "", animated = true }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  useEffect(() => {
    setMounted(true)

    if (animated && mounted && canvasRef.current && isInView) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const particles: Particle[] = []
      const particleCount = 20

      class Particle {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string

        constructor() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.size = Math.random() * 3 + 1
          this.speedX = (Math.random() - 0.5) * 1
          this.speedY = (Math.random() - 0.5) * 1
          this.color = `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`
        }

        update() {
          this.x += this.speedX
          this.y += this.speedY

          if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX
          }

          if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY
          }
        }

        draw() {
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const init = () => {
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle())
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < particles.length; i++) {
          particles[i].update()
          particles[i].draw()
        }

        requestAnimationFrame(animate)
      }

      init()
      animate()
    }
  }, [mounted, animated, isInView])

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
