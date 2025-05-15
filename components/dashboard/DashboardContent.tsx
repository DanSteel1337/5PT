"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { useAccount } from "wagmi"
import { useMounted } from "@/hooks/useMounted"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { CustomConnectButton } from "@/components/web3/ConnectButton"

// Dynamically import components with error boundaries
const DashboardOverview = dynamic(
  () => import("@/components/dashboard/DashboardOverview").then((mod) => ({ default: mod.DashboardOverview })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const ShareableStats = dynamic(
  () => import("@/components/dashboard/ShareableStats").then((mod) => ({ default: mod.ShareableStats })),
  {
    loading: () => <div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>,
    ssr: false,
  },
)

const TokenomicsVisual = dynamic(
  () => import("@/components/dashboard/TokenomicsVisual").then((mod) => ({ default: mod.TokenomicsVisual })),
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
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[150px] bg-purple-900/20 animate-pulse rounded-lg"></div>
        ))}
      </div>
      <div className="h-[500px] bg-purple-900/20 animate-pulse rounded-lg"></div>
    </div>
  )
}

export function DashboardContent() {
  const { isConnected } = useAccount()
  const mounted = useMounted()

  if (!mounted) {
    return <DashboardSkeleton />
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
      {/* Main Dashboard Overview */}
      <ErrorBoundary fallback={<DashboardSkeleton />}>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardOverview />
        </Suspense>
      </ErrorBoundary>

      {/* Shareable Stats */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
          <ShareableStats />
        </Suspense>
      </ErrorBoundary>

      {/* Tokenomics Visual */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
          <TokenomicsVisual />
        </Suspense>
      </ErrorBoundary>

      {/* Referral System */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-[400px] bg-purple-900/20 animate-pulse rounded-lg"></div>}>
          <ReferralSystem />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
