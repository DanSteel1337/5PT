"use client"

import { useState, useEffect, Suspense } from "react"
import { useAccount } from "wagmi"
import { ConnectWalletPrompt } from "@/components/dashboard/connect-wallet-prompt"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { ErrorBoundary } from "@/components/ErrorBoundary"

// Import dashboard components
import { InvestorOverview } from "@/components/dashboard/investor-overview"
import { InvestmentMetrics } from "@/components/dashboard/investment-metrics"
import { PoolQualification } from "@/components/dashboard/pool-qualification"
import { RewardsTracker } from "@/components/dashboard/rewards-tracker"
import { ReferralNetwork } from "@/components/dashboard/referral-network"
import { TokenPerformance } from "@/components/dashboard/token-performance"
import { AchievementCards } from "@/components/dashboard/achievement-cards"
import { ParticleBackground } from "@/components/dashboard/particle-background"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"

export default function DashboardPage() {
  // Client-side mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR
  if (!mounted) {
    return <DashboardSkeleton />
  }

  return (
    <ErrorBoundary>
      <ClientDashboard />
    </ErrorBoundary>
  )
}

// Separate component to avoid React hook errors
function ClientDashboard() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ParticleBackground />

      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-1">
            <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
              <InvestorOverview />
            </Suspense>

            <div className="mt-6">
              <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
                <TokenPerformance />
              </Suspense>
            </div>
          </div>

          <div className="md:col-span-2">
            <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
              <InvestmentMetrics />
            </Suspense>

            <div className="mt-6">
              <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
                <RewardsTracker />
              </Suspense>
            </div>

            <div className="mt-6">
              <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
                <PoolQualification />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
            <ReferralNetwork />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="h-48 animate-pulse bg-gray-800 rounded-lg" />}>
            <AchievementCards />
          </Suspense>
        </div>

        <DashboardFooter />
      </div>
    </div>
  )
}
