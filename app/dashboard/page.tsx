"use client"

import { useAccount } from "wagmi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OptimizedPortfolioSummary } from "@/components/dashboard/optimized-portfolio-summary"
import { ActiveInvestments } from "@/components/dashboard/active-investments"
import { OptimizedQuickActions } from "@/components/dashboard/optimized-quick-actions"
import { EnhancedPerformanceChart } from "@/components/dashboard/enhanced-performance-chart"
import { OptimizedTokenMetrics } from "@/components/dashboard/optimized-token-metrics"
import { OptimizedRewardsDashboard } from "@/components/dashboard/optimized-rewards-dashboard"
import { ConnectKitButton } from "connectkit"
import { Button } from "@/components/ui/button"
import { StableParticleBackground } from "@/components/ui/stable-particle-background"
import Image from "next/image"

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

          {!isConnected && (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button onClick={show} className="bg-amber-700 hover:bg-amber-600 text-white font-bold">
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          )}
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8">
              <Image
                src="/images/5pt-logo.png"
                alt="Five Pillars Token"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-amber-300">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect your wallet to view your dashboard, manage investments, and track rewards.
            </p>
            <ConnectKitButton />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
