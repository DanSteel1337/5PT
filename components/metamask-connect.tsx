"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useMemo, useCallback } from "react"

export function MetaMaskConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Format address for display
  const formattedAddress = useMemo(() => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  // Find MetaMask connector
  const metaMaskConnector = useMemo(() => {
    return connectors.find((c) => c.id === "metaMask" || (c.type === "injected" && window.ethereum?.isMetaMask))
  }, [connectors])

  // Handle connection with useCallback to prevent recreation on each render
  const handleConnect = useCallback(() => {
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector })
    }
  }, [connect, metaMaskConnector])

  if (isConnected && address) {
    return (
      <Button variant="outline" className="flex items-center gap-2" onClick={() => disconnect()}>
        <Wallet className="h-4 w-4" />
        <span>{formattedAddress}</span>
        <LogOut className="ml-2 h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button disabled={isPending || !metaMaskConnector} onClick={handleConnect}>
      {isPending ? "Connecting..." : "Connect MetaMask"}
    </Button>
  )
}
