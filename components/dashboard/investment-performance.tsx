"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TrendingUp, ArrowUpRight, PieChart, BarChart3 } from "lucide-react"

export function InvestmentPerformance() {
  const {
    formattedTotalDeposits,
    formattedReferralBonus,
    formattedPoolRewards,
    dailyEarningsRate,
    projectedMonthlyEarnings,
    isLoading,
  } = useInvestment()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-blue-950/10 border border-blue-500/30 p-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Investment Performance</h2>
          <p className="text-blue-300/70 text-sm">Detailed breakdown of your earnings</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div variants={item} className="bg-blue-900/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-300">Daily Earnings Rate</h3>
            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              0.8% daily
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-blue-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter value={Number.parseFloat(dailyEarningsRate)} formatFn={(val) => formatNumber(val)} />
                <span className="text-sm text-blue-300/70">5PT per day</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-blue-900/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-300">Monthly Projection</h3>
            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              30-day estimate
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-blue-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(projectedMonthlyEarnings)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-blue-300/70">5PT per month</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-blue-300">Earnings Breakdown</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-900/5 rounded-lg p-3 border border-blue-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300/80">Base Investment</span>
                <span className="text-sm font-medium text-white">
                  {isLoading ? "..." : formatNumber(formattedTotalDeposits)} 5PT
                </span>
              </div>
            </div>

            <div className="bg-purple-900/5 rounded-lg p-3 border border-purple-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300/80">Referral Bonuses</span>
                <span className="text-sm font-medium text-white">
                  {isLoading ? "..." : formatNumber(formattedReferralBonus)} 5PT
                </span>
              </div>
            </div>

            <div className="bg-green-900/5 rounded-lg p-3 border border-green-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-300/80">Pool Rewards</span>
                <span className="text-sm font-medium text-white">
                  {isLoading ? "..." : formatNumber(formattedPoolRewards)} 5PT
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
