"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { TOKENOMICS } from "@/lib/contracts"
import { formatNumber } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMounted } from "@/hooks/useMounted"

export function TokenomicsVisual() {
  const mounted = useMounted()
  const [activeTab, setActiveTab] = useState<"distribution" | "metrics">("distribution")

  if (!mounted) return null

  const { totalSupply, distribution } = TOKENOMICS

  // Calculate total allocation percentage
  const totalAllocation = distribution.reduce((acc, item) => acc + item.percentage, 0)

  return (
    <Card className="glass-card-purple p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gradient">5PT Tokenomics</h3>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "distribution" | "metrics")}>
          <TabsList className="bg-black/30">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="distribution" className="mt-0">
        <div className="mb-6">
          <div className="relative h-8 bg-black/30 rounded-full overflow-hidden mb-2">
            {distribution.map((item, index) => {
              // Calculate the width and position of each segment
              const width = (item.percentage / totalAllocation) * 100
              const left = distribution
                .slice(0, index)
                .reduce((acc, prev) => acc + (prev.percentage / totalAllocation) * 100, 0)

              return (
                <motion.div
                  key={index}
                  className="absolute h-full"
                  style={{
                    width: `${width}%`,
                    left: `${left}%`,
                    backgroundColor: getColorForIndex(index),
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {distribution.map((item, index) => (
            <div key={index} className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForIndex(index) }} />
                <p className="text-sm font-medium">{item.name}</p>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatNumber(item.allocation)} 5PT</span>
                <span>{item.percentage}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.purpose}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="metrics" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Total Supply</p>
            <p className="text-3xl font-bold text-gradient">{formatNumber(totalSupply)} 5PT</p>
            <p className="text-xs text-gray-500 mt-1">Maximum supply cap</p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Initial Market Cap</p>
            <p className="text-3xl font-bold text-gradient">${formatNumber(175000000)}</p>
            <p className="text-xs text-gray-500 mt-1">Based on initial token price</p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Initial Token Price</p>
            <p className="text-3xl font-bold text-gradient">$0.00175</p>
            <p className="text-xs text-gray-500 mt-1">Launch price on DEX</p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Liquidity Lock</p>
            <p className="text-3xl font-bold text-gradient">3 Years</p>
            <p className="text-xs text-gray-500 mt-1">DEX liquidity lock period</p>
          </div>
        </div>

        <div className="mt-6 bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Token Utility</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Investment Platform</p>
                <p className="text-xs text-gray-500">Stake 5PT to earn daily rewards</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Governance</p>
                <p className="text-xs text-gray-500">Vote on protocol decisions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Fee Discounts</p>
                <p className="text-xs text-gray-500">Hold 5PT to reduce platform fees</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Ecosystem Access</p>
                <p className="text-xs text-gray-500">Unlock premium features</p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Card>
  )
}

// Helper function to get a color based on index
function getColorForIndex(index: number): string {
  const colors = [
    "#8b5cf6", // purple-500
    "#6366f1", // indigo-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#ec4899", // pink-500
    "#8b5cf6", // purple-500 (repeat if needed)
    "#6366f1", // indigo-500 (repeat if needed)
  ]

  return colors[index % colors.length]
}
