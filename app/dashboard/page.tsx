/**
 * @file app/dashboard/page.tsx
 * @description Main dashboard page component
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * - This project does NOT use a dashboard layout file
 * - Each dashboard page MUST include the DashboardHeader component
 * - Each dashboard page MUST include the background gradient and container structure
 * - DO NOT create separate layout files for dashboard pages
 *
 * This component:
 * 1. Renders the DashboardHeader for navigation
 * 2. Displays investment stats and rewards
 * 3. Shows pool qualification status
 * 4. Provides investment form and referral stats
 * 5. Handles wallet connection state
 */

"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Wallet, Zap, Users, TrendingUp, ArrowUpRight } from "lucide-react"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { useTokenContract } from "@/hooks/useTokenContract"
import { DashboardHeader } from "@/components/dashboard/header"
import { AnimatedStatsCard } from "@/components/dashboard/animated-stats-card"
import { AnimatedRewardsCard } from "@/components/dashboard/animated-rewards-card"
import { PoolQualification3D } from "@/components/dashboard/pool-qualification-3d"
import { InvestmentForm } from "@/components/dashboard/investment-form"
import { ReferralStats } from "@/components/dashboard/referral-stats"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { AnimatedCard } from "@/components/ui/animated-card"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [referralCode, setReferralCode] = useState<string>("")

  // Get contract data
  const investmentManager = useInvestmentManager()
  const tokenContract = useTokenContract()

  // Check URL for referral code
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get("ref")
      if (ref) {
        setReferralCode(ref)
      }
    }
  }, [mounted])

  // Mock data for UI enhancement
  const mockData = {
    dailyRewards: 15,
    referralRewards: 42.5,
    poolRewards: 83.25,
    totalRewards: 125.75,
    directInvestment: 10000,
    qualifiedPools: [0, 1],
  }

  // Combine real and mock data
  const dashboardData = {
    totalInvested: investmentManager.data.totalInvested,
    totalRewards: investmentManager.data.totalInvested * 0.05, // Mock total rewards as 5% of investment
    dailyRewards: investmentManager.data.totalInvested * 0.003, // 0.3% daily
    referralCount: investmentManager.data.referrals.length,
    referralRewards: mockData.referralRewards,
    poolRewards: mockData.poolRewards,
    rank: investmentManager.data.rank,
    availableRewards: investmentManager.data.availableRewards,
    referrals: investmentManager.data.referrals,
    referralCommission: investmentManager.data.referralCommission,
    directInvestment: mockData.directInvestment,
    qualifiedPools: mockData.qualifiedPools,
    balance: tokenContract.data.balance,
    allowance: tokenContract.data.allowance,
  }

  // Handle claim rewards
  const handleClaimRewards = async () => {
    try {
      await investmentManager.withdraw()
    } catch (error) {
      console.error("Error claiming rewards:", error)
    }
  }

  // Handle approve tokens
  const handleApproveTokens = async (amount: string) => {
    try {
      await tokenContract.approve(amount)
    } catch (error) {
      console.error("Error approving tokens:", error)
      throw error
    }
  }

  // Handle deposit
  const handleDeposit = async (poolId: number, amount: string, referrer?: string) => {
    try {
      await investmentManager.deposit(poolId, amount, referrer)
    } catch (error) {
      console.error("Error depositing tokens:", error)
      throw error
    }
  }

  // Simulate loading state
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Include DashboardHeader directly in the page */}
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {!isConnected ? (
            <ConnectWalletPrompt />
          ) : isLoading || investmentManager.loading || tokenContract.loading ? (
            <DashboardSkeleton />
          ) : (
            <DashboardContent
              data={dashboardData}
              onClaimRewards={handleClaimRewards}
              onApproveTokens={handleApproveTokens}
              onDeposit={handleDeposit}
              isPending={investmentManager.isPending || tokenContract.isPending}
              address={address}
              referralCode={referralCode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ConnectWalletPrompt() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatedCard
        variant="gradient"
        className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Wallet className="h-10 w-10 text-purple-300" />
        </motion.div>

        <motion.h2
          className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Connect Your Wallet
        </motion.h2>

        <motion.p
          className="text-gray-400 max-w-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Connect your wallet to access your investment dashboard and manage your 5PT tokens.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <CustomConnectButton />
        </motion.div>
      </AnimatedCard>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.1 },
            }}
          >
            <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>

        <motion.div
          className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="h-80 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>

        <motion.div
          className="h-80 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>
      </div>
    </div>
  )
}

interface DashboardContentProps {
  data: {
    totalInvested: number
    totalRewards: number
    dailyRewards: number
    referralCount: number
    referralRewards: number
    poolRewards: number
    rank: number
    availableRewards: number
    referrals: string[]
    referralCommission: number
    directInvestment: number
    qualifiedPools: number[]
    balance: number
    allowance: number
  }
  onClaimRewards: () => Promise<void>
  onApproveTokens: (amount: string) => Promise<void>
  onDeposit: (poolId: number, amount: string, referrer?: string) => Promise<void>
  isPending: boolean
  address?: `0x${string}`
  referralCode?: string
}

function DashboardContent({
  data,
  onClaimRewards,
  onApproveTokens,
  onDeposit,
  isPending,
  address,
  referralCode,
}: DashboardContentProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Dashboard title */}
      <motion.h1
        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        5PT Investment Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedStatsCard
          title="Total Invested"
          value={`$${data.totalInvested.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={+5.2}
          color="purple"
        />

        <AnimatedStatsCard
          title="Total Rewards"
          value={`$${data.totalRewards.toFixed(2)}`}
          icon={<Zap className="h-5 w-5" />}
          trend={+12.8}
          color="blue"
        />

        <AnimatedStatsCard
          title="Daily Rewards"
          value={`$${data.dailyRewards.toFixed(2)}`}
          icon={<ArrowUpRight className="h-5 w-5" />}
          color="green"
        />

        <AnimatedStatsCard
          title="Active Referrals"
          value={data.referralCount.toString()}
          icon={<Users className="h-5 w-5" />}
          trend={+3.5}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnimatedRewardsCard
          data={{
            availableRewards: data.availableRewards,
            dailyRewards: data.dailyRewards,
            referralRewards: data.referralRewards,
            poolRewards: data.poolRewards,
            totalRewards: data.totalRewards,
            isPending,
            onClaim: onClaimRewards,
          }}
        />

        <PoolQualification3D
          data={{
            totalInvested: data.totalInvested,
            referralCount: data.referralCount,
            directInvestment: data.directInvestment,
            qualifiedPools: data.qualifiedPools,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentForm
          data={{
            balance: data.balance,
            allowance: data.allowance,
            isPending,
            onApprove: onApproveTokens,
            onDeposit,
            referralCode,
          }}
        />

        <ReferralStats
          data={{
            referrals: data.referrals,
            referralCommission: data.referralCommission,
            address,
          }}
        />
      </div>

      <motion.div
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          The 5PT Investment Platform is running on the Binance Smart Chain.
          <br />
          Contract Addresses: Token (0x8FafdFB035C9426a50D842873D5d401C933bE09F) | Investment Manager
          (0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc)
        </p>
      </motion.div>
    </motion.div>
  )
}
