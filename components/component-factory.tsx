"use client"

import type React from "react"

import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { QueryClientProvider } from "./providers/query-client-provider"
import { ErrorBoundary } from "@/components/error-boundary"

// Debug helper function
function debugComponent(name: string, component: any) {
  console.log(`[DEBUG] Component "${name}":`, {
    component,
    type: typeof component,
    isValid: typeof component === "function" || (component && typeof component === "object"),
    constructor: component?.constructor?.name,
  })

  if (!component) {
    console.error(`[ERROR] Component "${name}" is ${component} - this will cause "is not a function" errors`)
  } else if (typeof component !== "function" && (!component || typeof component !== "object")) {
    console.error(`[ERROR] Component "${name}" is not a valid React component (type: ${typeof component})`)
  }

  return component
}

// Dynamic imports with proper QueryClientProvider wrapping
export const DynamicUserInvestment = lazy(() =>
  import("./dashboard/user-investment").then((mod) => {
    console.log("[DEBUG] Loaded module: user-investment", mod)
    debugComponent("UserInvestment", mod.UserInvestment)

    return {
      default: (props: any) => {
        console.log("[DEBUG] Rendering DynamicUserInvestment")
        try {
          return (
            <QueryClientProvider>
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-red-500 border border-red-300 rounded">
                    Error rendering UserInvestment. Check console for details.
                  </div>
                }
              >
                <mod.UserInvestment {...props} />
              </ErrorBoundary>
            </QueryClientProvider>
          )
        } catch (error) {
          console.error("[ERROR] Failed to render UserInvestment:", error)
          return (
            <div className="p-4 text-red-500 border border-red-300 rounded">
              Failed to render UserInvestment: {error instanceof Error ? error.message : String(error)}
            </div>
          )
        }
      },
    }
  }),
)

export const DynamicTokenStats = lazy(() =>
  import("./dashboard/token-stats").then((mod) => {
    console.log("[DEBUG] Loaded module: token-stats", mod)
    debugComponent("TokenStats", mod.TokenStats)

    return {
      default: (props: any) => {
        console.log("[DEBUG] Rendering DynamicTokenStats")
        try {
          return (
            <QueryClientProvider>
              <ErrorBoundary
                fallback={
                  <div className="p-4 text-red-500 border border-red-300 rounded">
                    Error rendering TokenStats. Check console for details.
                  </div>
                }
              >
                <mod.TokenStats {...props} />
              </ErrorBoundary>
            </QueryClientProvider>
          )
        } catch (error) {
          console.error("[ERROR] Failed to render TokenStats:", error)
          return (
            <div className="p-4 text-red-500 border border-red-300 rounded">
              Failed to render TokenStats: {error instanceof Error ? error.message : String(error)}
            </div>
          )
        }
      },
    }
  }),
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

// Factory function to create a component with loading state and error logging
export function createComponent(Component: React.ComponentType, name = "UnnamedComponent") {
  console.log(`[DEBUG] Creating component wrapper for "${name}"`)

  return function WrappedComponent(props: any) {
    console.log(`[DEBUG] Rendering wrapped component "${name}"`)

    try {
      debugComponent(name, Component)

      return (
        <Suspense fallback={<ComponentSkeleton />}>
          <ErrorBoundary
            fallback={
              <div className="p-4 text-red-500 border border-red-300 rounded">
                Error rendering {name}. Check console for details.
              </div>
            }
          >
            <Component {...props} />
          </ErrorBoundary>
        </Suspense>
      )
    } catch (error) {
      console.error(`[ERROR] Failed to render "${name}":`, error)
      return (
        <div className="p-4 text-red-500 border border-red-300 rounded">
          Failed to render {name}: {error instanceof Error ? error.message : String(error)}
        </div>
      )
    }
  }
}
