/**
 * @file TiltCard Component
 * @description A 3D tilt effect card that responds to mouse movement with smooth animations.
 * @module components/parallax/tilt-card
 *
 * This component creates an interactive 3D tilt effect that follows the user's mouse
 * cursor, creating a dynamic and engaging UI element. The card rotates in 3D space
 * based on the mouse position relative to the card's center.
 *
 * @requires react
 * @requires framer-motion
 */

"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

/**
 * TiltCard Component Props
 * @interface TiltCardProps
 * @property {React.ReactNode} children - Content to be displayed inside the tilt card
 * @property {string} [className] - Additional CSS classes to apply to the card
 * @property {number} [intensity=15] - The intensity of the tilt effect (degrees)
 */
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

/**
 * TiltCard Component
 *
 * Creates a card with a 3D tilt effect that responds to mouse movement.
 * The card rotates based on the mouse position relative to the card's center.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TiltCard className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
 *   <h2 className="text-2xl font-bold text-white">Interactive Card</h2>
 *   <p className="text-blue-200">Hover over me to see the tilt effect!</p>
 * </TiltCard>
 *
 * // With custom intensity
 * <TiltCard intensity={10} className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6">
 *   <div className="text-white">Subtle tilt effect</div>
 * </TiltCard>
 * ```
 */
export function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
  // Client-side mounting check for SSR compatibility
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Motion values for the card's rotation
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animations for smoother movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    damping: 50,
    stiffness: 400,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    damping: 50,
    stiffness: 400,
  })

  /**
   * Handles mouse movement over the card
   * Updates the x and y motion values based on mouse position
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate the position of the mouse relative to the card (0 to 1)
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  /**
   * Resets the card position when mouse leaves
   */
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR-safe rendering
  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  )
}

export default TiltCard
