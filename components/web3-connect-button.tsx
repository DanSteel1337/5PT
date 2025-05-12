"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"

export function Web3ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount() // Moved hook outside conditional
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  // Ensure we're only running client-side code after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  if (isConnected) {
    return (
      <Button
        onClick={() => disconnect()}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    )
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isLoading && pendingConnector?.id === connectors[0].id ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
