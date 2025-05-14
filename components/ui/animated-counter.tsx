"use client"

import { useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  formatFn?: (value: number) => string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  formatFn = (val) => val.toLocaleString(),
  className = "",
}: AnimatedCounterProps) {
  const springValue = useSpring(0, { duration: duration * 1000, bounce: 0.1 })
  const displayValue = useTransform(springValue, (current) => formatFn(Math.floor(current)))

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  return <motion.span className={className}>{displayValue}</motion.span>
}
