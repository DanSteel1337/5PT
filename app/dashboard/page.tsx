"use client"

import { useAccount } from "wagmi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OptimizedPortfolioSummary } from "@/components/dashboard/optimized-portfolio-summary"
import { ActiveInvestments } from "@/components/dashboard/active-investments"
import { OptimizedQuickActions } from "@/components/dashboard/optimized-quick-actions"
import { EnhancedPerformanceChart } from "@/components/dashboard/enhanced-performance-chart"
import { OptimizedTokenMetrics } from "@/components/dashboard/optimized-token-metrics"
import { OptimizedRewardsDashboard } from "@/components/dashboard/optimized-rewards-dashboard"
import { StableParticleBackground } from "@/components/ui/stable-particle-background"
import Image from "next/image"
import { WalletPrompt } from "@/components/ui/wallet-prompt"

export default function DashboardPage() {
  const { isConnected } = useAccount()

  return (
    <DashboardLayout>
      <StableParticleBackground />

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/5pt-logo.png"
              alt="Five Pillars Token"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1 className="text-3xl font-bold text-amber-300">Dashboard</h1>
          </div>
        </div>

        {isConnected ? (
          <>
            <OptimizedTokenMetrics />
            <OptimizedPortfolioSummary />
            <OptimizedQuickActions />
            <OptimizedRewardsDashboard />
            <EnhancedPerformanceChart />
            <ActiveInvestments />
          </>
        ) : (
          <WalletPrompt />
        )}
      </div>
    </DashboardLayout>
  )
}
