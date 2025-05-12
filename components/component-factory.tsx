"use client"

import type React from "react"

import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { QueryClientProvider } from "./providers/query-client-provider"

// Dynamic imports with proper QueryClientProvider wrapping
export const DynamicUserInvestment = lazy(() =>
  import("./dashboard/user-investment").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.UserInvestment />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicTokenStats = lazy(() =>
  import("./dashboard/token-stats").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.TokenStats />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicReferralStats = lazy(() =>
  import("./dashboard/referral-stats").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.ReferralStats />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicRecentTransactions = lazy(() =>
  import("./dashboard/recent-transactions").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.RecentTransactions />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicTokenChart = lazy(() =>
  import("./dashboard/token-chart").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.TokenChart />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicEnhancedTokenChart = lazy(() =>
  import("./dashboard/enhanced-token-chart").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.EnhancedTokenChart />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicPoolsOverview = lazy(() =>
  import("./dashboard/pools-overview").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.PoolsOverview />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicPoolsGrid = lazy(() =>
  import("./dashboard/pools-grid").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.PoolsGrid />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicPoolStatusGrid = lazy(() =>
  import("./dashboard/pool-status-grid").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.PoolStatusGrid />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicTokenHolders = lazy(() =>
  import("./dashboard/token-holders").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.TokenHolders />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicTokenTransactions = lazy(() =>
  import("./dashboard/token-transactions").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.TokenTransactions />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicTokenMetricsCard = lazy(() =>
  import("./dashboard/token-metrics-card").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.TokenMetricsCard />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicContractStatisticsCard = lazy(() =>
  import("./dashboard/contract-statistics-card").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.ContractStatisticsCard />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicInvestmentPerformanceCard = lazy(() =>
  import("./dashboard/investment-performance-card").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.InvestmentPerformanceCard />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicReferralNetworkCard = lazy(() =>
  import("./dashboard/referral-network-card").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.ReferralNetworkCard />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicShareCard = lazy(() =>
  import("./dashboard/share-card").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.ShareCard />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicInvestmentAnalytics = lazy(() =>
  import("./dashboard/investment-analytics").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.InvestmentAnalytics />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicSmartReferralSystem = lazy(() =>
  import("./dashboard/smart-referral-system").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.SmartReferralSystem />
      </QueryClientProvider>
    ),
  })),
)

export const DynamicEnhancedReferralSystem = lazy(() =>
  import("./dashboard/enhanced-referral-system").then((mod) => ({
    default: () => (
      <QueryClientProvider>
        <mod.EnhancedReferralSystem />
      </QueryClientProvider>
    ),
  })),
)

// Fallback component for Suspense
export function ComponentSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}

// Factory function to create a component with loading state
export function createComponent(Component: React.ComponentType) {
  return function WrappedComponent(props: any) {
    return (
      <Suspense fallback={<ComponentSkeleton />}>
        <Component {...props} />
      </Suspense>
    )
  }
}
