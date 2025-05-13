"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent } from "@/lib/utils"
import { PlusCircle, ArrowUpRight } from "lucide-react"

// Sample pool data
const POOLS = [
  {
    id: 1,
    name: "Starter Pool",
    dailyRate: 5,
    minDeposit: 100,
    lockPeriod: 7,
    totalStaked: 1250000,
  },
  {
    id: 2,
    name: "Growth Pool",
    dailyRate: 8,
    minDeposit: 500,
    lockPeriod: 14,
    totalStaked: 2500000,
  },
  {
    id: 3,
    name: "Premium Pool",
    dailyRate: 15,
    minDeposit: 1000,
    lockPeriod: 30,
    totalStaked: 800000,
  },
]

export function InvestmentPools() {
  const { tokenSymbol, userRank } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [activePool, setActivePool] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Card className="glass-card-purple p-6">
      <h3 className="text-xl font-bold mb-6 text-gradient">Investment Pools</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {POOLS.map((pool) => (
          <button
            key={pool.id}
            className={`p-3 rounded-lg text-center transition-all ${
              activePool === pool.id
                ? "bg-purple-900/50 border border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-black/30 hover:bg-black/50"
            }`}
            onClick={() => setActivePool(pool.id)}
          >
            <p className="font-medium">{pool.name}</p>
            <p className={`text-sm ${activePool === pool.id ? "text-purple-400" : "text-gray-400"}`}>
              {formatPercent(pool.dailyRate)} Daily
            </p>
          </button>
        ))}
      </div>

      {POOLS.map(
        (pool) =>
          pool.id === activePool && (
            <div key={pool.id} className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-400 text-sm">Pool Details</p>
                  <p className="text-sm font-medium text-purple-400">
                    Rank {userRank >= 3 ? "Eligible" : "Required: 3+"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Daily Yield</p>
                    <p className="font-medium">{formatPercent(pool.dailyRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Lock Period</p>
                    <p className="font-medium">{pool.lockPeriod} days</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Min. Deposit</p>
                    <p className="font-medium">{formatCrypto(pool.minDeposit, tokenSymbol)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total Staked</p>
                    <p className="font-medium">{formatCrypto(pool.totalStaked, tokenSymbol)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-3">Your Position</p>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Staked Amount</p>
                    <p className="font-medium">{formatCrypto(pool.id * 200, tokenSymbol)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Earned Rewards</p>
                    <p className="font-medium text-green-400">
                      +{formatCrypto(((pool.id * 200 * pool.dailyRate) / 100) * 5, tokenSymbol)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-500/50 text-purple-100 hover:bg-purple-900/20"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
          ),
      )}
    </Card>
  )
}
