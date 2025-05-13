"use client"

import { type ReactNode, useState, useEffect } from "react"
import { motion, useTransform } from "framer-motion"
import { useParallax } from "@/hooks/use-parallax"

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  offset?: number
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  offset = 0,
}: ParallaxLayerProps) {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useParallax()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate transform values based on direction
  const getTransformValues = () => {
    switch (direction) {
      case "up":
        return [offset, -100 * speed + offset]
      case "down":
        return [offset, 100 * speed + offset]
      case "left":
        return [offset, -100 * speed + offset]
      case "right":
        return [offset, 100 * speed + offset]
      default:
        return [offset, -100 * speed + offset]
    }
  }

  // Create transform values
  const shouldAnimateY = direction === "up" || direction === "down"
  const shouldAnimateX = direction === "left" || direction === "right"

  const y = useTransform(scrollY, [0, 1000], shouldAnimateY ? getTransformValues() : [0, 0])

  const x = useTransform(scrollY, [0, 1000], shouldAnimateX ? getTransformValues() : [0, 0])

  if (!mounted) return <>{children}</>

  return (
    <motion.div
      className={className}
      style={{
        x,
        y,
      }}
    >
      {children}
    </motion.div>
  )
}

export default ParallaxLayer
