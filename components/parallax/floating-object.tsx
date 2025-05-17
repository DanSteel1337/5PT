"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FloatingObjectProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatingObject({ children, className = "", delay = 0 }: FloatingObjectProps) {
  return (
    <motion.div
      className={`${className} pointer-events-none`} // Added pointer-events-none
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ zIndex: 20 }}
    >
      {children}
    </motion.div>
  )
}
