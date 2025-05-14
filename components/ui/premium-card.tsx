"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "accent" | "dark"
  hoverEffect?: boolean
  borderGlow?: boolean
  innerGlow?: boolean
  className?: string
}

export function PremiumCard({
  children,
  variant = "primary",
  hoverEffect = true,
  borderGlow = true,
  innerGlow = false,
  className,
  ...props
}: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const variantStyles = {
    primary: "from-purple-900/20 to-indigo-900/20 border-purple-500/30",
    secondary: "from-blue-900/20 to-cyan-900/20 border-blue-500/30",
    accent: "from-violet-900/20 to-fuchsia-900/20 border-violet-500/30",
    dark: "from-gray-900/40 to-gray-800/40 border-gray-700/30",
  }

  const glowVariants = {
    primary: "from-purple-500/10 via-indigo-500/5 to-transparent",
    secondary: "from-blue-500/10 via-cyan-500/5 to-transparent",
    accent: "from-violet-500/10 via-fuchsia-500/5 to-transparent",
    dark: "from-gray-500/10 via-gray-600/5 to-transparent",
  }

  const borderGlowStyles = borderGlow
    ? "before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-purple-500/30 before:to-indigo-500/30 before:blur-[2px] before:-z-10"
    : ""

  const innerGlowStyles = innerGlow
    ? "after:absolute after:inset-0 after:rounded-xl after:bg-gradient-radial after:" + glowVariants[variant]
    : ""

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-xl border bg-gradient-to-br backdrop-blur-md p-6 overflow-hidden",
        variantStyles[variant],
        borderGlowStyles,
        innerGlowStyles,
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {hoverEffect && isHovered && (
        <div
          className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent opacity-70 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${
              variant === "primary"
                ? "rgba(139, 92, 246, 0.15)"
                : variant === "secondary"
                  ? "rgba(59, 130, 246, 0.15)"
                  : variant === "accent"
                    ? "rgba(139, 92, 246, 0.15)"
                    : "rgba(107, 114, 128, 0.15)"
            }, transparent 150px)`,
          }}
        />
      )}

      {children}
    </motion.div>
  )
}
