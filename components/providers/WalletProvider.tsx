"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { useState, type ReactNode, useEffect } from "react"
import { customTheme } from "@/lib/rainbowkit-theme"

// Always use environment variables for sensitive configuration
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// Verify that the projectId is available
if (!walletConnectProjectId) {
  console.error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not defined")
}

// Create the Wagmi config inside the client component
const config = getDefaultConfig({
  appName: "Five Pillars Investment Platform",
  projectId: walletConnectProjectId || "MISSING_PROJECT_ID", // Fallback to prevent runtime errors
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http("https://bsc-dataseed1.binance.org/"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
  },
  ssr: true, // ✅ SSR flag inside a client component
})

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Create a client for TanStack Query
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration errors by rendering nothing until mounted
  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Add TypeScript registration for improved type safety
declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
