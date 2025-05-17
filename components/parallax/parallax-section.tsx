/**
 * @file ParallaxSection Component
 * @description A section component with parallax scrolling and fade effects.
 * @module components/parallax/parallax-section
 *
 * This component creates a section that moves at a different speed than the scroll rate
 * and changes opacity based on its position in the viewport, creating a dynamic
 * scrolling experience.
 *
 * @requires react
 * @requires framer-motion
 */

"use client"

import { type ReactNode, useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * ParallaxSection Component Props
 * @interface ParallaxSectionProps
 * @property {ReactNode} children - Content to be displayed in the parallax section
 * @property {number} [intensity=0.2] - The intensity of the parallax effect (higher = more movement)
 * @property {string} [className] - Additional CSS classes to apply
 */
interface ParallaxSectionProps {
  children: ReactNode
  intensity?: number
  className?: string
}

/**
 * ParallaxSection Component
 *
 * Creates a section with parallax scrolling and opacity effects.
 * The section moves vertically and changes opacity based on its position in the viewport.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ParallaxSection className="min-h-[50vh] flex items-center justify-center">
 *   <div className="max-w-4xl mx-auto p-8">
 *     <h2 className="text-4xl font-bold mb-4">Parallax Section</h2>
 *     <p className="text-xl">This content will move with a parallax effect and fade in/out.</p>
 *   </div>
 * </ParallaxSection>
 *
 * // With custom intensity
 * <ParallaxSection
 *   intensity={0.4}
 *   className="min-h-[70vh] bg-gradient-to-b from-blue-900 to-purple-900 text-white"
 * >
 *   <div className="max-w-4xl mx-auto p-8">
 *     <h2 className="text-5xl font-bold mb-6">Enhanced Parallax</h2>
 *     <p className="text-xl">This section has a stronger parallax effect.</p>
 *   </div>
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({ children, intensity = 0.2, className = "" }: ParallaxSectionProps) {
  // Client-side mounting check for SSR compatibility
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Track scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transform values for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity])

  // Create opacity transform for fade effect
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR-safe rendering
  if (!mounted)
    return (
      <div className={className} ref={ref}>
        {children}
      </div>
    )

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  )
}

export default ParallaxSection
