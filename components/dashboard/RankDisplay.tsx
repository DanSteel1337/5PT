"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { contracts } from "@/lib/contracts"

interface RankDisplayProps {
  address?: `0x${string}`
}

export function RankDisplay({ address }: RankDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) return null

  // Calculate rank based on token balance
  const balance = tokenBalance ? Number.parseFloat(formatUnits(tokenBalance as bigint, 18)) : 0

  let rank = "Novice"
  let color = "from-gray-500 to-gray-400"
  let progress = 10
  let nextRank = "Bronze"
  let requiredForNext = 100000

  if (balance >= 100000) {
    rank = "Bronze"
    color = "from-amber-700 to-amber-500"
    progress = 25
    nextRank = "Silver"
    requiredForNext = 250000
  }

  if (balance >= 250000) {
    rank = "Silver"
    color = "from-gray-400 to-gray-300"
    progress = 40
    nextRank = "Gold"
    requiredForNext = 500000
  }

  if (balance >= 500000) {
    rank = "Gold"
    color = "from-yellow-500 to-yellow-300"
    progress = 60
    nextRank = "Platinum"
    requiredForNext = 1000000
  }

  if (balance >= 1000000) {
    rank = "Platinum"
    color = "from-blue-400 to-cyan-300"
    progress = 80
    nextRank = "Diamond"
    requiredForNext = 2500000
  }

  if (balance >= 2500000) {
    rank = "Diamond"
    color = "from-purple-500 to-pink-400"
    progress = 100
    nextRank = "Ultimate"
    requiredForNext = 5000000
  }

  if (balance >= 5000000) {
    rank = "Ultimate"
    color = "from-red-600 to-orange-400"
    progress = 100
    nextRank = "Ultimate"
    requiredForNext = 5000000
  }

  const remaining = Math.max(0, requiredForNext - balance)
  const formattedRemaining = remaining.toLocaleString("en-US", { maximumFractionDigits: 0 })

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/40 to-purple-900/20 p-6 backdrop-blur-sm">
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />
      <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />

      <h3 className="mb-4 text-xl font-semibold text-white">Investor Rank</h3>

      <div className="flex flex-col items-center">
        <div
          className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${color} p-1 shadow-lg`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            {rank.charAt(0)}
          </div>
        </div>

        <div className="mb-2 text-center text-2xl font-bold text-white">{rank}</div>

        <div className="mb-4 w-full">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-400">Progress to {nextRank}</span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {rank !== "Ultimate" && (
          <div className="text-center text-sm text-gray-300">
            <span>
              {formattedRemaining} 5PT needed for {nextRank}
            </span>
          </div>
        )}

        <div className="mt-4 rounded-lg bg-gray-800/50 p-3 text-center">
          <div className="text-sm text-gray-300">Rank Benefits</div>
          <div className="mt-1 text-xs text-white">
            {rank === "Novice" && "Basic platform access"}
            {rank === "Bronze" && "Pool 1 qualification + 5% bonus"}
            {rank === "Silver" && "Pool 2 qualification + 10% bonus"}
            {rank === "Gold" && "Pool 3 qualification + 15% bonus"}
            {rank === "Platinum" && "All pools + 20% bonus + early access"}
            {rank === "Diamond" && "All benefits + 25% bonus + VIP status"}
            {rank === "Ultimate" && "Maximum rewards + exclusive opportunities"}
          </div>
        </div>
      </div>
    </div>
  )
}
