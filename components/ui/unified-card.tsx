"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface UnifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "accent" | "dark" | "cyber" | "minimal"
  effect?: "hover" | "glow" | "scanline" | "none"
  border?: "gradient" | "solid" | "glow" | "none"
  animation?: "fade" | "slide" | "scale" | "none"
  className?: string
  clipPath?: boolean
}

export function UnifiedCard({
  children,
  variant = "primary",
  effect = "hover",
  border = "solid",
  animation = "fade",
  clipPath = false,
  className,
  ...props
}: UnifiedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect()
      setMousePosition({ x: width / 2, y: height / 2 })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (effect !== "hover" || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Base styles based on variant
  const variantStyles = {
    primary: "from-purple-900/20 to-indigo-900/20 border-purple-500/30",
    secondary: "from-blue-900/20 to-cyan-900/20 border-blue-500/30",
    accent: "from-violet-900/20 to-fuchsia-900/20 border-violet-500/30",
    dark: "from-gray-900/40 to-gray-800/40 border-gray-700/30",
    cyber: "from-[rgba(13,13,20,0.7)] to-[rgba(13,13,20,0.7)] border-purple-500/30",
    minimal: "from-black/30 to-black/30 border-gray-800/30",
  }

  // Glow colors based on variant
  const glowColors = {
    primary: "rgba(139, 92, 246, 0.15)",
    secondary: "rgba(59, 130, 246, 0.15)",
    accent: "rgba(139, 92, 246, 0.15)",
    dark: "rgba(107, 114, 128, 0.15)",
    cyber: "rgba(139, 92, 246, 0.15)",
    minimal: "rgba(107, 114, 128, 0.1)",
  }

  // Border styles
  const borderStyles = {
    gradient:
      "before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-purple-500/30 before:to-indigo-500/30 before:blur-[2px] before:-z-10",
    solid: "",
    glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    none: "border-0",
  }

  // Animation variants
  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }
      case "slide":
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.4 },
        }
      default:
        return {}
    }
  }

  // Clip path for cyber variant
  const clipPathStyle = clipPath ? "clip-path-[polygon(0_0,100%_0,100%_85%,85%_100%,0_100%)]" : "rounded-xl"

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative border bg-gradient-to-br backdrop-blur-md p-6 overflow-hidden",
        variantStyles[variant],
        borderStyles[border],
        clipPathStyle,
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...getAnimationProps()}
      {...props}
    >
      {/* Hover effect */}
      {effect === "hover" && isHovered && (
        <div
          className="absolute inset-0 bg-gradient-radial opacity-70 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${
              glowColors[variant]
            }, transparent 150px)`,
          }}
        />
      )}

      {/* Scanline effect */}
      {effect === "scanline" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent absolute top-0 left-0 animate-[scan-line_3s_linear_infinite]"></div>
        </div>
      )}

      {/* Glow effect */}
      {effect === "glow" && (
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
