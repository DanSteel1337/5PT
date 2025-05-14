"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent } from "@/lib/utils"
import { PlusCircle, ArrowUpRight, Info } from "lucide-react"

// Updated pool data from latest contract documentation
const POOLS = [
  {
    id: 1,
    name: "Starter Pool",
    dailyRate: 0.0175, // Updated from 0.035%
    minDeposit: 550, // ~$1,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 1250000,
  },
  {
    id: 2,
    name: "Growth Pool",
    dailyRate: 0.0175, // Updated from 0.035%
    minDeposit: 1450, // ~$2,500
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 2500000,
  },
  {
    id: 3,
    name: "Premium Pool",
    dailyRate: 0.0175, // Updated from 0.035%
    minDeposit: 3000, // ~$5,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 800000,
  },
  {
    id: 4,
    name: "Elite Pool",
    dailyRate: 0.0175, // Updated from 0.035%
    minDeposit: 5500, // ~$10,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 1500000,
  },
  {
    id: 5,
    name: "Platinum Pool",
    dailyRate: 0.0175, // Updated from 0.035%
    minDeposit: 14250, // ~$25,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 3000000,
  },
  {
    id: 6,
    name: "Diamond Pool",
    dailyRate: 0.01, // Updated from 0.02%
    minDeposit: 28500, // ~$50,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 5000000,
  },
  {
    id: 7,
    name: "Royal Pool",
    dailyRate: 0.01, // Updated from 0.02%
    minDeposit: 57000, // ~$100,000
    lockPeriod: 0, // No lock period specified in contract
    totalStaked: 7000000,
  },
]

export function InvestmentPools() {
  const { tokenSymbol, userRank } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [activePool, setActivePool] = useState(1)
  const [showTaxInfo, setShowTaxInfo] = useState(false)

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
                  {pool.lockPeriod > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Lock Period</p>
                      <p className="font-medium">{pool.lockPeriod} days</p>
                    </div>
                  )}
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

                {/* Tax information button */}
                <div className="mt-4">
                  <button
                    className="flex items-center text-xs text-gray-400 hover:text-purple-400 transition-colors"
                    onClick={() => setShowTaxInfo(!showTaxInfo)}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {showTaxInfo ? "Hide" : "Show"} tax information
                  </button>

                  {showTaxInfo && (
                    <div className="mt-2 p-3 bg-black/20 rounded-lg text-xs text-gray-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 font-medium">Deposit Tax:</span>
                        <span className="bg-purple-900/50 px-2 py-1 rounded text-xs font-bold">10%</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 font-medium">Claim Tax:</span>
                        <span className="bg-purple-900/50 px-2 py-1 rounded text-xs font-bold">10%</span>
                      </div>
                      <div className="h-px bg-purple-500/20 my-2"></div>
                      <p className="mb-1">When claiming rewards:</p>
                      <div className="flex justify-between items-center">
                        <span>To wallet:</span>
                        <span>50%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Auto-reinvested:</span>
                        <span>50%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
      )}
    </Card>
  )
}
