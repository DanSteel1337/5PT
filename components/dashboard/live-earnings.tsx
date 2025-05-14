"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { TrendingUp, Clock, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function LiveEarnings() {
  const { formattedTotalDeposits, dailyEarningsRate, projectedMonthlyEarnings, projectedYearlyEarnings, isLoading } =
    useInvestment()

  const [currentEarnings, setCurrentEarnings] = useState(0)
  const [startTime] = useState(Date.now())

  // Calculate real-time earnings based on time elapsed since component mounted
  useEffect(() => {
    if (isLoading) return

    const dailyRate = Number.parseFloat(dailyEarningsRate)
    const earningsPerMillisecond = dailyRate / (24 * 60 * 60 * 1000)

    const interval = setInterval(() => {
      const timeElapsed = Date.now() - startTime
      const earned = earningsPerMillisecond * timeElapsed
      setCurrentEarnings(earned)
    }, 100)

    return () => clearInterval(interval)
  }, [isLoading, dailyEarningsRate, startTime])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-green-950/10 border border-green-500/30 p-6 relative overflow-hidden"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <ParticleEffect className="absolute inset-0" count={40} duration={4} colors={["#10B981", "#34D399", "#6EE7B7"]} />

      <motion.div variants={item} className="mb-6 flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white">Live Earnings Tracker</h2>
          <p className="text-green-300/70 text-sm">Watch your investment grow in real-time</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-green-400" />
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 text-center mb-6 relative z-10"
      >
        <h3 className="text-sm font-medium text-green-300 mb-2">Earnings Since You Opened This Page</h3>
        <div className="text-4xl md:text-5xl font-bold text-white flex items-baseline gap-1 justify-center">
          {isLoading ? (
            <div className="h-12 w-40 bg-green-500/10 animate-pulse rounded"></div>
          ) : (
            <>
              <AnimatedCounter value={currentEarnings} formatFn={(val) => formatNumber(val, 6)} duration={0.1} />
              <span className="text-lg text-green-300/70">5PT</span>
            </>
          )}
        </div>
        <p className="text-sm text-green-300/70 mt-2 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 mr-1" />
          Based on your daily rate of {isLoading ? "..." : dailyEarningsRate} 5PT
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <motion.div variants={item} className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-300">Daily</h3>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-green-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter value={Number.parseFloat(dailyEarningsRate)} formatFn={(val) => formatNumber(val)} />
                <span className="text-sm text-green-300/70">5PT</span>
              </>
            )}
          </div>
          <p className="text-xs text-green-300/70 mt-1">
            Earning approximately {isLoading ? "..." : (Number.parseFloat(dailyEarningsRate) / 24).toFixed(2)} 5PT per
            hour
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-300">Monthly</h3>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-green-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(projectedMonthlyEarnings)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-green-300/70">5PT</span>
              </>
            )}
          </div>
          <p className="text-xs text-green-300/70 mt-1">Projected earnings over the next 30 days</p>
        </motion.div>

        <motion.div variants={item} className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-300">Yearly</h3>
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-green-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(projectedYearlyEarnings)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-green-300/70">5PT</span>
              </>
            )}
          </div>
          <p className="text-xs text-green-300/70 mt-1">Projected earnings over the next 365 days</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
