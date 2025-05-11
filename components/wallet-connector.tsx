"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, LogOut, ExternalLink, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface WalletConnectorProps {
  variant?: "default" | "minimal"
  className?: string
}

export function WalletConnector({ variant = "default", className }: WalletConnectorProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // View on explorer
  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://bscscan.com/address/${address}`, "_blank")
    }
  }

  if (!isConnected) {
    if (variant === "minimal") {
      return (
        <Button
          size="sm"
          className={cn(
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            className,
          )}
          onClick={() => connect({ connector: connectors[0] })}
          disabled={isPending}
        >
          {isPending ? "Connecting..." : "Connect"}
        </Button>
      )
    }

    return (
      <Button
        className={cn(
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
          className,
        )}
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={cn("border-purple-500/30 text-purple-300 hover:bg-purple-900/20", className)}
          >
            {formatAddress(address || "")}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-md border-purple-500/30">
          <DropdownMenuLabel className="text-purple-300">Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-purple-500/20" />
          <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-400">
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
          variant="outline"
          className={cn("border-purple-500/30 text-purple-300 hover:bg-purple-900/20", className)}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(address || "")}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-md border-purple-500/30">
        <DropdownMenuLabel className="text-purple-300">Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-500/20" />
        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
