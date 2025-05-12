"use client"

import { useState, useEffect } from "react"
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { useAccount, useSwitchChain } from "wagmi"
import { Loader2, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { bsc, bscTestnet } from "wagmi/chains"

export function ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isError, setIsError] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)

    // Reset error state when component mounts
    setIsError(false)
  }, [])

  // Handle network switch with error handling
  const handleNetworkSwitch = (chainId: number) => {
    try {
      switchChain({ chainId })
    } catch (error) {
      console.error("Failed to switch network:", error)
      setIsError(true)
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="default" disabled className="opacity-70">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isError) {
    return (
      <Button variant="destructive" size="default" onClick={() => setIsError(false)} className="opacity-90">
        Wallet Error
      </Button>
    )
  }

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted: rainbowMounted }) => {
        const ready = mounted && rainbowMounted
        const connected = ready && account && chain

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
                  <Button
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2 border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl || "/placeholder.svg"}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem onClick={() => handleNetworkSwitch(bsc.id)}>BSC Mainnet</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNetworkSwitch(bscTestnet.id)}>
                        BSC Testnet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={openAccountModal}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                  >
                    {account.displayName}
                    {account.displayBalance && (
                      <span className="hidden md:inline-block ml-2 opacity-80">{account.displayBalance}</span>
                    )}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
