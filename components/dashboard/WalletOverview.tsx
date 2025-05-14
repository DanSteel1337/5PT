"use client"

import { useState, useEffect } from "react"
import { useBalance, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { contracts } from "@/lib/contracts"
import { useQuery } from "@tanstack/react-query"

interface WalletOverviewProps {
  address?: `0x${string}`
}

export function WalletOverview({ address }: WalletOverviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: bnbBalance } = useBalance({
    address,
    query: {
      enabled: mounted && !!address,
      staleTime: 10000,
    },
  })

  const { data: tokenBalance } = useReadContract({
    address: contracts.token.address as `0x${string}`,
    abi: contracts.token.abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: mounted && !!address,
      staleTime: 10000,
    },
  })

  // Fetch token price from a mock API or contract
  const { data: tokenPrice } = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: async () => {
      // Simulate API call or contract read
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return 0.0025 // Mock price in BNB
    },
    enabled: mounted,
    staleTime: 30000,
  })

  if (!mounted) return null

  const formattedTokenBalance = tokenBalance
    ? Number.parseFloat(formatUnits(tokenBalance as bigint, 18)).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "0"

  const formattedBnbBalance = bnbBalance
    ? Number.parseFloat(formatUnits(bnbBalance.value, 18)).toLocaleString("en-US", { maximumFractionDigits: 4 })
    : "0"

  const tokenValue =
    tokenBalance && tokenPrice ? Number.parseFloat(formatUnits(tokenBalance as bigint, 18)) * tokenPrice : 0

  const formattedTokenValue = tokenValue.toLocaleString("en-US", { maximumFractionDigits: 4 })

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/20 p-6 backdrop-blur-sm">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

      <h3 className="mb-4 text-xl font-semibold text-white">Wallet Overview</h3>

      <div className="space-y-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-gray-400">5PT Balance</span>
            <span className="text-xs font-medium text-purple-400">
              {tokenPrice ? `≈ ${formattedTokenValue} BNB` : ""}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{formattedTokenBalance}</span>
            <div className="flex items-center gap-1 rounded-full bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-300">
              <span>5PT</span>
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{ width: "60%" }} // This would be dynamic based on some metric
            />
          </div>
        </div>

        <div>
          <div className="mb-1 text-sm text-gray-400">BNB Balance</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{formattedBnbBalance}</span>
            <div className="flex items-center gap-1 rounded-full bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
              <span>BNB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
          <div className="text-sm text-gray-300">Token Price</div>
          <div className="font-medium text-white">{tokenPrice ? `${tokenPrice} BNB` : "Loading..."}</div>
        </div>
      </div>
    </div>
  )
}
