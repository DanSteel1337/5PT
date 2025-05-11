"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useBalance, useDisconnect } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, ExternalLink, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { CONTRACT_ADDRESSES } from "@/lib/wagmi-config"
import { useReadContract } from "wagmi"
import { TOKEN_ABI } from "@/lib/contracts"
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

export function EnhancedWalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Get native balance
  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: isConnected && !!address && mounted,
    },
  })

  // Get token balance
  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address && mounted,
    },
  })

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Format token balance
  const formattedTokenBalance =
    tokenBalance && decimals
      ? Number(formatUnits(tokenBalance, decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "0"

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} className="crypto-button-secondary" size="sm">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Wrong Network
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/50 border border-secondary/20 backdrop-blur-sm">
                      <img src="/images/5pt-logo.png" alt="5PT" className="h-5 w-5" />
                      <span className="font-medium text-secondary">{formattedTokenBalance}</span>
                      <Badge variant="outline" className="bg-muted/50 text-xs border-secondary/20">
                        5PT
                      </Badge>
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-secondary/30 hover:bg-secondary/10"
                        size="sm"
                      >
                        <Avatar className="h-6 w-6 border border-secondary/30">
                          <AvatarFallback className="bg-secondary/20 text-secondary text-xs">
                            {account?.displayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block text-secondary">{account?.displayName}</span>
                        <Badge variant="outline" className="hidden md:flex bg-muted/50 text-xs border-secondary/20">
                          {chain.name}
                        </Badge>
                        <ChevronDown className="h-4 w-4 text-secondary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-secondary/30 bg-card/80 backdrop-blur-md">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-secondary/20" />
                      <DropdownMenuItem className="flex justify-between">
                        <span>Address</span>
                        <span className="font-mono text-xs text-secondary truncate max-w-[150px]">
                          {account?.address}
                        </span>
                      </DropdownMenuItem>
                      {nativeBalance && (
                        <DropdownMenuItem className="flex justify-between">
                          <span>BNB Balance</span>
                          <span className="font-medium text-secondary">
                            {Number.parseFloat(nativeBalance.formatted).toFixed(4)} {nativeBalance.symbol}
                          </span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex justify-between">
                        <span>5PT Balance</span>
                        <span className="font-medium text-secondary">{formattedTokenBalance}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={openChainModal} className="flex justify-between">
                        <span>Network</span>
                        <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
                          {chain.name}
                        </Badge>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-secondary/20" />
                      <DropdownMenuItem
                        onClick={() => {
                          disconnect()
                          openConnectModal()
                        }}
                        className="text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Disconnect</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
