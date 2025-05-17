"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "glass" | "outline" | "dark"
  intensity?: "subtle" | "medium" | "strong"
  interactive?: boolean
  glowColor?: string
  children: React.ReactNode
}

export function AnimatedCard({
  variant = "default",
  intensity = "medium",
  interactive = true,
  glowColor = "rgba(138, 43, 226, 0.4)",
  className,
  children,
  ...props
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 20, stiffness: 300 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Transform mouse position into rotation values
  const intensityMap = {
    subtle: 2,
    medium: 5,
    strong: 10,
  }
  const rotateIntensity = intensityMap[intensity]

  const rotateX = useTransform(springY, [-0.5, 0.5], [rotateIntensity, -rotateIntensity])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-rotateIntensity, rotateIntensity])

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - centerX) / rect.width
    const normalizedY = (e.clientY - centerY) / rect.height

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  // Reset on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  // Variant styles
  const variantStyles = {
    default: "bg-black/40 backdrop-blur-md border border-purple-500/20",
    gradient: "bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-purple-500/20",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    outline: "bg-transparent border-2 border-purple-500/30",
    dark: "bg-gray-950 border border-gray-800",
  }

  // Client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={cn("rounded-xl overflow-hidden", variantStyles[variant], className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "rounded-xl overflow-hidden relative",
        variantStyles[variant],
        interactive && "transition-shadow duration-300",
        isHovered && interactive && "shadow-lg",
        className,
      )}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {/* Glow effect on hover */}
      {interactive && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX.get() * 100 + 50}% ${
              mouseY.get() * 100 + 50
            }%, ${glowColor}, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Inner content with 3D effect */}
      <motion.div
        style={{
          transform: "translateZ(0px)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
