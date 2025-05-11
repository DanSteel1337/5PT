"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, LogOut, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shouldUseMockData } from "@/lib/environment"
import { mockUserData } from "@/lib/mock-data"

interface WalletConnectorProps {
  variant?: "default" | "minimal"
}

export function WalletConnector({ variant = "default" }: WalletConnectorProps) {
  const [mounted, setMounted] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // In preview mode, we'll use mock data
  const mockAccount = shouldUseMockData()
    ? {
        address: mockUserData.address,
        isConnected: mockUserData.isConnected,
      }
    : undefined

  // Use real or mock account data
  const { address, isConnected } = useAccount(mockAccount)
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle connection
  const handleConnect = (connector: any) => {
    try {
      connect({ connector })
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  // Check if we're in preview mode
  useEffect(() => {
    setMounted(true)
    setIsPreview(shouldUseMockData())
  }, [])

  // Don't render anything during SSR
  if (!mounted) return null

  // Minimal variant (just the connect button)
  if (variant === "minimal") {
    if (isConnected) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
          onClick={() => disconnect()}
        >
          {formatAddress(address as string)}
        </Button>
      )
    }

    return (
      <Button
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={() => handleConnect(connectors[0])}
        disabled={isPending || isPreview}
      >
        {isPreview ? (
          <>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Preview Mode
          </>
        ) : isPending ? (
          "Connecting..."
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    )
  }

  // Default variant (dropdown menu)
  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20">
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address as string)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-lg border-purple-500/30">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          <DropdownMenuItem className="text-red-400 focus:text-red-400 cursor-pointer" onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={isPreview}
        >
          {isPreview ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Preview Mode
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      {!isPreview && (
        <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-lg border-purple-500/30">
          <DropdownMenuLabel>Connect Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              className="cursor-pointer"
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready || isPending}
            >
              {connector.name}
              {isPending && " (connecting...)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
