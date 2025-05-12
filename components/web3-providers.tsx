"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi-config"
import { useState, useEffect } from "react"
import { isPreviewEnvironment } from "@/lib/environment"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      }),
  )
  const [mounted, setMounted] = useState(false)
  const isPreview = isPreviewEnvironment()

  // Only render children after component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration errors by only rendering on client
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-900">
          <h3 className="text-lg font-semibold mb-2">Web3 Provider Error</h3>
          <p>There was an error initializing the Web3 providers. Please refresh the page or try again later.</p>
        </div>
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {isPreview && (
            <Alert variant="warning" className="mb-4 border-yellow-500 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Preview Mode</AlertTitle>
              <AlertDescription>
                You are viewing this app in preview mode. Wallet connections and blockchain interactions are simulated.
              </AlertDescription>
            </Alert>
          )}
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
