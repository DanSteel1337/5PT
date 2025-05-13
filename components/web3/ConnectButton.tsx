// components/web3/ConnectButton.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi"
import { Loader2, ChevronDown, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { bsc, bscTestnet } from "wagmi/chains"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { UserRejectedRequestError } from "viem"

export function ConnectButton() {
  const [mounted, setMounted] = useState(false)
  const mountedRef = useRef(false)
  const { isConnected } = useAccount()
  const { switchChain, isPending: isSwitchPending, error: switchError, data: switchData } = useSwitchChain()
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Track transaction when switching chains
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: switchData?.transactionHash,
  })

  // Only render after client-side hydration
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    // Longer delay to ensure WalletProvider is fully initialized
    const timer = setTimeout(() => {
      setMounted(true)
    }, 800) // Increased delay to ensure proper initialization

    // Reset error state when component mounts
    setIsError(false)
    setErrorMessage(null)

    return () => clearTimeout(timer)
  }, [])

  // Update error state when switch error changes
  useEffect(() => {
    if (switchError) {
      setIsError(true)
      if (switchError instanceof UserRejectedRequestError) {
        setErrorMessage("User rejected request")
      } else {
        setErrorMessage(switchError.message || "Failed to switch network")
      }
    }
  }, [switchError])

  // Handle network switch with error handling
  const handleNetworkSwitch = async (chainId: number) => {
    try {
      setIsError(false)
      setErrorMessage(null)
      await switchChain({ chainId })
    } catch (error) {
      console.error("Failed to switch network:", error)
      setIsError(true)
      setErrorMessage(error instanceof Error ? error.message : "Failed to switch network")
    }
  }

  if (!mounted) {
    return <div className="h-10 w-[140px] bg-muted/30 rounded-md animate-pulse"></div>
  }

  if (isError) {
    return (
      <Button
        variant="destructive"
        size="default"
        onClick={() => setIsError(false)}
        className="relative overflow-hidden group"
        title={errorMessage || "Wallet Error"}
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>Wallet Error</span>
        <motion.div
          className="absolute inset-0 bg-destructive/20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
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
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={openConnectModal}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium relative overflow-hidden"
                    >
                      <span className="relative z-10">Connect Wallet</span>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    </Button>
                  </motion.div>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "hidden md:flex items-center gap-2 border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400",
                          (isSwitchPending || isConfirming) && "opacity-70 cursor-not-allowed",
                        )}
                        disabled={isSwitchPending || isConfirming}
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl || "/placeholder.svg"}
                                style={{ width: 16, height: 16 }}
                                onError={(e) => {
                                  // Fallback for missing icons
                                  e.currentTarget.src = "/images/5pt-logo.png"
                                }}
                              />
                            )}
                          </div>
                        )}
                        {isSwitchPending || isConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : chain.name}
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

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={openAccountModal}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        {account.displayName}
                        {account.displayBalance && (
                          <span className="hidden md:inline-block ml-2 opacity-80">{account.displayBalance}</span>
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    </Button>
                  </motion.div>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
