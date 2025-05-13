"use client"

import type React from "react"
import { type ReactNode, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  perspective?: number
  glareOpacity?: number
  glareColor?: string
  disabled?: boolean
}

export function TiltCard({
  children,
  className = "",
  intensity = 10,
  perspective = 1000,
  glareOpacity = 0.2,
  glareColor = "rgba(255, 255, 255, 0.5)",
  disabled = false,
}: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate rotation based on mouse position
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * intensity
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * intensity

    // Calculate glare position
    const glareX = ((mouseX - rect.left) / rect.width) * 100
    const glareY = ((mouseY - rect.top) / rect.height) * 100

    setRotateX(rotateX)
    setRotateY(rotateY)
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseLeave = () => {
    if (disabled) return
    setRotateX(0)
    setRotateY(0)
  }

  if (!mounted)
    return (
      <div ref={cardRef} className={className}>
        {children}
      </div>
    )

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
    >
      {children}

      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor}, transparent 70%)`,
          opacity: glareOpacity,
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: disabled ? 0 : glareOpacity,
        }}
      />
    </motion.div>
  )
}

export default TiltCard
