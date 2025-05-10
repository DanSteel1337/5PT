"use client"

import { useAccount } from "wagmi"
import { formatEther } from "ethers"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Coins, Award } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useTokenContract } from "@/lib/hooks/use-token-contract"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { Skeleton } from "@/components/ui/skeleton"

export function PortfolioSummary() {
  const { address } = useAccount()
  const { useTokenBalance, symbol } = useTokenContract()
  const { useInvestorInfo, useAccumulatedRewards } = useInvestmentManager()

  const { data: balance, isLoading: isBalanceLoading } = useTokenBalance(address)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)

  // Calculate total portfolio value (balance + staked + rewards)
  const totalDeposit = investorInfo ? investorInfo[0] : 0n
  const totalRewards = rewards || 0n
  const totalBalance = balance || 0n
  const totalValue = totalBalance + totalDeposit + totalRewards

  // Calculate daily change (mock data for now)
  const dailyChange = 2.34
  const isPositiveChange = dailyChange > 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {/* Total Portfolio Value */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Portfolio Value</h3>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <DollarSign size={20} className="text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            {isBalanceLoading || isInfoLoading || isRewardsLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <>
                <div className="text-3xl font-bold gold-gradient-text">
                  <AnimatedCounter
                    from={0}
                    to={Number(formatEther(totalValue))}
                    formatValue={(value) => value.toFixed(2)}
                  />
                  <span className="ml-1 text-lg">{symbol}</span>
                </div>
                <div className="flex items-center">
                  {isPositiveChange ? (
                    <>
                      <TrendingUp size={16} className="text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{dailyChange}% today</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} className="text-red-400 mr-1" />
                      <span className="text-red-400 text-sm">{dailyChange}% today</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Available Balance */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Available Balance</h3>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Coins size={20} className="text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            {isBalanceLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold gold-gradient-text">
                <AnimatedCounter
                  from={0}
                  to={Number(formatEther(balance || 0n))}
                  formatValue={(value) => value.toFixed(2)}
                />
                <span className="ml-1 text-lg">{symbol}</span>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Total Staked */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Total Staked</h3>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Coins size={20} className="text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            {isInfoLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold gold-gradient-text">
                <AnimatedCounter
                  from={0}
                  to={Number(formatEther(totalDeposit))}
                  formatValue={(value) => value.toFixed(2)}
                />
                <span className="ml-1 text-lg">{symbol}</span>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Pending Rewards */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Pending Rewards</h3>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Award size={20} className="text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            {isRewardsLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold gold-gradient-text">
                <AnimatedCounter
                  from={0}
                  to={Number(formatEther(totalRewards))}
                  formatValue={(value) => value.toFixed(2)}
                />
                <span className="ml-1 text-lg">{symbol}</span>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
