"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { isPreviewEnvironment } from "@/lib/environment"
import { Loader2 } from "lucide-react"

export function Web3ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const isPreview = isPreviewEnvironment()

  // Only show the component after it's mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Handle connect click
  const handleConnect = () => {
    connect({ connector: injected() })
  }

  // Handle disconnect click
  const handleDisconnect = () => {
    disconnect()
  }

  // In preview mode, show a mock connected state
  if (isPreview) {
    return (
      <Button variant="outline" className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10">
        0x1234...5678
      </Button>
    )
  }

  // Don't render anything until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <Button variant="outline" disabled className="border-purple-500/30">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // If connected, show address and disconnect button
  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
        onClick={handleDisconnect}
      >
        {formatAddress(address)}
      </Button>
    )
  }

  // If not connected, show connect button
  return (
    <Button
      variant="outline"
      className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
      onClick={handleConnect}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}
