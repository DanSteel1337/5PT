"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NeoMorphicCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  borderColor?: string
  depth?: number
  glowIntensity?: number
  interactive?: boolean
  variant?: "gold" | "cosmic" | "crystal" | "dark"
  hoverEffect?: boolean
  pulseEffect?: boolean
}

export function NeoMorphicCard({
  children,
  className,
  glowColor,
  borderColor,
  depth = 20,
  glowIntensity = 1,
  interactive = true,
  variant = "gold",
  hoverEffect = true,
  pulseEffect = false,
}: NeoMorphicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Set colors based on variant
  const getColors = () => {
    switch (variant) {
      case "gold":
        return {
          glow: glowColor || "rgba(255, 215, 0, 0.6)",
          border: borderColor || "rgba(212, 175, 55, 0.5)",
          gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(184, 134, 11, 0.2))",
          shadow: "0 10px 30px -10px rgba(212, 175, 55, 0.3)",
        }
      case "cosmic":
        return {
          glow: glowColor || "rgba(138, 43, 226, 0.6)",
          border: borderColor || "rgba(75, 0, 130, 0.5)",
          gradient: "linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.2))",
          shadow: "0 10px 30px -10px rgba(138, 43, 226, 0.3)",
        }
      case "crystal":
        return {
          glow: glowColor || "rgba(0, 191, 255, 0.6)",
          border: borderColor || "rgba(135, 206, 250, 0.5)",
          gradient: "linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(30, 144, 255, 0.2))",
          shadow: "0 10px 30px -10px rgba(0, 191, 255, 0.3)",
        }
      case "dark":
        return {
          glow: glowColor || "rgba(50, 50, 50, 0.6)",
          border: borderColor || "rgba(100, 100, 100, 0.5)",
          gradient: "linear-gradient(135deg, rgba(40, 40, 40, 0.1), rgba(20, 20, 20, 0.2))",
          shadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        }
      default:
        return {
          glow: glowColor || "rgba(255, 215, 0, 0.6)",
          border: borderColor || "rgba(212, 175, 55, 0.5)",
          gradient: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(184, 134, 11, 0.2))",
          shadow: "0 10px 30px -10px rgba(212, 175, 55, 0.3)",
        }
    }
  }

  const colors = getColors()

  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate mouse position relative to card center (normalized from -0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setMousePosition({ x, y })
  }

  // Calculate rotation and lighting effects based on mouse position
  const rotateX = interactive && isHovered ? -mousePosition.y * 20 : 0
  const rotateY = interactive && isHovered ? mousePosition.x * 20 : 0
  const lightX = 50 + mousePosition.x * 100
  const lightY = 50 + mousePosition.y * 100

  // Generate 3D layers for depth effect
  const generateLayers = () => {
    const layerCount = 3
    const layers = []

    for (let i = 0; i < layerCount; i++) {
      const depthValue = (i + 1) * (isHovered ? depth / layerCount : 0)
      const opacity = 1 - (i / layerCount) * 0.6

      layers.push(
        <div
          key={i}
          className="absolute inset-4 rounded-xl bg-black/5 backdrop-blur-sm"
          style={{
            transform: `translateZ(${depthValue}px)`,
            opacity,
            boxShadow: i === 0 ? colors.shadow : "none",
          }}
        />,
      )
    }

    return layers
  }

  // Generate edge highlights
  const generateEdgeHighlights = () => {
    if (!isHovered || !interactive) return null

    return (
      <>
        <div
          className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(${lightX}deg, ${colors.glow}, transparent)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(${lightY + 90}deg, ${colors.glow}, transparent)`,
          }}
        />
      </>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-md bg-black/40 border",
        "transition-all duration-300 ease-out",
        className,
      )}
      style={{
        perspective: 1000,
        borderColor: colors.border,
        background: colors.gradient,
        boxShadow: isHovered ? `0 20px 40px -20px ${colors.glow}` : colors.shadow,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      animate={{
        scale: isHovered && hoverEffect ? 1.02 : 1,
      }}
    >
      {/* 3D depth layers */}
      {interactive && generateLayers()}

      {/* Edge highlights */}
      {generateEdgeHighlights()}

      {/* Pulse effect */}
      {pulseEffect && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ borderColor: colors.border, borderWidth: 1 }}
          animate={{
            boxShadow: [`0 0 0px ${colors.glow}`, `0 0 20px ${colors.glow}`, `0 0 0px ${colors.glow}`],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />
      )}

      {/* 3D transformation container */}
      <motion.div
        className="relative z-10 h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Holographic overlay effect */}
        {interactive && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at ${lightX}% ${lightY}%, ${colors.glow}, transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />
        )}

        {/* Content with 3D effect */}
        <div
          className="relative z-10"
          style={{
            transform: isHovered && interactive ? `translateZ(${depth}px)` : "translateZ(0px)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {children}
        </div>
      </motion.div>

      {/* Ambient glow effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
          filter: `blur(20px)`,
        }}
      />

      {/* Edge border glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 2px ${colors.border}`,
          opacity: glowIntensity * (isHovered ? 1 : 0.5),
        }}
      />
    </motion.div>
  )
}
