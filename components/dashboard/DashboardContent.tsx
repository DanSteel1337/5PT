"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { useAccount } from "wagmi"
import { useMounted } from "@/hooks/useMounted"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { CustomConnectButton } from "@/components/web3/ConnectButton"

// Dynamically import components with error boundaries
const WalletOverview = dynamic(
  () => import("@/components/dashboard/WalletOverview").then((mod) => ({ default: mod.WalletOverview })),
  {
    loading: () => <WalletOverviewSkeleton />,
    ssr: false,
  },
)

const InvestmentStats = dynamic(
  () => import("@/components/dashboard/InvestmentStats").then((mod) => ({ default: mod.InvestmentStats })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const RealTimeEarnings = dynamic(
  () => import("@/components/dashboard/RealTimeEarnings").then((mod) => ({ default: mod.RealTimeEarnings })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const InvestmentPools = dynamic(
  () => import("@/components/dashboard/InvestmentPools").then((mod) => ({ default: mod.InvestmentPools })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const PoolQualificationCard = dynamic(
  () => import("@/components/dashboard/PoolQualificationCard").then((mod) => ({ default: mod.PoolQualificationCard })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const ReferralSystem = dynamic(
  () => import("@/components/dashboard/ReferralSystem").then((mod) => ({ default: mod.ReferralSystem })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

// Skeleton components
function WalletOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[150px] bg-purple-900/20 animate-pulse rounded-lg"></div>
      ))}
    </div>
  )
}

export default function DashboardContent() {
  const { isConnected } = useAccount()
  const mounted = useMounted()

  if (!mounted) {
    return <WalletOverviewSkeleton />
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-black/30 rounded-lg border border-purple-900/30">
        <h3 className="text-xl font-semibold mb-4 text-gradient">Connect Wallet to View Dashboard</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Connect your wallet to access your investment dashboard, view your earnings, and manage your investments.
        </p>
        <CustomConnectButton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Wallet Overview */}
      <ErrorBoundary fallback={<WalletOverviewSkeleton />}>
        <Suspense fallback={<WalletOverviewSkeleton />}>
          <WalletOverview />
        </Suspense>
      </ErrorBoundary>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ErrorBoundary>
            <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
              <RealTimeEarnings />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
              <PoolQualificationCard />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ErrorBoundary>
            <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
              <InvestmentStats />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
              <InvestmentPools />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Referral System */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
          <ReferralSystem />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
