"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

// Mock data for token metrics
const tokenData = {
  price: 1.25,
  priceChange: 5.2,
  marketCap: 12500000,
  holders: 3750,
  volume24h: 450000,
}

export function DashboardHero() {
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isPriceUp = tokenData.priceChange > 0

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 z-0">
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20"></div>
      </div>

      {/* Animated glow effect */}
      <motion.div
        className="absolute -inset-[100px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo and token info */}
          <div className="flex items-center gap-4">
            <motion.div
              className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <span className="font-bold text-2xl text-white">5P</span>
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 blur-sm z-0"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0.7, 1, 0.7] : 0.7,
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Five Pillars Token
                <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600">5PT</Badge>
              </h2>
              <p className="text-muted-foreground">The future of decentralized investments</p>
            </div>
          </div>

          {/* Price and change */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${tokenData.price.toFixed(2)}</span>
              <Badge
                className={cn(
                  "flex items-center gap-1",
                  isPriceUp ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500",
                )}
              >
                {isPriceUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPriceUp ? "+" : ""}
                {tokenData.priceChange.toFixed(2)}%
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Token metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <motion.div
            className="glass p-4 rounded-lg border border-purple-500/20"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Market Cap</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(tokenData.marketCap)}</span>
          </motion.div>

          <motion.div
            className="glass p-4 rounded-lg border border-blue-500/20"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-muted-foreground">Holders</span>
            </div>
            <span className="text-xl font-bold">{tokenData.holders.toLocaleString()}</span>
          </motion.div>

          <motion.div
            className="glass p-4 rounded-lg border border-cyan-500/20"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(34, 211, 238, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-muted-foreground">24h Volume</span>
            </div>
            <span className="text-xl font-bold">{formatCurrency(tokenData.volume24h)}</span>
          </motion.div>

          <motion.div
            className="glass p-4 rounded-lg border border-purple-500/20"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Staking APY</span>
            </div>
            <span className="text-xl font-bold">12.5%</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
