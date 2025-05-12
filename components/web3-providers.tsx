"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider } from "./providers/query-client-provider"
import config from "@/lib/wagmi-config"
import { shouldUseMockData } from "@/lib/environment"

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) return null

  // If we're using mock data, just render the children without the providers
  if (shouldUseMockData()) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
