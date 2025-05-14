"use client"

import { useState, useEffect, type ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config"
import RainbowKitStylesProvider from "./RainbowKitStylesProvider"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

/**
 * Web3Provider Component
 *
 * This component provides the necessary context for Web3 functionality.
 * It wraps the application with WagmiProvider, QueryClientProvider, and RainbowKitProvider.
 *
 * IMPORTANT: This component should only be mounted once in the application.
 */
export function Web3Provider({ children }: { children: ReactNode }) {
  // Use state to prevent double initialization during development
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Cleanup function to help prevent double initialization
    return () => {
      setMounted(false)
    }
  }, [])

  // Only render the providers after the component has mounted
  // This prevents double initialization during development
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitStylesProvider>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </RainbowKitStylesProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
