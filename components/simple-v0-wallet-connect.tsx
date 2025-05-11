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
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Connect Wallet</CardTitle>
        <CardDescription className="text-muted-foreground">
          Connect your wallet to access the 5PT dashboard
        </CardDescription>
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
            {connectors.map((connector) => {
              // In preview mode, don't disable buttons based on ready state
              const isDisabled = isPreview ? isLoading : !connector.ready || isLoading

              return (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={isDisabled}
                  className="w-full bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary transition-all duration-300"
                >
                  {connector.name}
                  {isLoading && connector.id === "injected" && " (connecting...)"}
                </Button>
              )
            })}

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
