"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Coins, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { TOKENOMICS } from "@/lib/contracts"

export function TokenPerformance() {
  const { formattedTokenBalance, formattedTotalValueLocked, isLoading } = useInvestment()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
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
          <h2 className="text-xl font-bold text-white">Token Performance</h2>
          <p className="text-blue-300/70 text-sm">Your 5PT token balance and metrics</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Coins className="w-5 h-5 text-blue-400" />
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div variants={item} className="bg-blue-900/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-300">Your Token Balance</h3>
            <div className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Growing Asset
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-blue-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(formattedTokenBalance)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-blue-300/70">5PT</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-blue-900/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-300">Total Value Locked</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-7 w-24 bg-blue-500/10 animate-pulse rounded"></div>
            ) : (
              <>
                <AnimatedCounter
                  value={Number.parseFloat(formattedTotalValueLocked)}
                  formatFn={(val) => formatNumber(val)}
                />
                <span className="text-sm text-blue-300/70">5PT</span>
              </>
            )}
          </div>
          <p className="text-xs text-blue-300/70 mt-1">Total 5PT locked in investment pools</p>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-300">Tokenomics Breakdown</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-blue-900/5 rounded-lg p-3 border border-blue-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300/80">Airdrop Campaign</span>
                <span className="text-sm font-medium text-white">{TOKENOMICS.airdropCampaign.percentage}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-blue-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${TOKENOMICS.airdropCampaign.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-purple-900/5 rounded-lg p-3 border border-purple-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300/80">Presale & Referral</span>
                <span className="text-sm font-medium text-white">{TOKENOMICS.presaleAndReferral.percentage}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-purple-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${TOKENOMICS.presaleAndReferral.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-green-900/5 rounded-lg p-3 border border-green-500/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-300/80">DEX Liquidity</span>
                <span className="text-sm font-medium text-white">{TOKENOMICS.dexLiquidity.percentage}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-green-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                  style={{ width: `${TOKENOMICS.dexLiquidity.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
