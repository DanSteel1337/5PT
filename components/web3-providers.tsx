"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi-config"
import { useState, useEffect } from "react"

// Safe environment detection
const isBrowser = typeof window !== "undefined"
const isPreview =
  isBrowser &&
  (window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default query options
            retry: 3,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  )

  // Warn about preview mode
  useEffect(() => {
    if (isPreview) {
      console.info("Running in preview mode with mock data. WalletConnect is disabled.")
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
