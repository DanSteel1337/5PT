"use client"

import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { TrendingUp, DollarSign, Coins, Award } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useInvestorInfo, useAccumulatedRewards } from "@/lib/hooks/use-investment-manager"
import { formatEther } from "ethers"
import { Skeleton } from "@/components/ui/skeleton"

export function OptimizedPortfolioSummary() {
  const { address } = useAccount()
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)

  // Calculate portfolio value
  const totalDeposit = investorInfo ? Number(formatEther(investorInfo[0] || 0n)) : 0
  const pendingRewards = rewards ? Number(formatEther(rewards)) : 0
  const portfolioValue = totalDeposit + pendingRewards

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Portfolio Value */}
      <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Portfolio Value</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <DollarSign size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {isInfoLoading ? (
              <Skeleton className="h-8 w-24 bg-amber-900/20" />
            ) : (
              <AnimatedCounter from={0} to={portfolioValue} formatValue={(value) => value.toFixed(2)} />
            )}
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp size={14} className="mr-1" />
            <span>+2.34% today</span>
          </div>
        </div>
      </Card>

      {/* Available Balance */}
      <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Available Balance</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <Coins size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {isInfoLoading ? (
              <Skeleton className="h-8 w-24 bg-amber-900/20" />
            ) : (
              <AnimatedCounter from={0} to={0} formatValue={(value) => value.toFixed(2)} />
            )}
          </div>
          <div className="mt-2 text-xs text-amber-200">Ready to deposit or withdraw</div>
        </div>
      </Card>

      {/* Total Staked */}
      <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Total Staked</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <Coins size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {isInfoLoading ? (
              <Skeleton className="h-8 w-24 bg-amber-900/20" />
            ) : (
              <AnimatedCounter from={0} to={totalDeposit} formatValue={(value) => value.toFixed(2)} />
            )}
          </div>
          <div className="mt-2 text-xs text-amber-200">Earning rewards across all pools</div>
        </div>
      </Card>

      {/* Pending Rewards */}
      <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Pending Rewards</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <Award size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {isRewardsLoading ? (
              <Skeleton className="h-8 w-24 bg-amber-900/20" />
            ) : (
              <AnimatedCounter from={0} to={pendingRewards} formatValue={(value) => value.toFixed(4)} />
            )}
          </div>
          <div className="mt-2 text-xs text-amber-200">Ready to claim or compound</div>
        </div>
      </Card>
    </div>
  )
}
