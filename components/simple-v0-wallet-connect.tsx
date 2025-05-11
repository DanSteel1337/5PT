"use client"

import { useState, useEffect } from "react"
import { useConnect, useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useIsPreviewEnvironment } from "@/lib/environment"
import { InfoIcon } from "lucide-react"

export function SimpleV0WalletConnect() {
  const [mounted, setMounted] = useState(false)
  const { connect, connectors, isLoading, error } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const isPreview = useIsPreviewEnvironment()

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
        {isPreview && (
          <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Preview Environment Detected</AlertTitle>
            <AlertDescription>
              WalletConnect is disabled in preview mode. Only MetaMask will work here. Full wallet connection features
              will be available on the production site.
            </AlertDescription>
          </Alert>
        )}

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
