"use client"

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi"
import { Button } from "@/components/ui/button"
import { bsc, bscTestnet } from "viem/chains"
import { Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

// Safe environment detection
const isBrowser = typeof window !== "undefined"
const isPreview =
  isBrowser &&
  (window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

export function Web3ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const [displayAddress, setDisplayAddress] = useState<string>("")
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  // Format address for display
  useEffect(() => {
    if (address) {
      setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [address])

  // Get chain name
  const getChainName = () => {
    if (chainId === bsc.id) return "BSC"
    if (chainId === bscTestnet.id) return "BSC Testnet"
    return "Unknown"
  }

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // In preview mode, show a mock button
  if (isPreview) {
    return (
      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Wallet className="mr-2 h-4 w-4" />
        Preview Mode
      </Button>
    )
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-purple-500/30 hover:bg-purple-900/20">
            <Avatar className="h-6 w-6 border border-purple-500/30">
              <AvatarFallback className="bg-purple-900/50 text-purple-300 text-xs">
                {address?.substring(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-purple-300">{displayAddress}</span>
            <Badge variant="outline" className="bg-purple-900/30 border-purple-500/30 text-purple-300">
              {getChainName()}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-purple-500/30 bg-black/80 backdrop-blur-md">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          <DropdownMenuItem className="flex justify-between">
            <span>Address</span>
            <span className="font-mono text-xs text-purple-300 truncate max-w-[150px]">{address}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between">
            <span>Network</span>
            <Badge variant="outline" className="border-purple-500/30 bg-purple-900/20 text-purple-300">
              {getChainName()}
            </Badge>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-400">
            <Wallet className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
