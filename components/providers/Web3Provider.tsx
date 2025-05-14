"use client"

import { useState, useEffect, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"
import { customRainbowKitTheme } from "@/lib/rainbowkit-theme"
import { RainbowKitStylesProvider } from "./RainbowKitStylesProvider"

/**
 * Web3Provider Component
 *
 * This component provides the necessary context for Web3 functionality.
 *
 * CRITICAL REQUIREMENTS:
 * 1. Must be a client component ('use client' directive)
 * 2. Must maintain correct provider nesting order:
 *    WagmiProvider > QueryClientProvider > RainbowKitProvider
 * 3. Must create a stable QueryClient instance
 * 4. Must handle hydration safely
 */
export function Web3Provider({ children }: { children: ReactNode }) {
  // Create a stable QueryClient instance that persists across renders
  // This is CRITICAL to ensure context stability
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  // Handle hydration safely
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add global error handler for WalletConnect errors
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message &&
        (message.toString().includes("walletconnect") || (source && source.toString().includes("walletconnect")))
      ) {
        console.warn("WalletConnect error suppressed:", message)
        return true // Prevents the error from propagating
      }
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false
    }

    return () => {
      window.onerror = originalOnError
    }
  }, [])

  // During SSR and initial hydration, render a minimal version
  // This prevents hydration mismatches and context issues
  if (!mounted) {
    // Return a minimal version during SSR/initial hydration
    // The key part is that we still establish the providers even before mounting
    // This ensures context is available as soon as possible
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-black"></div>
        </QueryClientProvider>
      </WagmiProvider>
    )
  }

  // After hydration, render the full provider tree with children
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitStylesProvider>
          <RainbowKitProvider
            theme={customRainbowKitTheme}
            modalSize="compact"
            appInfo={{
              appName: "5PT Investment Manager",
              learnMoreUrl: "https://5pt.finance/about",
            }}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitStylesProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Web3Provider
