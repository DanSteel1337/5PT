"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit"

export function CustomConnectButton() {
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

  // Show loading state during hydration
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
                    <CyberButton variant="outline" size="sm" onClick={openChainModal}>
                      Wrong Network
                    </CyberButton>
                  )
                }

                return (
                  <div className="flex items-center gap-2">
                    <CyberButton variant="outline" size="sm" onClick={openChainModal}>
                      {chain.name}
                    </CyberButton>

                    <CyberButton variant="outline" size="sm" onClick={openAccountModal}>
                      {account.displayName}
                    </CyberButton>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </RainbowKitConnectButton.Custom>
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

// Add default export to ensure it can be imported correctly
export default CustomConnectButton
