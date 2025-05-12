"use client"

import React from "react"
import { lazy, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { QueryClientProvider } from "./providers/query-client-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { debugComponent, logger } from "@/lib/debug-utils"

// Enhanced dynamic import pattern with better error handling
function createDynamicComponent<T extends Record<string, any>>(
  importFn: () => Promise<T>,
  componentName: string,
  exportName: string,
) {
  return lazy(() =>
    importFn()
      .then((mod) => {
        logger.debug("DynamicImport", `Loading module for ${componentName}`, mod)

        // Check for default export
        if (mod.default) {
          logger.debug("DynamicImport", `Found default export for ${componentName}`)
          debugComponent(componentName, mod.default)
          return mod
        }

        // Check for named export
        if (mod[exportName]) {
          logger.debug("DynamicImport", `Found named export ${exportName} for ${componentName}`)
          debugComponent(componentName, mod[exportName])

          return {
            default: (props: any) => {
              logger.debug("DynamicImport", `Rendering ${componentName} with named export ${exportName}`)

              return (
                <ErrorBoundary componentName={componentName}>
                  <QueryClientProvider>{React.createElement(mod[exportName], props)}</QueryClientProvider>
                </ErrorBoundary>
              )
            },
          }
        }

        // Log available exports to help debugging
        const availableExports = Object.keys(mod).join(", ")
        logger.error(
          "DynamicImport",
          `Module for ${componentName} does not have a default or ${exportName} export. Available exports: ${availableExports}`,
        )

        // Return a fallback component that shows the error
        return {
          default: () => (
            <div className="p-4 text-red-500 border border-red-300 rounded">
              <h3 className="font-bold">Component Import Error</h3>
              <p>
                Could not find export "{exportName}" in module for {componentName}.
              </p>
              <p className="text-xs mt-2">Available exports: {availableExports || "none"}</p>
            </div>
          ),
        }
      })
      .catch((error) => {
        logger.error("DynamicImport", `Error importing ${componentName}:`, error)

        // Return a fallback component that shows the error
        return {
          default: () => (
            <div className="p-4 text-red-500 border border-red-300 rounded">
              <h3 className="font-bold">Component Import Error</h3>
              <p>
                Failed to load {componentName}: {error.message}
              </p>
            </div>
          ),
        }
      }),
  )
}

// Create dynamic components with the enhanced pattern
export const DynamicUserInvestment = createDynamicComponent(
  () => import("./dashboard/user-investment"),
  "UserInvestment",
  "UserInvestment",
)

export const DynamicTokenStats = createDynamicComponent(
  () => import("./dashboard/token-stats"),
  "TokenStats",
  "TokenStats",
)

export const DynamicReferralStats = createDynamicComponent(
  () => import("./dashboard/referral-stats"),
  "ReferralStats",
  "ReferralStats",
)

export const DynamicRecentTransactions = createDynamicComponent(
  () => import("./dashboard/recent-transactions"),
  "RecentTransactions",
  "RecentTransactions",
)

export const DynamicTokenChart = createDynamicComponent(
  () => import("./dashboard/token-chart"),
  "TokenChart",
  "TokenChart",
)

export const DynamicEnhancedTokenChart = createDynamicComponent(
  () => import("./dashboard/enhanced-token-chart"),
  "EnhancedTokenChart",
  "EnhancedTokenChart",
)

export const DynamicPoolsOverview = createDynamicComponent(
  () => import("./dashboard/pools-overview"),
  "PoolsOverview",
  "PoolsOverview",
)

export const DynamicPoolsGrid = createDynamicComponent(() => import("./dashboard/pools-grid"), "PoolsGrid", "PoolsGrid")

export const DynamicPoolStatusGrid = createDynamicComponent(
  () => import("./dashboard/pool-status-grid"),
  "PoolStatusGrid",
  "PoolStatusGrid",
)

export const DynamicTokenHolders = createDynamicComponent(
  () => import("./dashboard/token-holders"),
  "TokenHolders",
  "TokenHolders",
)

export const DynamicTokenTransactions = createDynamicComponent(
  () => import("./dashboard/token-transactions"),
  "TokenTransactions",
  "TokenTransactions",
)

export const DynamicTokenMetricsCard = createDynamicComponent(
  () => import("./dashboard/token-metrics-card"),
  "TokenMetricsCard",
  "TokenMetricsCard",
)

export const DynamicContractStatisticsCard = createDynamicComponent(
  () => import("./dashboard/contract-statistics-card"),
  "ContractStatisticsCard",
  "ContractStatisticsCard",
)

export const DynamicInvestmentPerformanceCard = createDynamicComponent(
  () => import("./dashboard/investment-performance-card"),
  "InvestmentPerformanceCard",
  "InvestmentPerformanceCard",
)

export const DynamicReferralNetworkCard = createDynamicComponent(
  () => import("./dashboard/referral-network-card"),
  "ReferralNetworkCard",
  "ReferralNetworkCard",
)

export const DynamicShareCard = createDynamicComponent(() => import("./dashboard/share-card"), "ShareCard", "ShareCard")

export const DynamicInvestmentAnalytics = createDynamicComponent(
  () => import("./dashboard/investment-analytics"),
  "InvestmentAnalytics",
  "InvestmentAnalytics",
)

export const DynamicSmartReferralSystem = createDynamicComponent(
  () => import("./dashboard/smart-referral-system"),
  "SmartReferralSystem",
  "SmartReferralSystem",
)

export const DynamicEnhancedReferralSystem = createDynamicComponent(
  () => import("./dashboard/enhanced-referral-system"),
  "EnhancedReferralSystem",
  "EnhancedReferralSystem",
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
  logger.debug("ComponentFactory", `Creating component wrapper for "${name}"`)

  return function WrappedComponent(props: any) {
    logger.debug("ComponentFactory", `Rendering wrapped component "${name}"`)

    try {
      debugComponent(name, Component)

      return (
        <Suspense fallback={<ComponentSkeleton />}>
          <ErrorBoundary componentName={name}>
            <Component {...props} />
          </ErrorBoundary>
        </Suspense>
      )
    } catch (error) {
      logger.error("ComponentFactory", `Failed to render "${name}":`, error)
      return (
        <div className="p-4 text-red-500 border border-red-300 rounded">
          <h3 className="font-bold">Component Render Error</h3>
          <p>
            Failed to render {name}: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      )
    }
  }
}
