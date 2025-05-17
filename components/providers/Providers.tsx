/**
 * @file Providers.tsx
 * @description Root providers component for the application
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
import { config } from "@/lib/wagmi-config"
import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { bsc, bscTestnet } from "wagmi/chains"
import { rainbowkitTheme } from "@/lib/rainbowkit-theme"

interface ProvidersProps {
  children: ReactNode
}

// Initialize RainbowKit
const { connectors } = getDefaultWallets({
  appName: "5PT Investment DApp",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [bsc, bscTestnet],
})

// Create a client for TanStack Query
const queryClient = new QueryClient()

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
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function Providers({ children }: ProvidersProps) {
  // CRITICAL: Mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowkitTheme} chains={[bsc, bscTestnet]}>
            {mounted ? children : null}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default Providers
