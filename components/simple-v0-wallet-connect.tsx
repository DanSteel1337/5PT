"use client"

import { useState, useEffect } from "react"
import { useConnect, useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleV0WalletConnect() {
  const [mounted, setMounted] = useState(false)
  const { connect, connectors, isLoading, error } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>Connect your wallet to access the 5PT dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <p className="text-sm">
              Connected as <span className="font-bold">{formatAddress(address || "")}</span>
            </p>
            <Button variant="outline" onClick={() => disconnect()} className="w-full">
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => connect({ connector })}
                disabled={!connector.ready || isLoading}
                className="w-full"
              >
                {connector.name}
                {isLoading && connector.id === "injected" && " (connecting...)"}
              </Button>
            ))}

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
