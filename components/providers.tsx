"use client"

import type React from "react"

import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi-config"

// Create a client for React Query
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  // Use state to track if we're in a browser environment
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after the component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* Only render children when mounted to avoid hydration issues */}
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
