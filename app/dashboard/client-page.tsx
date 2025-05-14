"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { InvestmentProvider } from "@/components/dashboard/investment-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { HeroMetrics } from "@/components/dashboard/hero-metrics"
import { InvestmentPerformance } from "@/components/dashboard/investment-performance"
import { RankAchievements } from "@/components/dashboard/rank-achievements"
import { PoolQualification } from "@/components/dashboard/pool-qualification"
import { ReferralNetwork } from "@/components/dashboard/referral-network"
import { TokenPerformance } from "@/components/dashboard/token-performance"
import { LiveEarnings } from "@/components/dashboard/live-earnings"
import { ShareableAchievements } from "@/components/dashboard/shareable-achievements"
import { useAccount } from "wagmi"
import { ConnectWalletPrompt } from "@/components/dashboard/connect-wallet-prompt"

export default function DashboardClient() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isConnected || !address) {
    return <ConnectWalletPrompt />
  }

  return (
    <InvestmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950/20">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            className="grid grid-cols-1 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroMetrics />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InvestmentPerformance />
              <RankAchievements />
            </div>

            <PoolQualification />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ReferralNetwork />
              <TokenPerformance />
            </div>

            <LiveEarnings />
            <ShareableAchievements />
          </motion.div>
        </main>
      </div>
    </InvestmentProvider>
  )
}
