"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { formatEther } from "ethers"
import { HolographicCard } from "@/components/ui/holographic-card"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { useTokenContract } from "@/lib/hooks/use-token-contract"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Award, TrendingUp, Users, Coins, Share2, Clock, ArrowRight } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { GradientBorder } from "@/components/ui/gradient-border"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function RewardsShowcase() {
  const { address } = useAccount()
  const { useAccumulatedRewards, useLastRoundRewards, useInvestorInfo, claimReward } = useInvestmentManager()
  const { symbol } = useTokenContract()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Fetch user data
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)
  const { data: lastRewards, isLoading: isLastRewardsLoading } = useLastRoundRewards(address)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)

  // Mock data for lifetime rewards (would come from contract in production)
  const [lifetimeRewards, setLifetimeRewards] = useState(0)

  useEffect(() => {
    if (investorInfo) {
      // In a real implementation, this would come from the contract
      // For now, we'll calculate a mock value based on available data
      const totalDeposit = Number(formatEther(investorInfo[0] || 0n))
      const directRefs = Number(investorInfo[1] || 0n)
      const mockLifetimeRewards = totalDeposit * 0.15 + directRefs * 5
      setLifetimeRewards(mockLifetimeRewards)
    }
  }, [investorInfo])

  // Prepare chart data
  const rewardChartData = []
  if (lastRewards) {
    const [dailyReward, refReward, poolsReward] = lastRewards

    rewardChartData.push(
      { name: "Daily", value: Number(formatEther(dailyReward)), color: "#8b5cf6" },
      { name: "Referral", value: Number(formatEther(refReward)), color: "#ec4899" },
      { name: "Pools", value: Number(formatEther(poolsReward)), color: "#f59e0b" },
    )
  }

  // Mock data for recent rewards history
  const recentRewards = [
    { date: "Today", amount: "2.45", type: "Daily" },
    { date: "Yesterday", amount: "3.12", type: "Pool" },
    { date: "2 days ago", amount: "1.87", type: "Referral" },
    { date: "3 days ago", amount: "2.21", type: "Daily" },
  ]

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

  const handleShare = () => {
    // In a real implementation, this would generate a shareable image
    // For now, we'll just toggle a mock modal
    setIsShareModalOpen(true)

    // After a brief delay, close the modal
    setTimeout(() => {
      setIsShareModalOpen(false)
    }, 2000)
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-gradient-text">Rewards Showcase</h2>
        <Button variant="outline" className="border-gold/30 hover:bg-gold/10 text-gold" onClick={handleShare}>
          <Share2 size={16} className="mr-2" />
          Share My Rewards
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Rewards Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <HolographicCard className="p-6 h-full" intensity={8}>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold gold-gradient-text">Total Rewards</h3>
                  <p className="text-gray-400 text-sm">Your earnings from all sources</p>
                </div>
                <Badge className="bg-gradient-to-r from-gold-dark to-gold-light text-black">
                  <Clock size={14} className="mr-1" /> Updated Just Now
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/30 rounded-xl p-4 border border-gold/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Award size={20} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Pending Rewards</p>
                      <div className="text-2xl font-bold gold-gradient-text">
                        {isRewardsLoading ? (
                          <Skeleton className="h-8 w-32 bg-white/5" />
                        ) : (
                          <>
                            <AnimatedCounter
                              from={0}
                              to={Number(formatEther(rewards || 0n))}
                              formatValue={(value) => value.toFixed(4)}
                            />
                            <span className="ml-1">{symbol}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2 bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
                    onClick={claimReward}
                  >
                    Claim Now
                  </Button>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-gold/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Lifetime Earnings</p>
                      <div className="text-2xl font-bold gold-gradient-text">
                        {isInfoLoading ? (
                          <Skeleton className="h-8 w-32 bg-white/5" />
                        ) : (
                          <>
                            <AnimatedCounter from={0} to={lifetimeRewards} formatValue={(value) => value.toFixed(2)} />
                            <span className="ml-1">{symbol}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-dark to-gold-light"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, lifetimeRewards / 2)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <RewardSourceCard
                  title="Daily Rewards"
                  icon={<Clock size={18} className="text-violet-400" />}
                  amount={lastRewards ? formatEther(lastRewards[0]).slice(0, 6) : "0"}
                  description="Earned every 24 hours"
                  color="from-violet-600 to-violet-400"
                  isLoading={isLastRewardsLoading}
                />
                <RewardSourceCard
                  title="Referral Rewards"
                  icon={<Users size={18} className="text-pink-400" />}
                  amount={lastRewards ? formatEther(lastRewards[1]).slice(0, 6) : "0"}
                  description={`From ${investorInfo ? investorInfo[1].toString() : "0"} referrals`}
                  color="from-pink-600 to-pink-400"
                  isLoading={isLastRewardsLoading}
                />
                <RewardSourceCard
                  title="Pool Rewards"
                  icon={<Coins size={18} className="text-amber-400" />}
                  amount={lastRewards ? formatEther(lastRewards[2]).slice(0, 6) : "0"}
                  description="From investment pools"
                  color="from-amber-600 to-amber-400"
                  isLoading={isLastRewardsLoading}
                />
              </div>
            </div>
          </HolographicCard>
        </motion.div>

        {/* Side Cards */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          {/* Rewards Breakdown Chart */}
          <HolographicCard className="p-6" intensity={6}>
            <h3 className="text-lg font-bold mb-4">Rewards Breakdown</h3>

            {isLastRewardsLoading ? (
              <div className="flex justify-center items-center h-48">
                <Skeleton className="h-32 w-32 rounded-full bg-white/5" />
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rewardChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {rewardChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toFixed(4) + " " + symbol} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mt-2">
              {rewardChartData.map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs mt-1">{entry.name}</span>
                </div>
              ))}
            </div>
          </HolographicCard>

          {/* Recent Rewards */}
          <HolographicCard className="p-6 flex-1" intensity={6}>
            <h3 className="text-lg font-bold mb-4">Recent Rewards</h3>

            <div className="space-y-3">
              {recentRewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-gold/10"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        reward.type === "Daily"
                          ? "border-violet-500 text-violet-400"
                          : reward.type === "Referral"
                            ? "border-pink-500 text-pink-400"
                            : "border-amber-500 text-amber-400",
                      )}
                    >
                      {reward.type}
                    </Badge>
                    <span className="text-sm text-gray-300">{reward.date}</span>
                  </div>
                  <span className="font-medium">
                    {reward.amount} {symbol}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4 text-gold hover:text-gold-light hover:bg-gold/5">
              View All History <ArrowRight size={14} className="ml-2" />
            </Button>
          </HolographicCard>
        </motion.div>
      </motion.div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-gold/30 rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4 gold-gradient-text">Sharing Your Rewards</h3>
            <p className="text-gray-300 mb-4">Generating shareable image of your rewards...</p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface RewardSourceCardProps {
  title: string
  icon: React.ReactNode
  amount: string
  description: string
  color: string
  isLoading?: boolean
}

function RewardSourceCard({ title, icon, amount, description, color, isLoading }: RewardSourceCardProps) {
  return (
    <GradientBorder className="h-full" gradientFrom={`bg-gradient-to-r ${color}`} gradientTo="" isAnimated={false}>
      <div className="bg-black/60 p-4 rounded-xl h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">{icon}</div>
          <h4 className="text-sm font-medium">{title}</h4>
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-24 bg-white/5 my-2" />
        ) : (
          <div className="text-xl font-bold my-2">{amount} 5PT</div>
        )}

        <p className="text-xs text-gray-400 mt-auto">{description}</p>
      </div>
    </GradientBorder>
  )
}
