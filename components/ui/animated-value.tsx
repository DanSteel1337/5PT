"use client"

import { useState, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedValueProps {
  value: number
  duration?: number
  formatFn?: (value: number) => string
  className?: string
}

export function AnimatedValue({ value, duration = 1.5, formatFn, className }: AnimatedValueProps) {
  const [prevValue, setPrevValue] = useState(value)

  useEffect(() => {
    setPrevValue(value)
  }, [value])

  const springValue = useSpring(prevValue, {
    stiffness: 100,
    damping: 30,
    duration,
  })

  const displayValue = useTransform(springValue, (latest) => {
    if (formatFn) {
      return formatFn(latest)
    }
    return latest.toFixed(2)
  })

  return <motion.span className={cn("tabular-nums", className)}>{displayValue}</motion.span>
}
