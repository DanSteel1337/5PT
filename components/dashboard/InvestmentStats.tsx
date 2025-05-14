"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent } from "@/lib/utils"

export function InvestmentStats() {
  const { userTotalDeposits, userReferralBonus, userPoolRewards, tokenSymbol } = useInvestmentData()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate some stats for display
  const totalEarnings = userPoolRewards + userReferralBonus
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0
  const projectedMonthlyYield = userTotalDeposits * 0.08 * 30 // 8% daily for 30 days
  const projectedAnnualYield = userTotalDeposits * 0.08 * 365 // 8% daily for 365 days

  return (
    <Card className="glass-card-purple p-6">
      <h3 className="text-xl font-bold mb-6 text-gradient">Investment Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Return on Investment</p>
          <p className="text-3xl font-bold text-gradient">{formatPercent(roi)}</p>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${Math.min(roi, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Earnings Breakdown</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <p className="text-sm">Pool Rewards: {formatPercent((userPoolRewards / totalEarnings) * 100)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <p className="text-sm">Referral Bonuses: {formatPercent((userReferralBonus / totalEarnings) * 100)}</p>
          </div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${(userPoolRewards / totalEarnings) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-sm text-gray-300 mb-2">Projected Earnings</h4>

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Daily Yield (8%)</p>
          <p className="font-medium text-green-400">+{formatCrypto(userTotalDeposits * 0.08, tokenSymbol)}</p>
        </div>

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Weekly Projection</p>
          <p className="font-medium text-green-400">+{formatCrypto(userTotalDeposits * 0.08 * 7, tokenSymbol)}</p>
        </div>

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Monthly Projection</p>
          <p className="font-medium text-green-400">+{formatCrypto(projectedMonthlyYield, tokenSymbol)}</p>
        </div>

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Annual Projection</p>
          <p className="font-medium text-green-400">+{formatCrypto(projectedAnnualYield, tokenSymbol)}</p>
        </div>
      </div>
    </Card>
  )
}
