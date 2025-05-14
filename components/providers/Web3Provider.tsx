"use client"

import { useState, useEffect, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi-config" // ✅ Using correct import name
import { customRainbowKitTheme } from "@/lib/rainbowkit-theme" // ✅ Using correct import name
import { RainbowKitStylesProvider } from "./RainbowKitStylesProvider"

/**
 * ⚠️ IMPORTANT: RainbowKit Styling Guidelines ⚠️
 *
 * 1. DO NOT import RainbowKit styles here or in any client component:
 *    ❌ import "@rainbow-me/rainbowkit/styles.css"
 *
 * 2. ALWAYS import RainbowKit styles ONLY in:
 *    ✅ app/layout.tsx (or pages/_app.tsx for Pages Router)
 *    OR use the RainbowKitStylesProvider as a workaround for Vercel v0 preview
 *
 * 3. If you see "Failed to load @rainbow-me/rainbowkit/styles.css" errors:
 *    - Remove any direct imports in client components
 *    - Ensure it's imported in the root layout
 *    - Clear browser cache and restart dev server
 */

/**
 * Web3Provider Component
 *
 * This component provides the necessary context for Web3 functionality.
 * It must be a client component and should be wrapped in a Suspense boundary.
 *
 * CRITICAL REQUIREMENTS:
 * 1. Must be a client component ('use client' directive)
 * 2. Must implement mounting checks to prevent hydration errors
 * 3. Must maintain correct provider nesting order:
 *    WagmiProvider > QueryClientProvider > RainbowKitProvider
 * 4. Must not import RainbowKit styles directly
 *
 * VERCEL V0 PREVIEW WORKAROUND:
 * We're using RainbowKitStylesProvider to handle CSS loading issues in the Vercel v0 preview environment.
 * This provider will:
 * - Dynamically import RainbowKit styles in normal environments
 * - Apply critical inline styles in the Vercel v0 preview environment
 */
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
            refetchOnWindowFocus: false, // Prevent refetching on window focus
          },
        },
      }),
  )

  // CRITICAL: Mounting check to prevent hydration errors
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

  // CRITICAL: Don't render Web3 providers during SSR
  if (!mounted) {
    return <>{children}</>
  }

  // CRITICAL: Maintain correct provider nesting order
  // Added RainbowKitStylesProvider to handle CSS loading issues in Vercel v0 preview
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitStylesProvider>
          <RainbowKitProvider
            theme={customRainbowKitTheme} // ✅ Using correct theme variable
            modalSize="compact"
            appInfo={{
              appName: "5PT Investment Manager",
              learnMoreUrl: "https://5pt.finance/about",
            }}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitStylesProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Web3Provider
