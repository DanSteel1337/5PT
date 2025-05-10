"use client"

import { TrendingUp, TrendingDown, Users, BarChart3, DollarSign, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { formatNumber } from "@/lib/utils"

// Mock data - in a real implementation, this would come from an API
const tokenData = {
  price: 0.0875,
  priceChange: 12.4,
  marketCap: 8750000,
  volume24h: 1250000,
  holders: 12450,
  holdersChange: 3.2,
  totalSupply: 100000000,
  circulatingSupply: 45000000,
}

export function OptimizedTokenMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Token Price */}
      <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Token Price</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <DollarSign size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-amber-300">
              <AnimatedCounter from={0} to={tokenData.price} formatValue={(value) => `$${value.toFixed(4)}`} />
            </div>
            <div className={`flex items-center ${tokenData.priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {tokenData.priceChange >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-sm font-medium">
                {tokenData.priceChange >= 0 ? "+" : ""}
                {tokenData.priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="mt-2 h-1 bg-amber-900/50 rounded-full overflow-hidden">
            <div
              className={`h-full ${tokenData.priceChange >= 0 ? "bg-green-400" : "bg-red-400"}`}
              style={{ width: `${Math.min(100, Math.abs(tokenData.priceChange) * 2)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Market Cap */}
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 border-purple-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-100">Market Cap</h3>
            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
              <BarChart3 size={16} className="text-purple-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-300">
            <AnimatedCounter from={0} to={tokenData.marketCap} formatValue={(value) => `$${formatNumber(value)}`} />
          </div>
          <div className="mt-2 text-xs text-purple-200 flex justify-between">
            <span>Circulating Supply:</span>
            <span className="text-purple-100">{formatNumber(tokenData.circulatingSupply)} 5PT</span>
          </div>
        </div>
      </Card>

      {/* 24h Volume */}
      <Card className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 border-blue-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-100">24h Volume</h3>
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
              <Activity size={16} className="text-blue-300" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-300">
            <AnimatedCounter from={0} to={tokenData.volume24h} formatValue={(value) => `$${formatNumber(value)}`} />
          </div>
          <div className="mt-2 text-xs text-blue-200 flex justify-between">
            <span>% of Market Cap:</span>
            <span className="text-blue-100">{((tokenData.volume24h / tokenData.marketCap) * 100).toFixed(2)}%</span>
          </div>
        </div>
      </Card>

      {/* Total Holders */}
      <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/20 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-amber-100">Total Holders</h3>
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <Users size={16} className="text-amber-300" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-amber-300">
              <AnimatedCounter from={0} to={tokenData.holders} formatValue={(value) => formatNumber(value)} />
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm font-medium">+{tokenData.holdersChange}%</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-200 flex justify-between">
            <span>New holders (24h):</span>
            <span className="text-amber-100">+{Math.floor((tokenData.holders * tokenData.holdersChange) / 100)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
