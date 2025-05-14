"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { CyberButton } from "@/components/ui/cyber-button"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Zap, Clock, TrendingUp, ArrowUpRight } from "lucide-react"

export function RewardsTracker() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const lastUpdateRef = useRef(Date.now())
  const animationFrameRef = useRef<number>()

  // Get accumulated rewards
  const { data: accumulatedRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    enabled: !!address,
  })

  // Get last round rewards
  const { data: lastRoundRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getLastRoundRewards",
    enabled: !!address,
  })

  // Get user total deposits
  const { data: userTotalDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Format values for display
  const formattedAccumulatedRewards = accumulatedRewards ? Number.parseFloat(formatUnits(accumulatedRewards, 18)) : 0
  const formattedLastRoundRewards = lastRoundRewards ? Number.parseFloat(formatUnits(lastRoundRewards, 18)) : 0
  const formattedDeposits = userTotalDeposits ? Number.parseFloat(formatUnits(userTotalDeposits, 18)) : 0

  // Calculate daily rewards (0.3% of deposits)
  const dailyRewards = formattedDeposits * 0.003

  // Calculate rewards per second
  const rewardsPerSecond = dailyRewards / 86400

  // Animate rewards in real-time
  useEffect(() => {
    const updateRewards = () => {
      const now = Date.now()
      const deltaTime = (now - lastUpdateRef.current) / 1000
      lastUpdateRef.current = now

      setElapsedTime((prev) => prev + deltaTime)

      animationFrameRef.current = requestAnimationFrame(updateRewards)
    }

    if (mounted) {
      animationFrameRef.current = requestAnimationFrame(updateRewards)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted])

  // Calculate real-time rewards
  const realTimeRewards = formattedAccumulatedRewards + rewardsPerSecond * elapsedTime

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <CyberCard variant="panel" className="h-full p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Rewards Tracker</h2>
        </div>

        <div className="relative mb-8">
          <ParticleEffect count={10} colors={["#8B5CF6", "#6366F1", "#3B82F6"]} className="absolute inset-0" />

          <div className="relative z-10 bg-black/40 rounded-lg p-6 border border-purple-500/20 text-center">
            <p className="text-sm text-gray-400 mb-2">Total Accumulated Rewards</p>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              <AnimatedCounter
                value={realTimeRewards}
                formatFn={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 6 })} 5PT`}
                duration={0.1}
              />
            </p>
            <p className="text-sm text-gray-400 mt-2">
              ~${(realTimeRewards * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-purple-400 mr-2" />
              <p className="text-sm text-gray-400">Last Round</p>
            </div>
            <p className="text-xl font-bold">
              {formattedLastRoundRewards.toLocaleString(undefined, { maximumFractionDigits: 6 })} 5PT
            </p>
            <p className="text-xs text-gray-400">
              ~${(formattedLastRoundRewards * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400 mr-2" />
              <p className="text-sm text-gray-400">Daily Estimate</p>
            </div>
            <p className="text-xl font-bold">
              {dailyRewards.toLocaleString(undefined, { maximumFractionDigits: 6 })} 5PT
            </p>
            <p className="text-xs text-gray-400">
              ~${(dailyRewards * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>

        <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Real-time Earnings</p>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
              <p className="text-xs text-green-400">Live</p>
            </div>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              style={{ width: `${((elapsedTime % 60) / 60) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Per second: {rewardsPerSecond.toFixed(8)} 5PT</span>
            <span>Per minute: {(rewardsPerSecond * 60).toFixed(6)} 5PT</span>
          </div>
        </div>

        <CyberButton variant="primary" className="w-full">
          <div className="flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            <span>Claim Rewards</span>
          </div>
        </CyberButton>
      </CyberCard>
    </motion.div>
  )
}
