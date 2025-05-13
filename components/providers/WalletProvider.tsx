// components/providers/WalletProvider.tsx
"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { useState, type ReactNode, useEffect, useRef } from "react"
import { customTheme } from "@/lib/rainbowkit-theme"

// Create a query client for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Get WalletConnect projectId from environment variable
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// Validate project ID
if (!walletConnectProjectId) {
  console.warn(
    "WalletConnect ProjectID is missing. Please set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable."
  )
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [mounted, setMounted] = useState(false)
  const initializationRef = useRef(false)
  const configRef = useRef<any>(null)

  // Initialize config only once with the correct URL
  useEffect(() => {
    if (initializationRef.current) return
    initializationRef.current = true

    // Get the actual page URL for metadata
    const pageUrl = typeof window !== "undefined" ? window.location.origin : "https://five-pillars.vercel.app"

    // Create config
    configRef.current = getDefaultConfig({
      appName: "Five Pillars Investment Platform",
      projectId: walletConnectProjectId || "", // Use empty string as fallback
      chains: [bsc, bscTestnet],
      transports: {
        [bsc.id]: http("https://bsc-dataseed1.binance.org/"),
        [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
      },
      ssr: false, // Disable SSR to prevent double initialization
    })

    setMounted(true)

    // Cleanup function to prevent memory leaks
    return () => {
      try {
        // Attempt to clean up WalletConnect resources
        if (window.WalletConnectModal) {
          window.WalletConnectModal = null as any
        }
      } catch (e) {
        console.warn("WalletConnect cleanup failed:", e)
      }
    }
  }, [])

  // Prevent hydration errors by rendering nothing until mounted
  if (!mounted || !configRef.current) {
    return null
  }

  return (
    <WagmiProvider config={configRef.current}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          modalSize="compact"
          appInfo={{
            appName: "Five Pillars Investment Platform",
            learnMoreUrl: "https://five-pillars.vercel.app/about",
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Add TypeScript registration for improved type safety
declare module "wagmi" {
  interface Register {
    config: any // Using any since config is now dynamic
  }
}

// Declaration for WalletConnect cleanup
declare global {
  interface Window {
    WalletConnectModal?: any
  }
}
