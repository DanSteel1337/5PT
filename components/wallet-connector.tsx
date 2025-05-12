"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletConnector() {
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)

  // Ensure we're only running client-side code after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="lg" disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const handleConnect = () => {
    // Mock connection for now
    setConnected(true)
  }

  return (
    <Button
      variant={connected ? "default" : "outline"}
      size="lg"
      onClick={handleConnect}
      className={connected ? "bg-green-600 hover:bg-green-700" : ""}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connected ? "Wallet Connected" : "Connect Wallet"}
    </Button>
  )
}
