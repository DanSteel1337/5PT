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
import { useMemo, useState, useCallback } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WalletConnectSimple() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showWalletConnectError, setShowWalletConnectError] = useState(false)

  // Format address for display using useMemo to avoid recalculations
  const formattedAddress = useMemo(() => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  // Filter out WalletConnect in v0 environment to avoid allowlist errors
  const filteredConnectors = useMemo(() => {
    return connectors.filter(
      (connector) =>
        // Keep connectors that aren't WalletConnect or are injected (like MetaMask)
        connector.id !== "walletConnect" || connector.type === "injected",
    )
  }, [connectors])

  // Handle connection with error handling - use useCallback to prevent recreation on each render
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
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{formattedAddress}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
          <Button disabled={isPending}>{isPending ? "Connecting..." : "Connect Wallet"}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredConnectors.map((connector) => (
            <DropdownMenuItem key={connector.id} onClick={() => handleConnect(connector)} disabled={!connector.ready}>
              {connector.name}
            </DropdownMenuItem>
          ))}
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
