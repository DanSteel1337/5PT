"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, PieChart, Sparkles } from "lucide-react"

// Mock data for rewards breakdown
const rewardsData = {
  daily: 0.0125,
  referral: 0.0078,
  pool: 0.0345,
}

export function RewardsBreakdown() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // Calculate total rewards
  const totalRewards = Object.values(rewardsData).reduce((sum, value) => sum + value, 0)

  // Calculate percentages for the pie chart
  const dailyPercentage = (rewardsData.daily / totalRewards) * 100
  const referralPercentage = (rewardsData.referral / totalRewards) * 100
  const poolPercentage = (rewardsData.pool / totalRewards) * 100

  return (
    <Card className="glass-card overflow-hidden border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl">Rewards Breakdown</CardTitle>
        </div>
        <CardDescription>Your rewards by source</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative w-40 h-40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Pie chart segments with glowing effect */}
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <defs>
                    <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#67e8f9" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradientPurple)"
                    strokeWidth="20"
                    strokeDasharray={`${dailyPercentage} ${100 - dailyPercentage}`}
                    strokeDashoffset="25"
                    filter="url(#glow)"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${dailyPercentage} ${100 - dailyPercentage}` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradientBlue)"
                    strokeWidth="20"
                    strokeDasharray={`${referralPercentage} ${100 - referralPercentage}`}
                    strokeDashoffset={25 - dailyPercentage}
                    filter="url(#glow)"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${referralPercentage} ${100 - referralPercentage}` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradientCyan)"
                    strokeWidth="20"
                    strokeDasharray={`${poolPercentage} ${100 - poolPercentage}`}
                    strokeDashoffset={25 - dailyPercentage - referralPercentage}
                    filter="url(#glow)"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${poolPercentage} ${100 - poolPercentage}` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <motion.span
                    className="text-xl font-bold neon-text"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {totalRewards.toFixed(4)}
                  </motion.span>
                  <span className="text-xs text-muted-foreground">5PT</span>
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-purple-900/20 to-purple-900/10 border border-purple-500/20"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(139, 92, 246, 0.3)",
                  borderColor: "rgba(139, 92, 246, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-400"></div>
                    <span className="text-sm font-medium">Daily Rewards</span>
                  </div>
                  <span className="font-medium neon-text">{rewardsData.daily.toFixed(4)} 5PT</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">0.35% daily ROI</div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-blue-900/20 to-blue-900/10 border border-blue-500/20"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"></div>
                    <span className="text-sm font-medium">Referral Rewards</span>
                  </div>
                  <span className="font-medium neon-text-blue">{rewardsData.referral.toFixed(4)} 5PT</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">From 3 active referrals</div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-cyan-900/20 to-cyan-900/10 border border-cyan-500/20"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(34, 211, 238, 0.3)",
                  borderColor: "rgba(34, 211, 238, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
                    <span className="text-sm font-medium">Pool Rewards</span>
                  </div>
                  <span className="font-medium neon-text-cyan">{rewardsData.pool.toFixed(4)} 5PT</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">From Pool #2 participation</div>
              </motion.div>
            </div>

            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 border-none">
              <Sparkles className="mr-2 h-4 w-4" /> View Detailed Breakdown
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
