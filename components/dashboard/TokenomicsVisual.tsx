"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TOKENOMICS } from "@/lib/contracts"
import { formatNumber } from "@/lib/utils"
import { motion } from "framer-motion"

export function TokenomicsVisual() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Convert tokenomics data for visualization
  const tokenomicsData = [
    { name: "Airdrop Campaign", value: TOKENOMICS.airdropCampaign.percentage, color: "from-purple-500 to-blue-500" },
    { name: "Presale & Referral", value: TOKENOMICS.presaleAndReferral.percentage, color: "from-blue-500 to-cyan-400" },
    { name: "DEX Liquidity", value: TOKENOMICS.dexLiquidity.percentage, color: "from-cyan-400 to-teal-500" },
    { name: "Treasury", value: TOKENOMICS.treasury.percentage, color: "from-teal-500 to-green-500" },
    { name: "CEX & Marketing", value: TOKENOMICS.cexAndMarketing.percentage, color: "from-green-500 to-yellow-500" },
    { name: "Reserve", value: TOKENOMICS.reserve.percentage, color: "from-yellow-500 to-purple-500" },
  ]

  return (
    <Card className="glass-card-purple p-6">
      <h3 className="text-xl font-bold mb-4 text-gradient">Tokenomics Visualization</h3>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">Total Supply</span>
          <span className="font-bold text-gradient">{formatNumber(TOKENOMICS.totalSupply / 10 ** 18)} 5PT</span>
        </div>

        <div className="h-6 bg-black/30 rounded-full overflow-hidden flex">
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full bg-gradient-to-r ${item.color}`}
              style={{ width: `${item.value}%` }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tokenomicsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-black/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
              <p className="text-sm text-gray-300">{item.name}</p>
            </div>
            <p className="text-lg font-bold text-right">{item.value}%</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          The 5PT token implements a deflationary mechanism with a 10% tax on transactions. 5% is burned forever,
          reducing total supply over time.
        </p>
        <div className="mt-2 flex justify-center">
          <div className="px-3 py-1 bg-purple-900/30 rounded-full text-xs">
            <span className="text-purple-400">Deflationary</span> • <span className="text-green-400">Auto-Burn</span> •{" "}
            <span className="text-blue-400">Limited Supply</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
