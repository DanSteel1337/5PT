"use client"

import { type ReactNode, useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: ReactNode
  intensity?: number
  className?: string
}

export function ParallaxSection({ children, intensity = 0.2, className = "" }: ParallaxSectionProps) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create transform values
  const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  useEffect(() => {
    setMounted(true)
  }, [])

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
