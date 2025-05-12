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

// Fixed dynamic import pattern that works with named exports
export const DynamicUserInvestment = lazy(() =>
  import("./dashboard/user-investment").then((mod) => {
    console.log("[DEBUG] Loaded module: user-investment", mod)

    // Check if the module has a default export
    if (mod.default) {
      return mod // Use the default export directly
    }

    // If there's no default export but there's a named export, create a default export
    if (mod.UserInvestment) {
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
    }

    // If neither default nor named export exists, throw an error
    throw new Error(`Module ./dashboard/user-investment does not have a default or UserInvestment export`)
  }),
)

export const DynamicTokenStats = lazy(() =>
  import("./dashboard/token-stats").then((mod) => {
    console.log("[DEBUG] Loaded module: token-stats", mod)

    // Check if the module has a default export
    if (mod.default) {
      return mod // Use the default export directly
    }

    // If there's no default export but there's a named export, create a default export
    if (mod.TokenStats) {
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
    }

    // If neither default nor named export exists, throw an error
    throw new Error(`Module ./dashboard/token-stats does not have a default or TokenStats export`)
  }),
)

// Updated pattern for all other dynamic imports
export const DynamicReferralStats = lazy(() =>
  import("./dashboard/referral-stats").then((mod) => {
    if (mod.default) return mod
    if (mod.ReferralStats) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.ReferralStats {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/referral-stats does not have a default or ReferralStats export`)
  }),
)

export const DynamicRecentTransactions = lazy(() =>
  import("./dashboard/recent-transactions").then((mod) => {
    if (mod.default) return mod
    if (mod.RecentTransactions) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.RecentTransactions {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/recent-transactions does not have a default or RecentTransactions export`)
  }),
)

export const DynamicTokenChart = lazy(() =>
  import("./dashboard/token-chart").then((mod) => {
    if (mod.default) return mod
    if (mod.TokenChart) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.TokenChart {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/token-chart does not have a default or TokenChart export`)
  }),
)

export const DynamicEnhancedTokenChart = lazy(() =>
  import("./dashboard/enhanced-token-chart").then((mod) => {
    if (mod.default) return mod
    if (mod.EnhancedTokenChart) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.EnhancedTokenChart {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/enhanced-token-chart does not have a default or EnhancedTokenChart export`)
  }),
)

export const DynamicPoolsOverview = lazy(() =>
  import("./dashboard/pools-overview").then((mod) => {
    if (mod.default) return mod
    if (mod.PoolsOverview) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.PoolsOverview {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/pools-overview does not have a default or PoolsOverview export`)
  }),
)

export const DynamicPoolsGrid = lazy(() =>
  import("./dashboard/pools-grid").then((mod) => {
    if (mod.default) return mod
    if (mod.PoolsGrid) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.PoolsGrid {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/pools-grid does not have a default or PoolsGrid export`)
  }),
)

export const DynamicPoolStatusGrid = lazy(() =>
  import("./dashboard/pool-status-grid").then((mod) => {
    if (mod.default) return mod
    if (mod.PoolStatusGrid) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.PoolStatusGrid {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/pool-status-grid does not have a default or PoolStatusGrid export`)
  }),
)

export const DynamicTokenHolders = lazy(() =>
  import("./dashboard/token-holders").then((mod) => {
    if (mod.default) return mod
    if (mod.TokenHolders) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.TokenHolders {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/token-holders does not have a default or TokenHolders export`)
  }),
)

export const DynamicTokenTransactions = lazy(() =>
  import("./dashboard/token-transactions").then((mod) => {
    if (mod.default) return mod
    if (mod.TokenTransactions) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.TokenTransactions {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/token-transactions does not have a default or TokenTransactions export`)
  }),
)

export const DynamicTokenMetricsCard = lazy(() =>
  import("./dashboard/token-metrics-card").then((mod) => {
    if (mod.default) return mod
    if (mod.TokenMetricsCard) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.TokenMetricsCard {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/token-metrics-card does not have a default or TokenMetricsCard export`)
  }),
)

export const DynamicContractStatisticsCard = lazy(() =>
  import("./dashboard/contract-statistics-card").then((mod) => {
    if (mod.default) return mod
    if (mod.ContractStatisticsCard) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.ContractStatisticsCard {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(
      `Module ./dashboard/contract-statistics-card does not have a default or ContractStatisticsCard export`,
    )
  }),
)

export const DynamicInvestmentPerformanceCard = lazy(() =>
  import("./dashboard/investment-performance-card").then((mod) => {
    if (mod.default) return mod
    if (mod.InvestmentPerformanceCard) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.InvestmentPerformanceCard {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(
      `Module ./dashboard/investment-performance-card does not have a default or InvestmentPerformanceCard export`,
    )
  }),
)

export const DynamicReferralNetworkCard = lazy(() =>
  import("./dashboard/referral-network-card").then((mod) => {
    if (mod.default) return mod
    if (mod.ReferralNetworkCard) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.ReferralNetworkCard {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/referral-network-card does not have a default or ReferralNetworkCard export`)
  }),
)

export const DynamicShareCard = lazy(() =>
  import("./dashboard/share-card").then((mod) => {
    if (mod.default) return mod
    if (mod.ShareCard) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.ShareCard {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/share-card does not have a default or ShareCard export`)
  }),
)

export const DynamicInvestmentAnalytics = lazy(() =>
  import("./dashboard/investment-analytics").then((mod) => {
    if (mod.default) return mod
    if (mod.InvestmentAnalytics) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.InvestmentAnalytics {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/investment-analytics does not have a default or InvestmentAnalytics export`)
  }),
)

export const DynamicSmartReferralSystem = lazy(() =>
  import("./dashboard/smart-referral-system").then((mod) => {
    if (mod.default) return mod
    if (mod.SmartReferralSystem) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.SmartReferralSystem {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(`Module ./dashboard/smart-referral-system does not have a default or SmartReferralSystem export`)
  }),
)

export const DynamicEnhancedReferralSystem = lazy(() =>
  import("./dashboard/enhanced-referral-system").then((mod) => {
    if (mod.default) return mod
    if (mod.EnhancedReferralSystem) {
      return {
        default: (props: any) => (
          <QueryClientProvider>
            <mod.EnhancedReferralSystem {...props} />
          </QueryClientProvider>
        ),
      }
    }
    throw new Error(
      `Module ./dashboard/enhanced-referral-system does not have a default or EnhancedReferralSystem export`,
    )
  }),
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
