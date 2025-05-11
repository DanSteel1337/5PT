"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi-config"
import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { shouldUseMockData, isBrowser } from "@/lib/environment"

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable retries in preview environments to avoid unnecessary requests
            retry: !shouldUseMockData(),
            // Shorter stale time in preview environments
            staleTime: shouldUseMockData() ? 1000 * 60 : 1000 * 60 * 5,
          },
        },
      }),
  )

  // Warn about preview mode
  useEffect(() => {
    if (isBrowser() && shouldUseMockData()) {
      console.info("Running in preview mode with mock data. WalletConnect is disabled.")
    }
  }, [])

  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
