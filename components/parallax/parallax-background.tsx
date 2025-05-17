/**
 * ParallaxBackground Component
 *
 * A responsive parallax background with multiple layers of stars and gradient effects.
 * Creates a dynamic, animated background with parallax scrolling effects.
 */

"use client"

import { useState, useEffect } from "react"
import { motion, useTransform } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

export function ParallaxBackground() {
  // Client-side mounting check to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  // Get scrollY motion value from the parallax hook
  const { scrollY } = useParallax()

  // Set mounted state on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Create transform values for different layers with varying parallax speeds
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]) // Far stars (slow movement)
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]) // Medium stars (medium movement)
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]) // Close stars (fast movement)

  // Gradient overlay opacity that fades as you scroll
  const opacity = useTransform(scrollY, [0, 300, 600], [0.7, 0.4, 0]) // Reduced initial opacity

  // Don't render anything until client-side to prevent hydration issues
  if (!mounted) return null

  return (
    <>
      {/* Base background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black z-10"></div>

      {/* Parallax stars container */}
      <div className="absolute inset-0 overflow-hidden z-20">
        {/* Layer 1: Far stars (slow movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-small.png')] bg-repeat opacity-30"
          style={{ y: y1 }}
          aria-hidden="true"
        />

        {/* Layer 2: Medium stars (medium movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-medium.png')] bg-repeat opacity-40"
          style={{ y: y2 }}
          aria-hidden="true"
        />

        {/* Layer 3: Close stars (fast movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-large.png')] bg-repeat opacity-50"
          style={{ y: y3 }}
          aria-hidden="true"
        />
      </div>

      {/* Gradient overlay that fades as you scroll */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent z-30"
        style={{ opacity }}
        aria-hidden="true"
      />

      {/* Grid overlay for visual texture */}
      <div className="absolute inset-0 bg-[url('/images/grid.png')] bg-repeat opacity-5 z-20" aria-hidden="true"></div>
    </>
  )
}

export default ParallaxBackground
