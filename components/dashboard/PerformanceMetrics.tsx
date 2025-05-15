"use client"

import { motion } from "framer-motion"
import { formatCrypto, formatPercent } from "@/lib/utils"
import { REWARD_SYSTEM } from "@/lib/contracts"
import { Tooltip, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface PerformanceMetricsProps {
  dailyRate: number
  userTotalDeposits: number
  userReferralBonus: number
  userPoolRewards: number
  tokenSymbol: string
}

export function PerformanceMetrics({
  dailyRate,
  userTotalDeposits,
  userReferralBonus,
  userPoolRewards,
  tokenSymbol,
}: PerformanceMetricsProps) {
  // Calculate total earnings
  const totalEarnings = userPoolRewards + userReferralBonus

  // Calculate ROI
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0

  // Calculate daily earnings based on the 0.3% daily rate
  const dailyDepositYield = userTotalDeposits * REWARD_SYSTEM.dailyBonus

  // Calculate referral earnings
  const dailyReferralYield = userReferralBonus * REWARD_SYSTEM.dailyBonus

  // Calculate total daily yield
  const totalDailyYield = dailyDepositYield + dailyReferralYield

  // Calculate projected earnings with 50% reinvestment
  const calculateCompoundedYield = (dailyYield: number, days: number) => {
    let total = 0
    let currentDeposit = userTotalDeposits

    for (let i = 0; i < days; i++) {
      const dailyEarning = currentDeposit * REWARD_SYSTEM.dailyBonus
      // 50% is reinvested, 50% is claimed (after tax)
      const reinvestedAmount = dailyEarning * REWARD_SYSTEM.reinvestmentPercent
      const claimedAmount = dailyEarning * (1 - REWARD_SYSTEM.reinvestmentPercent) * (1 - REWARD_SYSTEM.claimTaxPercent)

      total += claimedAmount
      currentDeposit += reinvestedAmount
    }

    return total
  }

  const projectedMonthlyYield = calculateCompoundedYield(totalDailyYield, 30)
  const projectedAnnualYield = calculateCompoundedYield(totalDailyYield, 365)

  return (
    <TooltipProvider>
      <motion.div
        className="glass-card-purple rounded-xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gradient">Performance Metrics</h3>
          <Tooltip content="Based on 0.3% daily rewards with 50% auto-reinvestment">
            <TooltipTrigger>
              <Info className="h-5 w-5 text-purple-400 cursor-help" />
            </TooltipTrigger>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Return on Investment</p>
            <p className="text-3xl font-bold text-gradient">{formatPercent(roi)}</p>
            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(roi, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Earnings Breakdown</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <p className="text-sm">
                Pool Rewards: {formatPercent(totalEarnings > 0 ? (userPoolRewards / totalEarnings) * 100 : 0)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <p className="text-sm">
                Referral Bonuses: {formatPercent(totalEarnings > 0 ? (userReferralBonus / totalEarnings) * 100 : 0)}
              </p>
            </div>
            <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${totalEarnings > 0 ? (userPoolRewards / totalEarnings) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-gray-300">Reward Rates</h4>
            <span className="text-xs text-purple-400">Based on contract rates</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Daily Rate</p>
              <p className="text-lg font-medium text-green-400">0.3%</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Monthly APY</p>
              <p className="text-lg font-medium text-green-400">9.0%</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Annual APY</p>
              <p className="text-lg font-medium text-green-400">109.5%</p>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Compound APY</p>
              <p className="text-lg font-medium text-green-400">164.3%</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="font-bold text-sm text-gray-300 mb-4">Projected Earnings (with 50% Reinvestment)</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Daily</p>
              <p className="font-medium text-green-400">+{formatCrypto(dailyDepositYield, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Monthly</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedMonthlyYield, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Annual</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedAnnualYield, tokenSymbol)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
