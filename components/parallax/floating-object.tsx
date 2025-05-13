"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface FloatingObjectProps {
  children: React.ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
}

export function FloatingObject({
  children,
  amplitude = 10,
  duration = 4,
  delay = 0,
  className = "",
}: FloatingObjectProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
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
