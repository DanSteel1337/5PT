"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down"
  offset?: number
  className?: string
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "up",
  offset = 0,
  className = "",
}: ParallaxLayerProps) {
  const [mounted, setMounted] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate the y transform based on direction and speed
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [offset + 100 * speed, offset + -100 * speed] : [offset + -100 * speed, offset + 100 * speed],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={setRef} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

export default ParallaxLayer
