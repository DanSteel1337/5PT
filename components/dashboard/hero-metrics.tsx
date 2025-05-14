"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { TrendingUp, Award, Users, DollarSign } from "lucide-react"

export function HeroMetrics() {
  const {
    formattedTotalDeposits,
    formattedTotalEarnings,
    dailyEarningsRate,
    projectedYearlyEarnings,
    userRank,
    totalInvestors,
    isLoading,
  } = useInvestment()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const rankNames = [
    "Novice",
    "Apprentice",
    "Adept",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
    "Mythic",
    "Divine",
    "Immortal",
  ]

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/80 to-purple-950/20 border border-purple-500/30 p-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <ParticleEffect className="absolute inset-0" count={30} duration={3} />

      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Investment Command Center</h1>
        <p className="text-purple-300/80">Real-time metrics and projections for your 5PT investments</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/5 rounded-xl border border-purple-500/30 p-6 relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>

          <h3 className="text-sm font-medium text-purple-300/70 mb-1">Total Investment</h3>
          <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-8 w-32 bg-purple-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(formattedTotalDeposits)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-purple-300/70">5PT</span>
              </>
            )}
          </div>
          <div className="mt-2 text-green-400 text-sm flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Growing investment
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-gradient-to-br from-blue-900/20 to-blue-800/5 rounded-xl border border-blue-500/30 p-6 relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>

          <h3 className="text-sm font-medium text-blue-300/70 mb-1">Total Earnings</h3>
          <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-8 w-32 bg-blue-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(formattedTotalEarnings)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-blue-300/70">5PT</span>
              </>
            )}
          </div>
          <div className="mt-2 text-green-400 text-sm flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {dailyEarningsRate} 5PT daily
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-gradient-to-br from-green-900/20 to-green-800/5 rounded-xl border border-green-500/30 p-6 relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-green-400" />
          </div>

          <h3 className="text-sm font-medium text-green-300/70 mb-1">Investor Rank</h3>
          <div className="text-2xl md:text-3xl font-bold text-white">
            {isLoading ? (
              <div className="h-8 w-32 bg-green-500/10 animate-pulse rounded"></div>
            ) : (
              rankNames[userRank] || "Investor"
            )}
          </div>
          <div className="mt-2 text-green-400 text-sm flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Top {isLoading ? "..." : Math.max(5, 100 - userRank * 10)}% of investors
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/5 rounded-xl border border-indigo-500/30 p-6 relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>

          <h3 className="text-sm font-medium text-indigo-300/70 mb-1">Yearly Projection</h3>
          <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-8 w-32 bg-indigo-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(projectedYearlyEarnings)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-indigo-300/70">5PT</span>
              </>
            )}
          </div>
          <div className="mt-2 text-green-400 text-sm flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Based on current rate
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
