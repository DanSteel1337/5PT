"use client"

import { useState } from "react"
import { CyberButton } from "@/components/ui/cyber-button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent, formatNumber } from "@/lib/utils"
import { REWARD_SYSTEM, POOL_CRITERIA } from "@/lib/contracts"
import { TrendingUp, Award, Wallet, Users, ChevronRight, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useMounted } from "@/hooks/useMounted"
import { StatCard } from "@/components/ui/StatCard"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcn-tooltip"

export function DashboardOverview() {
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    userTokenBalance,
    projectedDailyYield,
    dailyRatePercent,
    accumulatedRewards,
    lastRoundRewards,
    userReferralCount,
    userDirectReferralVolume,
    totalInvestors,
    totalValueLocked,
    poolEligibility,
  } = useInvestmentData()

  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState<"overview" | "earnings" | "pools">("overview")

  // Don't render anything until client-side hydration is complete
  if (!mounted) return null

  // Calculate total earnings and ROI
  const totalEarnings = userPoolRewards + userReferralBonus
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0

  // Calculate daily earnings breakdown
  const dailyDepositYield = userTotalDeposits * REWARD_SYSTEM.dailyBonus
  const dailyReferralYield = userReferralBonus * REWARD_SYSTEM.dailyBonus
  const dailyPoolYield = lastRoundRewards?.poolsReward || 0

  // Calculate projected earnings with 50% reinvestment
  const calculateCompoundedYield = (days: number) => {
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

  // Calculate projected earnings for different time periods
  const projectedWeeklyYield = calculateCompoundedYield(7)
  const projectedMonthlyYield = calculateCompoundedYield(30)
  const projectedYearlyYield = calculateCompoundedYield(365)

  // Find the highest pool the user qualifies for
  const highestQualifiedPool = poolEligibility.lastIndexOf(true)

  // Find the next pool to target
  const nextPoolTarget = poolEligibility.indexOf(false, highestQualifiedPool >= 0 ? highestQualifiedPool : 0)
  const nextPool = nextPoolTarget >= 0 && nextPoolTarget < 7 ? POOL_CRITERIA[nextPoolTarget] : null

  // Calculate progress towards next pool
  const calculateNextPoolProgress = () => {
    if (!nextPool || typeof nextPool.personalInvestment === "string")
      return { deposit: 100, referrals: 100, volume: 100 }

    const depositProgress = Math.min((userTotalDeposits / (Number(nextPool.personalInvestment) / 10 ** 18)) * 100, 100)
    const referralProgress = Math.min((userReferralCount / nextPool.directRefs) * 100, 100)
    const volumeProgress = Math.min(
      (userDirectReferralVolume / (Number(nextPool.directInvestment) / 10 ** 18)) * 100,
      100,
    )

    return { deposit: depositProgress, referrals: referralProgress, volume: volumeProgress }
  }

  const nextPoolProgress = calculateNextPoolProgress()

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Main Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Balance"
            value={formatCrypto(userTokenBalance, tokenSymbol)}
            subValue={`≈ $${formatNumber(userTokenBalance * 1.75)}`}
            icon={<Wallet className="h-5 w-5 text-purple-400" />}
            className="animate-pulse-glow"
          />

          <StatCard
            label="Total Investments"
            value={formatCrypto(userTotalDeposits, tokenSymbol)}
            subValue="Across all pools"
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
          />

          <StatCard
            label="Total Earnings"
            value={formatCrypto(totalEarnings, tokenSymbol)}
            subValue="Pool + Referral rewards"
            icon={<Award className="h-5 w-5 text-purple-400" />}
          />
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-black/30 rounded-xl border border-purple-900/30 overflow-hidden">
          <div className="flex border-b border-purple-900/30">
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === "overview" ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === "earnings" ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("earnings")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Earnings
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === "pools" ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("pools")}
            >
              <Users className="h-4 w-4 mr-2" />
              Pools
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pending Rewards */}
                  <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gradient">Pending Rewards</h3>
                      <CyberButton variant="outline" size="sm">
                        Claim Now
                      </CyberButton>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Available to Claim:</span>
                        <span className="text-xl font-bold text-green-400">
                          {formatCrypto(accumulatedRewards || 0, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">After {REWARD_SYSTEM.claimTaxPercent * 100}% Claim Tax:</span>
                        <span className="text-gray-300">
                          {formatCrypto((accumulatedRewards || 0) * (1 - REWARD_SYSTEM.claimTaxPercent), tokenSymbol)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/30 rounded p-3 text-center">
                          <p className="text-gray-500 mb-1">To Wallet (50%)</p>
                          <p className="font-medium text-green-400">
                            {formatCrypto(
                              (accumulatedRewards || 0) * (1 - REWARD_SYSTEM.claimTaxPercent) * 0.5,
                              tokenSymbol,
                            )}
                          </p>
                        </div>
                        <div className="bg-black/30 rounded p-3 text-center">
                          <p className="text-gray-500 mb-1">Auto-Reinvested (50%)</p>
                          <p className="font-medium text-purple-400">
                            {formatCrypto(
                              (accumulatedRewards || 0) * (1 - REWARD_SYSTEM.claimTaxPercent) * 0.5,
                              tokenSymbol,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Pool Target */}
                  <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gradient">Next Pool Target</h3>
                      <span className="px-3 py-1 bg-purple-900/30 rounded-full text-xs text-purple-400">
                        {highestQualifiedPool >= 0 ? `Current: Pool ${highestQualifiedPool + 1}` : "Not Qualified Yet"}
                      </span>
                    </div>

                    {nextPool && typeof nextPool.personalInvestment !== "string" ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Target Pool:</span>
                          <span className="text-lg font-bold text-gradient">Pool {nextPoolTarget + 1}</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Personal Investment</span>
                              <span className="text-gray-300">
                                {formatCrypto(userTotalDeposits, tokenSymbol)} /
                                {formatCrypto(Number(nextPool.personalInvestment) / 10 ** 18, tokenSymbol)}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                style={{ width: `${nextPoolProgress.deposit}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Direct Referrals</span>
                              <span className="text-gray-300">
                                {userReferralCount} / {nextPool.directRefs}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                style={{ width: `${nextPoolProgress.referrals}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Referral Volume</span>
                              <span className="text-gray-300">
                                {formatCrypto(userDirectReferralVolume, tokenSymbol)} /
                                {formatCrypto(Number(nextPool.directInvestment) / 10 ** 18, tokenSymbol)}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                                style={{ width: `${nextPoolProgress.volume}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-2">
                            Qualifying for Pool {nextPoolTarget + 1} increases your daily rewards by{" "}
                            {nextPool.share / 10000}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-400 mb-3">
                          {highestQualifiedPool >= 6
                            ? "Congratulations! You've qualified for the highest standard pool!"
                            : "No next pool target available"}
                        </p>
                        <CyberButton variant="outline" size="sm">
                          View All Pools
                        </CyberButton>
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gradient mb-4">Platform Statistics</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">Total Value Locked</p>
                      <p className="text-xl font-bold text-gradient">${formatNumber(totalValueLocked * 1.75)}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">Total Investors</p>
                      <p className="text-xl font-bold text-gradient">{formatNumber(totalInvestors)}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">Daily Rate</p>
                      <p className="text-xl font-bold text-green-400">{formatPercent(dailyRatePercent)}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">Annual Yield</p>
                      <p className="text-xl font-bold text-green-400">{formatPercent(dailyRatePercent * 365)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "earnings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Earnings Breakdown */}
                  <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                    <h3 className="text-lg font-semibold text-gradient mb-4">Daily Earnings Breakdown</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-gray-300">Deposit (0.3%)</span>
                        </div>
                        <span className="font-medium text-green-400">
                          {formatCrypto(dailyDepositYield, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-gray-300">Referrals</span>
                        </div>
                        <span className="font-medium text-blue-400">
                          {formatCrypto(dailyReferralYield, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-gray-300">Pool Rewards</span>
                        </div>
                        <span className="font-medium text-purple-400">{formatCrypto(dailyPoolYield, tokenSymbol)}</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/40 rounded font-medium">
                        <span className="text-gray-200">Total Daily</span>
                        <span className="text-green-400">
                          {formatCrypto(dailyDepositYield + dailyReferralYield + dailyPoolYield, tokenSymbol)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      <p>
                        Note: When claiming rewards, a {REWARD_SYSTEM.claimTaxPercent * 100}% claim tax is applied.
                        After tax, 50% of rewards go to your wallet and 50% are automatically reinvested.
                      </p>
                    </div>
                  </div>

                  {/* Projected Earnings */}
                  <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                    <h3 className="text-lg font-semibold text-gradient mb-4">Projected Earnings</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="text-gray-300">Daily</span>
                        <span className="font-medium text-green-400">
                          {formatCrypto(projectedDailyYield, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="text-gray-300">Weekly</span>
                        <span className="font-medium text-green-400">
                          {formatCrypto(projectedWeeklyYield, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="text-gray-300">Monthly</span>
                        <span className="font-medium text-green-400">
                          {formatCrypto(projectedMonthlyYield, tokenSymbol)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <span className="text-gray-300">Yearly</span>
                        <span className="font-medium text-green-400">
                          {formatCrypto(projectedYearlyYield, tokenSymbol)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-400 mb-2">
                        Projections include 50% auto-reinvestment compound effect
                      </p>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium"
                      >
                        Increase Your Investment Today
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* ROI Stats */}
                <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gradient">Return on Investment</h3>
                    <span className="text-xl font-bold text-gradient">{formatPercent(roi)}</span>
                  </div>

                  <div className="mb-4">
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        style={{ width: `${Math.min(roi, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded p-3">
                      <p className="text-gray-500 text-xs mb-1">Initial Investment</p>
                      <p className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</p>
                    </div>
                    <div className="bg-black/30 rounded p-3">
                      <p className="text-gray-500 text-xs mb-1">Total Earnings</p>
                      <p className="font-medium text-green-400">{formatCrypto(totalEarnings, tokenSymbol)}</p>
                    </div>
                    <div className="bg-black/30 rounded p-3">
                      <p className="text-gray-500 text-xs mb-1">Pool Rewards</p>
                      <p className="font-medium text-purple-400">{formatCrypto(userPoolRewards, tokenSymbol)}</p>
                    </div>
                    <div className="bg-black/30 rounded p-3">
                      <p className="text-gray-500 text-xs mb-1">Referral Earnings</p>
                      <p className="font-medium text-blue-400">{formatCrypto(userReferralBonus, tokenSymbol)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pools" && (
              <div className="space-y-6">
                <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gradient mb-4">Pool Qualification Status</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {POOL_CRITERIA.slice(0, 7).map((pool, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          poolEligibility[index] ? "bg-green-900/20 border-green-500/30" : "bg-black/30 border-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Pool {index + 1}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              poolEligibility[index] ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {poolEligibility[index] ? "Qualified" : "Not Qualified"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Share: {pool.share / 10000}% daily</p>
                          <p>
                            Min:{" "}
                            {typeof pool.personalInvestment === "string"
                              ? "Whitelist"
                              : formatCrypto(Number(pool.personalInvestment) / 10 ** 18, tokenSymbol)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <CyberButton variant="outline" size="sm">
                      View Detailed Pool Requirements
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </CyberButton>
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-5 border border-purple-900/30">
                  <h3 className="text-lg font-semibold text-gradient mb-4">Reward System</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Base daily reward on your deposit amount">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Deposit Bonus</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-green-400">0.3% daily</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Daily bonus on deposits made by your direct referrals">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Direct Referral Bonus</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-blue-400">0.025% daily</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Daily bonus from your downline referrals (levels 2-10)">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Downline Bonus</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-blue-400">0.06% daily</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Percentage of rewards automatically reinvested">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Auto-Reinvestment</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-purple-400">50%</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Tax applied when claiming rewards">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Claim Tax</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-gray-400">10%</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                        <Tooltip content="Tax applied when making deposits">
                          <TooltipTrigger asChild>
                            <span className="text-gray-300 flex items-center cursor-help">Deposit Tax</span>
                          </TooltipTrigger>
                        </Tooltip>
                        <span className="font-medium text-gray-400">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
