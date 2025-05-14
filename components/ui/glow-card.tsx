"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: "low" | "medium" | "high"
  interactive?: boolean
  variant?: "default" | "panel" | "stat"
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(139, 92, 246, 0.5)",
  intensity = "medium",
  interactive = true,
  variant = "default",
}: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return

    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const intensityValues = {
    low: { blur: "15px", opacity: 0.3 },
    medium: { blur: "20px", opacity: 0.5 },
    high: { blur: "30px", opacity: 0.7 },
  }

  const { blur, opacity } = intensityValues[intensity]

  const variantStyles = {
    default: "rounded-xl",
    panel: "clip-path-[polygon(0_0,100%_0,100%_85%,85%_100%,0_100%)]",
    stat: "border-l-2 border-l-purple-500",
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-black/40 backdrop-filter backdrop-blur-md border border-purple-500/30",
        variantStyles[variant],
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {interactive && isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
            left: mousePosition.x,
            top: mousePosition.y,
            width: "150px",
            height: "150px",
            transform: "translate(-50%, -50%)",
            opacity,
            filter: `blur(${blur})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
