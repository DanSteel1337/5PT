/**
 * FuturisticLogo Component
 *
 * An animated logo component for the 5PT platform with glow effects.
 * This component displays the 5PT logo with optional text and customizable size.
 */

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

/**
 * Props for the FuturisticLogo component
 */
interface FuturisticLogoProps {
  size?: number
  withText?: boolean
  className?: string
}

/**
 * FuturisticLogo Component
 *
 * Renders the 5PT logo with animated glow effects and optional text.
 */
export function FuturisticLogo({ size = 40, withText = true, className = "" }: FuturisticLogoProps) {
  // Client-side mounting check to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  // Set mounted state on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until client-side to prevent hydration issues
  if (!mounted) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo container with glow effects */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Pulsing background glow */}
        <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse" aria-hidden="true"></div>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-full border border-purple-500/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden="true"
        ></motion.div>

        {/* Logo image with drop shadow */}
        <div
          className="relative w-full h-full z-10"
          style={{ filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.7))" }}
        >
          <Image
            src="/images/5pt-logo.png"
            alt="5PT Logo"
            width={size}
            height={size}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Optional text display */}
      {withText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            5PT
          </span>
          <span className="text-xs text-purple-300/80 -mt-1">FINANCE</span>
        </div>
      )}
    </div>
  )
}

export default FuturisticLogo
