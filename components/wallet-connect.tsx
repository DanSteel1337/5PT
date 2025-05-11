"use client"

import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi"
import { formatUnits } from "viem"
import { CONTRACT_ADDRESSES } from "@/lib/wagmi-config"
import { useReadContract } from "wagmi"
import { TOKEN_ABI } from "@/lib/contracts"
import { useState, useEffect } from "react"
import { useIsPreviewEnvironment } from "@/lib/environment"
import { PreviewSafeConnector } from "@/components/preview-safe-connector"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const isPreview = useIsPreviewEnvironment()
  const [nativeBalanceData, setNativeBalanceData] = useState<any>(null)
  const [tokenBalanceData, setTokenBalanceData] = useState<any>(null)
  const [decimalsData, setDecimalsData] = useState<any>(null)

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get native balance
  const { data: nativeBalance } = useBalance({
    address,
    query: {
      enabled: !!address && mounted,
    },
  })

  useEffect(() => {
    if (nativeBalance) {
      setNativeBalanceData(nativeBalance)
    }
  }, [nativeBalance])

  // In preview environment, use the preview-safe connector
  if (!mounted || isPreview) {
    return <PreviewSafeConnector />
  }

  // Get token balance
  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted,
    },
  })

  useEffect(() => {
    if (tokenBalance) {
      setTokenBalanceData(tokenBalance)
    }
  }, [tokenBalance])

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: mounted,
    },
  })

  useEffect(() => {
    if (decimals) {
      setDecimalsData(decimals)
    }
  }, [decimals])

  // Format token balance
  const formattedTokenBalance =
    tokenBalanceData && decimalsData
      ? Number(formatUnits(tokenBalanceData, decimalsData)).toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "0"

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {isConnected && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-900/20 border border-purple-500/20">
            <span className="font-medium text-purple-300">{formattedTokenBalance} 5PT</span>
          </div>
        )}
        <Button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-md bg-purple-600/80 text-white hover:bg-purple-600 transition-colors"
        >
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect"}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => {
        const connector = connectors.find((c) => c.id === "injected")
        if (connector) connect({ connector })
      }}
      disabled={isPending}
      className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
