"use client"

import { useState, useEffect } from "react"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber, formatPercent } from "@/lib/utils"
import { TrendingUp, Award, Wallet, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

export function WalletOverview() {
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    userTokenBalance,
    projectedDailyYield,
    dailyRatePercent,
  } = useInvestmentData()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-purple rounded-xl p-6 animate-pulse-glow"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-gradient">{formatCrypto(userTokenBalance, tokenSymbol)}</p>
            <p className="text-sm text-gray-400 mt-1">≈ ${formatNumber(userTokenBalance * 1.25)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-purple-400" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-900/30">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Available to Withdraw</p>
            <p className="font-medium">{formatCrypto(userTokenBalance * 0.8, tokenSymbol)}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card-purple rounded-xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 mb-1">Total Investments</p>
            <p className="text-3xl font-bold text-gradient">{formatCrypto(userTotalDeposits, tokenSymbol)}</p>
            <p className="text-sm text-gray-400 mt-1">Across all pools</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-900/30">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Daily Yield ({formatPercent(dailyRatePercent)})</p>
            <div className="flex items-center">
              <p className="font-medium text-green-400">+{formatCrypto(projectedDailyYield, tokenSymbol)}</p>
              <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card-purple rounded-xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-gradient">
              {formatCrypto(userPoolRewards + userReferralBonus, tokenSymbol)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Pool + Referral rewards</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
            <Award className="h-5 w-5 text-purple-400" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-900/30">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Referral Earnings</p>
            <div className="flex items-center">
              <p className="font-medium text-purple-400">{formatCrypto(userReferralBonus, tokenSymbol)}</p>
              <ArrowUpRight className="h-3 w-3 text-purple-400 ml-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
