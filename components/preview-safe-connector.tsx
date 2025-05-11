"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, AlertCircle } from "lucide-react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isPreviewEnvironment } from "@/lib/environment"

export function PreviewSafeConnector() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showWalletConnectError, setShowWalletConnectError] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // Move environment detection to useEffect
  useEffect(() => {
    setIsPreview(isPreviewEnvironment())
  }, [])

  // Format address for display
  const formattedAddress = useMemo(() => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  // Filter out WalletConnect in preview environments to avoid allowlist errors
  const filteredConnectors = useMemo(() => {
    if (!isPreview) return connectors

    return connectors.filter(
      (connector) =>
        // Keep connectors that aren't WalletConnect or are injected (like MetaMask)
        connector.id !== "walletConnect" || connector.type === "injected",
    )
  }, [connectors, isPreview])

  // Handle connection with error handling
  const handleConnect = useCallback(
    async (connector: any) => {
      try {
        await connect({ connector })
      } catch (error: any) {
        console.error("Connection error:", error)
        // Check if it's a WalletConnect allowlist error
        if (error.message && error.message.includes("not found on Allowlist")) {
          setShowWalletConnectError(true)
        }
      }
    },
    [connect],
  )

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-purple-500/30 hover:bg-purple-900/20">
            <Wallet className="h-4 w-4 text-purple-300" />
            <span className="text-purple-300">{formattedAddress}</span>
            {chain && (
              <span className="hidden md:inline-block text-xs bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/20">
                {chain.name}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-purple-500/30 bg-card/80 backdrop-blur-md">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem className="font-mono text-xs">{address}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isPending} className="bg-purple-600/80 text-white hover:bg-purple-600 transition-colors">
            {isPending ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-purple-500/30 bg-card/80 backdrop-blur-md">
          <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredConnectors.map((connector) => (
            <DropdownMenuItem key={connector.id} onClick={() => handleConnect(connector)} disabled={!connector.ready}>
              {connector.name}
            </DropdownMenuItem>
          ))}
          {isPreview && (
            <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
              <AlertCircle className="mr-2 h-3 w-3" />
              WalletConnect unavailable in preview
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showWalletConnectError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            WalletConnect is not available in this preview environment. Please use MetaMask or another injected wallet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
