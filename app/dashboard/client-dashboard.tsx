"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { ConnectWalletPrompt } from "@/components/dashboard/connect-wallet-prompt"
import { InvestorOverview } from "@/components/dashboard/investor-overview"
import { InvestmentMetrics } from "@/components/dashboard/investment-metrics"
import { PoolQualification } from "@/components/dashboard/pool-qualification"
import { ReferralNetwork } from "@/components/dashboard/referral-network"
import { RewardsTracker } from "@/components/dashboard/rewards-tracker"
import { TokenPerformance } from "@/components/dashboard/token-performance"
import { AchievementCards } from "@/components/dashboard/achievement-cards"
import { ParticleBackground } from "@/components/dashboard/particle-background"

export function ClientDashboard() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  return (
    <div className="relative">
      <ParticleBackground />

      <div className="space-y-8 relative z-10">
        {/* Hero section with investor overview */}
        <InvestorOverview />

        {/* Key metrics grid */}
        <InvestmentMetrics />

        {/* Pool qualification status */}
        <PoolQualification />

        {/* Two-column layout for rewards and referrals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RewardsTracker />
          <ReferralNetwork />
        </div>

        {/* Token performance */}
        <TokenPerformance />

        {/* Achievement cards */}
        <AchievementCards />
      </div>
    </div>
  )
}
