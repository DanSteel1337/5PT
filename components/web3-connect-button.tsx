"use client"

import { useWeb3Modal } from "@web3modal/react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, LogOut, Wallet } from "lucide-react"

export function Web3ConnectButton() {
  const { open } = useWeb3Modal()
  const { address, isConnecting, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after the component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) return null

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-opacity-20 border-purple-500/30 text-white">
          {formatAddress(address)}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          className="text-white hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => open()}
      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
