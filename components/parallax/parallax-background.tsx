"use client"

import { useState, useEffect } from "react"
import { motion, useTransform } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

export function ParallaxBackground() {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useParallax()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Create transform values for different layers
  const y1 = useTransform(scrollY, [0, 1000], [0, -150])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  const y3 = useTransform(scrollY, [0, 1000], [0, -50])
  const opacity = useTransform(scrollY, [0, 300, 600], [0.7, 0.4, 0]) // Reduced initial opacity

  if (!mounted) return null

  return (
    <>
      {/* Background gradient - reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black z-10"></div>

      {/* Parallax stars - reduced opacity and added z-index */}
      <div className="absolute inset-0 overflow-hidden z-20">
        {/* Far stars (slow movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-small.png')] bg-repeat opacity-30"
          style={{ y: y1 }}
        />

        {/* Medium stars (medium movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-medium.png')] bg-repeat opacity-40"
          style={{ y: y2 }}
        />

        {/* Close stars (fast movement) */}
        <motion.div
          className="absolute inset-0 bg-[url('/images/stars-large.png')] bg-repeat opacity-50"
          style={{ y: y3 }}
        />
      </div>

      {/* Gradient overlay that fades as you scroll - reduced opacity */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent z-30"
        style={{ opacity }}
      />

      {/* Grid overlay - reduced opacity */}
      <div className="absolute inset-0 bg-[url('/images/grid.png')] bg-repeat opacity-5 z-20"></div>
    </>
  )
}

export default ParallaxBackground
