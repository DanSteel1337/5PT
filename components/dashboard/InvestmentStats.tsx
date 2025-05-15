"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent, formatNumber } from "@/lib/utils"
import { REWARD_SYSTEM } from "@/lib/contracts"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function InvestmentStats() {
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    accumulatedRewards,
    lastRoundRewards,
    isLoading,
  } = useInvestmentData()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate stats for display
  const totalEarnings = userPoolRewards + userReferralBonus
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
      <Card className="glass-card-purple p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gradient">Investment Performance</h3>
          <Tooltip content="Based on 0.3% daily rewards with 50% auto-reinvestment">
            <Info className="h-5 w-5 text-purple-400 cursor-help" />
          </Tooltip>
        </div>

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

          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-300">Daily Deposit Rate</p>
              <p className="text-xs text-gray-500">Base yield on your deposits</p>
            </div>
            <p className="font-medium text-green-400">0.3% daily</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-300">Direct Referral Bonus</p>
              <p className="text-xs text-gray-500">From your direct referrals</p>
            </div>
            <p className="font-medium text-green-400">0.025% daily</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-300">Downline Bonus</p>
              <p className="text-xs text-gray-500">From levels 2-10 referrals</p>
            </div>
            <p className="font-medium text-green-400">0.06% daily</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
            <div>
              <p className="text-gray-300">Auto-Reinvestment</p>
              <p className="text-xs text-gray-500">Portion of rewards automatically reinvested</p>
            </div>
            <p className="font-medium text-green-400">50%</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-400 text-sm">Annual Percentage Yield:</span>
          <span className="font-medium text-green-400">{formatNumber(0.3 * 365, 2)}%</span>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="font-bold text-sm text-gray-300 mb-4">Projected Earnings (with 50% Reinvestment)</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Daily Yield (0.3%)</p>
              <p className="font-medium text-green-400">+{formatCrypto(dailyDepositYield, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Weekly Projection</p>
              <p className="font-medium text-green-400">+{formatCrypto(dailyDepositYield * 7, tokenSymbol)}</p>
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
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-gray-300">Reward Status</h4>
            <Tooltip content="50% of rewards are automatically reinvested after claim tax">
              <Info className="h-4 w-4 text-purple-400 cursor-help" />
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-gray-300">Pending Rewards</p>
                <p className="text-xs text-gray-500">Available to claim</p>
              </div>
              <p className="font-medium text-green-400">{formatCrypto(accumulatedRewards || 0, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-gray-300">Last Round Rewards</p>
                <p className="text-xs text-gray-500">Earned in last 24h</p>
              </div>
              <p className="font-medium text-green-400">
                {formatCrypto(
                  (lastRoundRewards?.dailyReward || 0) +
                    (lastRoundRewards?.refReward || 0) +
                    (lastRoundRewards?.poolsReward || 0),
                  tokenSymbol,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>
              Note: When claiming rewards, a {REWARD_SYSTEM.claimTaxPercent * 100}% claim tax is applied. After tax, 50%
              of rewards go to your wallet and 50% are automatically reinvested.
            </p>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
