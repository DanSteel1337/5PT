"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface HolographicCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glowColor?: string
  borderColor?: string
  holographicEffect?: boolean
  depth?: number
}

export function HolographicCard({
  children,
  className,
  intensity = 10,
  glowColor = "rgba(212, 175, 55, 0.5)",
  borderColor = "rgba(212, 175, 55, 0.3)",
  holographicEffect = true,
  depth = 20,
}: HolographicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig)

  // Holographic effect values
  const glowX = useTransform(mouseX, [-0.5, 0.5], [-100, 100])
  const glowY = useTransform(mouseY, [-0.5, 0.5], [-100, 100])

  // Handle mouse move on card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalize mouse position between -0.5 and 0.5
    const normalizedX = (e.clientX - centerX) / rect.width
    const normalizedY = (e.clientY - centerY) / rect.height

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-md bg-black/40 border",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-gold/5 before:to-transparent",
        "circuit-pattern",
        className,
      )}
      style={{
        perspective: 1000,
        borderColor: borderColor,
        boxShadow: isHovered ? `0 0 20px ${glowColor}` : `0 0 15px rgba(212, 175, 55, 0.1)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      animate={{
        scale: isHovered ? 1.02 : 1,
        transition: { duration: 0.3 },
      }}
    >
      {/* 3D Transformation Container */}
      <motion.div
        className="relative z-10 h-full"
        style={{
          rotateX: holographicEffect ? rotateX : 0,
          rotateY: holographicEffect ? rotateY : 0,
        }}
      >
        {/* Holographic overlay effect */}
        {holographicEffect && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0) 100%
              )`,
              backgroundPosition: `${glowX.get()}% ${glowY.get()}%`,
              backgroundSize: "200% 200%",
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Depth layers for 3D effect */}
        <motion.div
          className="relative z-10"
          style={{
            transform: isHovered ? `translateZ(${depth}px)` : "translateZ(0px)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Holographic edge glow */}
      {holographicEffect && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(
              circle at ${50 + mouseX.get() * 100}% ${50 + mouseY.get() * 100}%,
              ${glowColor} 0%,
              transparent 70%
            )`,
            opacity: 0.15,
            mixBlendMode: "screen",
          }}
        />
      )}
    </motion.div>
  )
}
