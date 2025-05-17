/**
 * @file ConnectButton.tsx
 * @description A customized RainbowKit connect button for wallet connection
 *
 * This component provides a styled wallet connection button that integrates
 * with RainbowKit and wagmi. It handles different connection states and
 * provides a consistent UI across the application with proper error handling
 * and loading states.
 *
 * @dependencies
 * - @rainbow-me/rainbowkit: Provides the ConnectButton component
 * - wagmi: Provides wallet connection hooks
 * - components/ui/CyberButton: Used for styling the button
 *
 * @related
 * - components/providers/Providers.tsx: Provides the Web3 context
 * - lib/wagmi-config.ts: Provides network detection utilities
 */

"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit"
import { CyberButton } from "@/components/ui/CyberButton"

/**
 * CustomConnectButton Component
 *
 * A styled wallet connection button that integrates with RainbowKit.
 *
 * ⚠️ IMPORTANT: RainbowKit Integration Guidelines ⚠️
 *
 * 1. DO NOT import RainbowKit styles here
 * 2. ALWAYS use mounting checks to prevent hydration errors
 * 3. ALWAYS wrap the button in a relative positioned div with z-index
 *    to ensure proper modal positioning
 */
export function CustomConnectButton() {
  // CRITICAL: Mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Only show the component after client-side hydration
  useEffect(() => {
    try {
      setMounted(true)
    } catch (err) {
      console.error("Error mounting ConnectButton:", err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
    }

    // Add error handler for WalletConnect
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("walletconnect") ||
        event.message.includes("heartbeat") ||
        event.filename?.includes("walletconnect")
      ) {
        console.warn("WalletConnect error suppressed:", event.message)
        event.preventDefault()
        setError(new Error(event.message))
        return true
      }
    }

    window.addEventListener("error", handleError as any)
    return () => window.removeEventListener("error", handleError as any)
  }, [])

  // CRITICAL: Don't render during SSR
  if (!mounted) {
    return (
      <CyberButton variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </CyberButton>
    )
  }

  // Show error state if there was an error
  if (error) {
    return (
      <CyberButton variant="primary" size="sm" onClick={() => window.location.reload()}>
        Retry Connection
      </CyberButton>
    )
  }

  // Render the RainbowKit ConnectButton with custom styling
  try {
    return (
      <div className="relative z-10">
        {/* CRITICAL: Relative positioning and z-index for proper modal positioning */}
        <RainbowKitConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
            const ready = mounted && authenticationStatus !== "loading"
            const connected =
              ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated")

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <CyberButton variant="primary" size="sm" onClick={openConnectModal}>
                        Connect Wallet
                      </CyberButton>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <CyberButton
                        variant="outline"
                        size="sm"
                        onClick={openChainModal}
                        className="text-red-400 border-red-400"
                      >
                        Wrong Network
                      </CyberButton>
                    )
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <CyberButton variant="outline" size="sm" onClick={openChainModal} className="text-purple-400">
                        {chain.name}
                      </CyberButton>

                      <CyberButton variant="outline" size="sm" onClick={openAccountModal} className="text-purple-400">
                        {account.displayName}
                      </CyberButton>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </RainbowKitConnectButton.Custom>
      </div>
    )
  } catch (err) {
    console.error("Error rendering ConnectButton:", err)
    setError(err instanceof Error ? err : new Error("Unknown error"))
    return (
      <CyberButton variant="primary" size="sm" onClick={() => window.location.reload()}>
        Connect Wallet
      </CyberButton>
    )
  }
}

// Add a named export for backward compatibility
export { CustomConnectButton as ConnectButton }

// Default export for easier imports
export default CustomConnectButton
