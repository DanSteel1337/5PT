"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface FloatingObjectProps {
  children: ReactNode
  className?: string
  xFactor?: number
  yFactor?: number
  rotateFactor?: number
  duration?: number
  delay?: number
}

export function FloatingObject({
  children,
  className = "",
  xFactor = 10,
  yFactor = 15,
  rotateFactor = 5,
  duration = 6,
  delay = 0,
}: FloatingObjectProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -yFactor, 0],
        x: [0, xFactor, 0],
        rotate: [0, rotateFactor, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

export default FloatingObject
