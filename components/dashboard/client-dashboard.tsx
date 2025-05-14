"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { ConnectWalletPrompt } from "@/components/dashboard/connect-wallet-prompt"
import { InvestorOverview } from "@/components/dashboard/investor-overview"
import { InvestmentMetrics } from "@/components/dashboard/investment-metrics"
import { PoolQualification } from "@/components/dashboard/pool-qualification"
import { RewardsTracker } from "@/components/dashboard/rewards-tracker"
import { ReferralNetwork } from "@/components/dashboard/referral-network"
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
    <div className="relative min-h-screen">
      <ParticleBackground />

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvestorOverview />
          </div>
          <div>
            <InvestmentMetrics />
          </div>
        </div>

        <RewardsTracker />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralNetwork />
          <TokenPerformance />
        </div>

        <PoolQualification />

        <AchievementCards />
      </div>
    </div>
  )
}
