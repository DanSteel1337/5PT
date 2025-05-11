"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { useState, useEffect } from "react"
import { wagmiConfig } from "@/lib/wagmi-config"

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance only once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 10000,
          },
        },
      }),
  )

  // Client-side only rendering to avoid hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering until client-side
  if (!mounted) {
    return null
  }

  // Use a single configuration with polyfills
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
