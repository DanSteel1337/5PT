"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi"
import { Button } from "@/components/ui/button"
import { bsc, bscTestnet } from "viem/chains"
import { isPreviewEnvironment } from "@/lib/environment"
import { Loader2 } from "lucide-react"

export function SimpleV0WalletConnect() {
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

  // In preview environment, show a simplified version
  if (isPreviewEnvironment()) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          className="bg-gold-500 hover:bg-gold-600 text-black"
          onClick={() => connect({ connector: connectors[0] })}
        >
          {isConnected ? displayAddress : "Connect Wallet"}
        </Button>
        {isConnected && (
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            Disconnect
          </Button>
        )}
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          className="border-gold-500 text-gold-500 hover:bg-gold-500/10"
          onClick={() => disconnect()}
        >
          {displayAddress} ({getChainName()})
        </Button>
      </div>
    )
  }

  return (
    <Button
      className="bg-gold-500 hover:bg-gold-600 text-black"
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}
