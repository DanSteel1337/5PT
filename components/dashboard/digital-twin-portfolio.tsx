"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount } from "wagmi"
import { formatEther } from "ethers"
import { HolographicCard } from "@/components/ui/holographic-card"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { useTokenContract } from "@/lib/hooks/use-token-contract"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Zap } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function DigitalTwinPortfolio() {
  const { address } = useAccount()
  const { useTokenBalance } = useTokenContract()
  const { useInvestorInfo, useAccumulatedRewards } = useInvestmentManager()
  const [performanceScore, setPerformanceScore] = useState(0)
  const [growthRate, setGrowthRate] = useState(0)
  const [portfolioHealth, setPortfolioHealth] = useState(0)
  const [portfolioType, setPortfolioType] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data
  const { data: balance, isLoading: isBalanceLoading } = useTokenBalance(address)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)

  // Calculate portfolio metrics
  useEffect(() => {
    if (isBalanceLoading || isInfoLoading || isRewardsLoading) return

    const totalBalance = balance ? Number(formatEther(balance)) : 0
    const totalDeposit = investorInfo ? Number(formatEther(investorInfo[0])) : 0
    const totalRewards = rewards ? Number(formatEther(rewards)) : 0
    const referralCount = investorInfo ? Number(investorInfo[1]) : 0

    // Calculate performance score (0-100)
    const rawScore = Math.min(100, (totalRewards / (totalDeposit || 1)) * 100 + referralCount * 5)
    setPerformanceScore(Math.round(rawScore))

    // Calculate growth rate (-100 to 100)
    const rawGrowth = (totalRewards / (totalDeposit || 1)) * 100 - 5
    setGrowthRate(Math.round(rawGrowth))

    // Calculate portfolio health (0-100)
    const diversification = Math.min(100, referralCount * 10 + (totalDeposit > 0 ? 50 : 0))
    setPortfolioHealth(Math.round(diversification))

    // Determine portfolio type
    if (totalDeposit === 0) {
      setPortfolioType("Inactive")
    } else if (referralCount > 5) {
      setPortfolioType("Network Builder")
    } else if (totalRewards > totalDeposit * 0.1) {
      setPortfolioType("Yield Optimizer")
    } else if (totalDeposit > 100) {
      setPortfolioType("Whale")
    } else {
      setPortfolioType("Starter")
    }

    setIsLoading(false)
  }, [balance, investorInfo, rewards, isBalanceLoading, isInfoLoading, isRewardsLoading])

  // Generate morphing shapes based on portfolio metrics
  const generateShapePath = (score: number, complexity: number) => {
    const points = 6 + Math.floor(complexity / 20)
    const radius = 80
    const variance = (score / 100) * 40

    let path = "M"

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      const r = radius + Math.sin(angle * 3) * variance + (Math.cos(angle * 5) * variance) / 2
      const x = Math.cos(angle) * r + 100
      const y = Math.sin(angle) * r + 100

      if (i === 0) {
        path += `${x},${y}`
      } else {
        path += ` L${x},${y}`
      }
    }

    return path + " Z"
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 gold-gradient-text">Portfolio Digital Twin</h2>

      <HolographicCard className="p-6" intensity={8}>
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-[200px] w-[200px] rounded-full bg-white/5" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-white/5" />
              <Skeleton className="h-20 w-full bg-white/5" />
              <Skeleton className="h-12 w-1/2 bg-white/5" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Digital Twin Visualization */}
            <div className="relative w-[200px] h-[200px]">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="rgba(0,0,0,0.3)" />

                {/* Performance shape */}
                <AnimatePresence>
                  <motion.path
                    key={`shape-${performanceScore}-${portfolioHealth}`}
                    d={generateShapePath(performanceScore, portfolioHealth)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      fill: `rgba(212, 175, 55, ${performanceScore / 200 + 0.3})`,
                      stroke: "rgba(255, 255, 255, 0.8)",
                      strokeWidth: 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1 }}
                  />
                </AnimatePresence>

                {/* Inner circle with portfolio type */}
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="rgba(0,0,0,0.5)"
                  stroke="rgba(212, 175, 55, 0.5)"
                  strokeWidth="1"
                />

                {/* Growth indicator */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {growthRate >= 0 ? (
                    <polygon points="100,70 110,85 90,85" fill="rgba(0, 255, 0, 0.7)" />
                  ) : (
                    <polygon points="100,130 110,115 90,115" fill="rgba(255, 0, 0, 0.7)" />
                  )}
                </motion.g>

                {/* Energy pulses */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="2"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeOut",
                  }}
                />

                <motion.circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="2"
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 1,
                    ease: "easeOut",
                  }}
                />

                {/* Portfolio type text */}
                <text
                  x="100"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255, 255, 255, 0.9)"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {portfolioType}
                </text>

                {/* Performance score */}
                <text
                  x="100"
                  y="120"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(212, 175, 55, 0.9)"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {performanceScore}/100
                </text>
              </svg>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gold"
                    initial={{
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      opacity: 0,
                    }}
                    animate={{
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Insights */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4 gold-gradient-text">Portfolio Insights</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      {growthRate >= 0 ? (
                        <TrendingUp className="text-green-400" size={18} />
                      ) : (
                        <TrendingDown className="text-red-400" size={18} />
                      )}
                      <span className="text-sm text-gray-300">Growth Rate</span>
                    </div>
                    <div className={`text-xl font-bold ${growthRate >= 0 ? "text-green-400" : "text-red-400"}`}>
                      <AnimatedCounter
                        from={0}
                        to={Math.abs(growthRate)}
                        formatValue={(value) => `${growthRate >= 0 ? "+" : "-"}${value.toFixed(1)}%`}
                      />
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="text-gold" size={18} />
                      <span className="text-sm text-gray-300">Portfolio Health</span>
                    </div>
                    <div className="text-xl font-bold text-gold">
                      <AnimatedCounter
                        from={0}
                        to={portfolioHealth}
                        formatValue={(value) => `${value.toFixed(0)}/100`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-gold/20">
                  <h4 className="text-sm text-gray-300 mb-2">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    {performanceScore < 30 && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold"></span>
                        <span>Consider increasing your investment to boost rewards</span>
                      </li>
                    )}
                    {portfolioHealth < 50 && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold"></span>
                        <span>Diversify by participating in more investment pools</span>
                      </li>
                    )}
                    {growthRate < 10 && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold"></span>
                        <span>Grow your referral network to increase passive income</span>
                      </li>
                    )}
                    {performanceScore >= 70 && (
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        <span>Your portfolio is performing well! Consider reinvesting rewards</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </HolographicCard>
    </div>
  )
}
