"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { formatCrypto, formatPercent } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"

interface AnimatedStatsCardProps {
  title: string
  value: number
  previousValue?: number
  percentChange?: number
  isLoading?: boolean
  prefix?: string
  suffix?: string
  formatter?: (value: number) => string
}

export function AnimatedStatsCard({
  title,
  value,
  previousValue,
  percentChange,
  isLoading = false,
  prefix = "",
  suffix = "",
  formatter = formatCrypto,
}: AnimatedStatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const mounted = useMounted()

  // Animate value changes
  useEffect(() => {
    if (!mounted) return

    if (isLoading) {
      setDisplayValue(0)
      return
    }

    setIsAnimating(true)

    // Animate from previous value or 0 to current value
    const startValue = previousValue !== undefined ? previousValue : 0
    const endValue = value
    const duration = 1500
    const startTime = Date.now()

    const animateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = startValue + (endValue - startValue) * easeOutQuart

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animateValue)
      } else {
        setDisplayValue(endValue)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animateValue)

    // Cleanup animation on unmount or value change
    return () => {
      setIsAnimating(false)
    }
  }, [value, previousValue, isLoading, mounted])

  if (!mounted) return null

  const formattedValue = `${prefix}${formatter(displayValue)}${suffix}`
  const hasIncrease = percentChange !== undefined && percentChange > 0
  const hasDecrease = percentChange !== undefined && percentChange < 0

  return (
    <AnimatedCard variant="glass" className="border-purple-500/30 h-full" intensity="subtle">
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>

        <div className="flex items-end justify-between">
          <div className="flex-1">
            <motion.div
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? <div className="h-8 w-32 bg-gray-800 rounded animate-pulse" /> : formattedValue}
            </motion.div>

            {percentChange !== undefined && !isLoading && (
              <div className="flex items-center mt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hasIncrease ? "increase" : "decrease"}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center text-sm ${
                      hasIncrease ? "text-green-400" : hasDecrease ? "text-red-400" : "text-gray-400"
                    }`}
                  >
                    {hasIncrease ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : hasDecrease ? (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    ) : null}
                    <span>{formatPercent(Math.abs(percentChange))}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="w-16 h-16 relative">
            {/* Placeholder for future chart or icon */}
            <div className="absolute inset-0 rounded-full bg-purple-500/10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  )
}
