"use client"

import { useState, useEffect, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"
import { customRainbowKitTheme } from "@/lib/rainbowkit-theme"

export function Web3Provider({ children }: { children: ReactNode }) {
  // Create a client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: false, // Disable retries to prevent repeated errors
          },
        },
      }),
  )

  // Add error handling for WalletConnect
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

  // Don't render WalletConnect on server
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customRainbowKitTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Web3Provider
