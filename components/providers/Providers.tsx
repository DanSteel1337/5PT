/**
 * @file components/providers/Providers.tsx
 * @description Root providers component for the application
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * - This component is REQUIRED and should NOT be deleted
 * - It is used ONLY ONCE in app/layout.tsx
 * - It provides all necessary providers for the application
 * - It follows the required provider nesting order
 *
 * This component wraps the application with all necessary providers:
 * - ThemeProvider: For theme context
 * - WagmiProvider: For Web3 connectivity
 * - QueryClientProvider: For data fetching
 * - RainbowKitProvider: For wallet connection UI
 *
 * @dependencies
 * - @tanstack/react-query: Provides QueryClientProvider
 * - wagmi: Provides WagmiProvider
 * - @rainbow-me/rainbowkit: Provides RainbowKitProvider
 *
 * @related
 * - app/layout.tsx: Uses this component to wrap the application
 * - lib/wagmi-config.ts: Provides wagmi configuration
 */

"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { type ReactNode, useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { wagmiConfig } from "@/lib/wagmi-config"
import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { bsc, bscTestnet } from "wagmi/chains"
import { theme } from "@/lib/rainbowkit-theme"

interface ProvidersProps {
  children: ReactNode
}

// Initialize RainbowKit
const { connectors } = getDefaultWallets({
  appName: "5PT Investment DApp",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [bsc, bscTestnet],
})

/**
 * Providers Component
 *
 * Wraps the application with all necessary context providers.
 * The order of providers is important - providers that depend on
 * other providers should be nested inside them.
 *
 * CRITICAL: Provider nesting order must be:
 * 1. ThemeProvider
 * 2. WagmiProvider
 * 3. QueryClientProvider
 * 4. RainbowKitProvider
 */
function Providers({ children }: ProvidersProps) {
  // CRITICAL: Mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)
  // Create a client for TanStack Query
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={theme} chains={[bsc, bscTestnet]}>
            {mounted ? children : null}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

// Export both named and default exports to support both import styles
export { Providers }
export default Providers
