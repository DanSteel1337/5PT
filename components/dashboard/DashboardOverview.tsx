"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber, formatPercent } from "@/lib/utils"
import {
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Users,
  Clock,
  Award,
  ChevronRight,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Progress } from "@/components/ui/progress"
import { RealTimeEarnings } from "./RealTimeEarnings"
import { useAccount } from "wagmi"
import { CustomConnectButton } from "@/components/web3/ConnectButton"

export function DashboardOverview() {
  const { address, isConnected } = useAccount()
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    userTokenBalance,
    projectedDailyYield,
    projectedMonthlyYield,
    projectedAnnualYield,
    dailyRatePercent,
    userRank,
    totalInvestors,
    totalValueLocked,
  } = useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    setMounted(true)
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  if (!mounted) return null

  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  // Calculate total earnings
  const totalEarnings = userPoolRewards + userReferralBonus

  // Calculate ROI
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0

  // Calculate APY
  const apy = dailyRatePercent * 365

  // Format address for display
  const formattedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""

  return (
    <div className="space-y-6" ref={ref}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">Welcome to 5PT Finance</h1>
          <p className="text-gray-400 mt-1">Your investment dashboard • Connected as {formattedAddress}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20">
            <Clock className="mr-2 h-4 w-4" />
            Transaction History
          </Button>
          <CyberButton variant="primary" size="md">
            <Wallet className="mr-2 h-4 w-4" />
            Deposit Funds
          </CyberButton>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card-purple rounded-xl p-6 animate-pulse-glow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-gradient">{formatCrypto(userTokenBalance, tokenSymbol)}</p>
              <p className="text-sm text-gray-400 mt-1">≈ ${formatNumber(userTokenBalance * 1.25)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-900/30">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Available to Withdraw</p>
              <p className="font-medium">{formatCrypto(userTokenBalance * 0.8, tokenSymbol)}</p>
            </div>
          </div>
          <div className="mt-4">
            <CyberButton variant="outline" size="sm" className="w-full">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw Funds
            </CyberButton>
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
              <p className="text-gray-400 mb-1">Total Investments</p>
              <p className="text-3xl font-bold text-gradient">{formatCrypto(userTotalDeposits, tokenSymbol)}</p>
              <p className="text-sm text-gray-400 mt-1">Across all pools</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
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
          <div className="mt-4">
            <CyberButton variant="primary" size="sm" className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Invest More
            </CyberButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card-purple rounded-xl p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gradient">{formatCrypto(totalEarnings, tokenSymbol)}</p>
              <p className="text-sm text-gray-400 mt-1">Pool + Referral rewards</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-900/30">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">ROI</p>
              <div className="flex items-center">
                <p className="font-medium text-green-400">{formatPercent(roi)}</p>
                <ArrowUpRight className="h-3 w-3 text-green-400 ml-1" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(roi, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-Time Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RealTimeEarnings />
      </motion.div>

      {/* Investment Performance & Rank */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-2 glass-card-purple rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6 text-gradient flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Investment Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Return on Investment</p>
              <p className="text-3xl font-bold text-gradient">{formatPercent(roi)}</p>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(roi, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                ></motion.div>
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
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(userPoolRewards / totalEarnings) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-300 mb-2">Projected Earnings</h4>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Daily Yield ({formatPercent(dailyRatePercent)})</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedDailyYield, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Weekly Projection</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedDailyYield * 7, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Monthly Projection</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedMonthlyYield, tokenSymbol)}</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <p className="text-gray-300">Annual Projection (APY: {formatPercent(apy)})</p>
              <p className="font-medium text-green-400">+{formatCrypto(projectedAnnualYield, tokenSymbol)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card-purple rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4 text-gradient flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Investor Rank
          </h3>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-purple-900/30 border-4 border-purple-500 flex items-center justify-center">
                <span className="text-5xl font-bold text-gradient">{userRank}</span>
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-indigo-900 border-2 border-indigo-500 flex items-center justify-center">
                <Award className="h-5 w-5 text-indigo-300" />
              </div>
            </div>

            <p className="mt-4 text-xl font-bold text-gradient">{getRankTitle(userRank)}</p>

            <p className="text-gray-400 text-sm mt-2 text-center">{getRankDescription(userRank)}</p>

            <div className="w-full mt-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Current Rank</span>
                <span>Next Rank</span>
              </div>
              <Progress value={getRankProgress(userRank)} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Level {userRank}</span>
                <span>Level {userRank + 1}</span>
              </div>
            </div>

            <div className="mt-6 w-full">
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-100 hover:bg-purple-900/20">
                View Rank Benefits
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-card-purple rounded-xl p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-gradient">Platform Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
            <p className="text-2xl font-bold text-white">${formatNumber(totalValueLocked * 1.25)}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Investors</p>
            <p className="text-2xl font-bold text-white">{formatNumber(totalInvestors)}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Active Pools</p>
            <p className="text-2xl font-bold text-white">7</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Rewards Paid</p>
            <p className="text-2xl font-bold text-white">${formatNumber(totalValueLocked * 0.3)}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <QuickActionCard
          title="Invest in Pools"
          description="Explore investment pools with different APYs and requirements."
          icon={Wallet}
          buttonText="View Pools"
          buttonIcon={ArrowRight}
          href="/dashboard/investments"
          gradient="from-purple-500 to-blue-500"
        />

        <QuickActionCard
          title="Refer Friends"
          description="Earn 5% commission on your referrals' investments."
          icon={Users}
          buttonText="Get Referral Link"
          buttonIcon={ArrowRight}
          href="/dashboard/referrals"
          gradient="from-blue-500 to-cyan-400"
        />

        <QuickActionCard
          title="Track Earnings"
          description="View detailed analytics of your investment performance."
          icon={BarChart3}
          buttonText="View Analytics"
          buttonIcon={ArrowRight}
          href="/dashboard/analytics"
          gradient="from-cyan-400 to-teal-500"
        />
      </motion.div>
    </div>
  )
}

function ConnectWalletPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card-purple rounded-xl p-8 text-center max-w-2xl mx-auto my-12"
    >
      <div className="w-20 h-20 rounded-full bg-purple-900/30 mx-auto flex items-center justify-center mb-6">
        <Wallet className="h-10 w-10 text-purple-400" />
      </div>

      <h2 className="text-3xl font-bold mb-4 text-gradient">Connect Your Wallet</h2>

      <p className="text-gray-300 mb-8 max-w-md mx-auto">
        Connect your wallet to view your investment dashboard, manage your pools, and track your earnings in real-time.
      </p>

      <div className="flex justify-center">
        <CustomConnectButton />
      </div>

      <div className="mt-8 pt-8 border-t border-purple-900/30 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gradient">7</p>
          <p className="text-xs text-gray-400">Investment Pools</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gradient">292%</p>
          <p className="text-xs text-gray-400">Annual APY</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gradient">12,847</p>
          <p className="text-xs text-gray-400">Active Investors</p>
        </div>
      </div>
    </motion.div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ElementType
  buttonText: string
  buttonIcon: React.ElementType
  href: string
  gradient: string
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  buttonText,
  buttonIcon: ButtonIcon,
  href,
  gradient,
}: QuickActionCardProps) {
  return (
    <Card className="glass-card-purple p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <a href={href} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
        <span>{buttonText}</span>
        <ButtonIcon className="ml-2 h-4 w-4" />
      </a>
    </Card>
  )
}

// Helper functions for rank information
function getRankTitle(rank: number): string {
  const titles = [
    "Novice Investor",
    "Bronze Investor",
    "Silver Investor",
    "Gold Investor",
    "Platinum Investor",
    "Diamond Investor",
    "Elite Investor",
    "Master Investor",
    "Legendary Investor",
  ]

  return titles[Math.min(rank, titles.length - 1)]
}

function getRankDescription(rank: number): string {
  const descriptions = [
    "Just getting started on your investment journey.",
    "Building your investment portfolio steadily.",
    "Growing your investments with strategic choices.",
    "Established investor with significant holdings.",
    "Advanced investor with premium pool access.",
    "Elite investor with exclusive benefits and rewards.",
    "Top-tier investor with maximum rewards access.",
    "Investment master with platform-wide recognition.",
    "Legendary status with maximum platform benefits.",
  ]

  return descriptions[Math.min(rank, descriptions.length - 1)]
}

function getRankProgress(rank: number): number {
  // Simulate progress to next rank based on current rank
  const progressMap = [30, 45, 60, 75, 85, 90, 95, 98, 100]
  return progressMap[Math.min(rank, progressMap.length - 1)]
}
