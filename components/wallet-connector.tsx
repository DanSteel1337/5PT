"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { useState, useEffect } from "react"
import { shouldUseMockData } from "@/lib/environment"

interface WalletConnectorProps {
  variant?: "default" | "minimal"
}

export function WalletConnector({ variant = "default" }: WalletConnectorProps) {
  const [mounted, setMounted] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  // Check if we're in a preview environment
  useEffect(() => {
    setMounted(true)
    setIsPreview(shouldUseMockData())
  }, [])

  // Handle connect
  const handleConnect = () => {
    if (isPreview) {
      // In preview mode, just show a message
      console.info("WalletConnect is disabled in preview mode")
      return
    }

    connect({ connector: injected() })
  }

  // Handle disconnect
  const handleDisconnect = () => {
    if (isPreview) {
      // In preview mode, just show a message
      console.info("WalletConnect is disabled in preview mode")
      return
    }

    disconnect()
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) return null

  // If in preview mode, show a disabled button
  if (isPreview) {
    return (
      <Button disabled className={variant === "minimal" ? "w-auto" : "w-full"}>
        Preview Mode
      </Button>
    )
  }

  // If connected, show address and disconnect button
  if (isConnected && address) {
    const displayAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
      <Button variant="outline" onClick={handleDisconnect} className={variant === "minimal" ? "w-auto" : "w-full"}>
        {displayAddress}
      </Button>
    )
  }

  // If not connected, show connect button
  return (
    <Button onClick={handleConnect} className={variant === "minimal" ? "w-auto" : "w-full"}>
      Connect Wallet
    </Button>
  )
}
