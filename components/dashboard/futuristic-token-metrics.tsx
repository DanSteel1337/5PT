"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, BarChart3, DollarSign, Activity } from "lucide-react"
import { NeoMorphicCard } from "@/components/ui/neo-morphic-card"
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

export function FuturisticTokenMetrics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <motion.div variants={itemVariants}>
        <NeoMorphicCard className="p-4" variant="gold" pulseEffect>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Token Price</h3>
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <DollarSign size={16} className="text-gold" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold gold-gradient-text">
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
          <div className="mt-2 h-1 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${tokenData.priceChange >= 0 ? "bg-green-400" : "bg-red-400"}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.abs(tokenData.priceChange) * 2)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </NeoMorphicCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeoMorphicCard className="p-4" variant="cosmic">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Market Cap</h3>
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <BarChart3 size={16} className="text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            <AnimatedCounter from={0} to={tokenData.marketCap} formatValue={(value) => `$${formatNumber(value)}`} />
          </div>
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>Circulating Supply:</span>
            <span className="text-gray-300">{formatNumber(tokenData.circulatingSupply)} 5PT</span>
          </div>
        </NeoMorphicCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeoMorphicCard className="p-4" variant="crystal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">24h Volume</h3>
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <Activity size={16} className="text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            <AnimatedCounter from={0} to={tokenData.volume24h} formatValue={(value) => `$${formatNumber(value)}`} />
          </div>
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>% of Market Cap:</span>
            <span className="text-gray-300">{((tokenData.volume24h / tokenData.marketCap) * 100).toFixed(2)}%</span>
          </div>
        </NeoMorphicCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeoMorphicCard className="p-4" variant="gold">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Total Holders</h3>
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <Users size={16} className="text-gold" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold gold-gradient-text">
              <AnimatedCounter from={0} to={tokenData.holders} formatValue={(value) => formatNumber(value)} />
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm font-medium">+{tokenData.holdersChange}%</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>New holders (24h):</span>
            <span className="text-gray-300">+{Math.floor((tokenData.holders * tokenData.holdersChange) / 100)}</span>
          </div>
        </NeoMorphicCard>
      </motion.div>
    </motion.div>
  )
}
