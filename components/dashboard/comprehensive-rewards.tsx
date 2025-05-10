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
import { Award, TrendingUp, Users, Coins, Share2, Clock, Star, Trophy, BarChart2, Zap } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { GradientBorder } from "@/components/ui/gradient-border"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ComprehensiveRewards() {
  const { address } = useAccount()
  const { useAccumulatedRewards, useLastRoundRewards, useInvestorInfo, claimReward } = useInvestmentManager()
  const { symbol } = useTokenContract()
  const [activeTab, setActiveTab] = useState("overview")
  const [userRank, setUserRank] = useState({ level: 2, title: "Silver Investor", progress: 65 })

  // Fetch user data
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)
  const { data: lastRewards, isLoading: isLastRewardsLoading } = useLastRoundRewards(address)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)

  // Calculate lifetime rewards and other metrics
  const [lifetimeRewards, setLifetimeRewards] = useState(0)
  const [projectedMonthlyRewards, setProjectedMonthlyRewards] = useState(0)
  const [rewardHistory, setRewardHistory] = useState<any[]>([])

  useEffect(() => {
    if (investorInfo && lastRewards) {
      // Calculate lifetime rewards based on available data
      const totalDeposit = Number(formatEther(investorInfo[0] || 0n))
      const directRefs = Number(investorInfo[1] || 0n)
      const mockLifetimeRewards = totalDeposit * 0.15 + directRefs * 5
      setLifetimeRewards(mockLifetimeRewards)

      // Calculate projected monthly rewards
      const dailyReward = Number(formatEther(lastRewards[0] || 0n))
      const refReward = Number(formatEther(lastRewards[1] || 0n))
      const poolReward = Number(formatEther(lastRewards[2] || 0n))
      const totalDailyReward = dailyReward + refReward + poolReward
      setProjectedMonthlyRewards(totalDailyReward * 30)

      // Generate mock reward history
      const mockHistory = []
      const now = new Date()
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Create some variation in the rewards
        const baseReward = totalDailyReward * (0.8 + Math.random() * 0.4)

        mockHistory.push({
          date: date.toISOString().split("T")[0],
          reward: baseReward,
          dailyReward: baseReward * 0.4,
          refReward: baseReward * 0.3,
          poolReward: baseReward * 0.3,
        })
      }
      setRewardHistory(mockHistory)
    }
  }, [investorInfo, lastRewards])

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

  // Mock data for rank system
  const rankSystem = [
    { level: 1, title: "Bronze Investor", requirement: "Min. 100 5PT staked" },
    { level: 2, title: "Silver Investor", requirement: "Min. 500 5PT staked + 2 referrals" },
    { level: 3, title: "Gold Investor", requirement: "Min. 1,000 5PT staked + 5 referrals" },
    { level: 4, title: "Platinum Investor", requirement: "Min. 5,000 5PT staked + 10 referrals" },
    { level: 5, title: "Diamond Investor", requirement: "Min. 10,000 5PT staked + 20 referrals" },
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

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-gradient-text">Rewards Dashboard</h2>
        <Button variant="outline" className="border-gold/30 hover:bg-gold/10 text-gold">
          <Share2 size={16} className="mr-2" />
          Share My Rewards
        </Button>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/20 border border-gold/30 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="pools">Pool Rewards</TabsTrigger>
          <TabsTrigger value="referrals">Referral Rewards</TabsTrigger>
          <TabsTrigger value="rank">Rank & Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Rewards Card */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <HolographicCard className="p-6" intensity={8}>
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
                              <AnimatedCounter
                                from={0}
                                to={lifetimeRewards}
                                formatValue={(value) => value.toFixed(2)}
                              />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Projected Rewards */}
              <HolographicCard className="p-6" intensity={6}>
                <h3 className="text-lg font-bold mb-4">Projected Rewards</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Monthly:</span>
                    <span className="text-lg font-bold gold-gradient-text">
                      <AnimatedCounter
                        from={0}
                        to={projectedMonthlyRewards}
                        formatValue={(value) => value.toFixed(2)}
                      />{" "}
                      5PT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Yearly:</span>
                    <span className="text-lg font-bold gold-gradient-text">
                      <AnimatedCounter
                        from={0}
                        to={projectedMonthlyRewards * 12}
                        formatValue={(value) => value.toFixed(2)}
                      />{" "}
                      5PT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">USD Value (Yearly):</span>
                    <span className="text-lg font-bold text-green-400">
                      <AnimatedCounter
                        from={0}
                        to={projectedMonthlyRewards * 12 * 0.0875} // Using mock token price
                        formatValue={(value) => `$${value.toFixed(2)}`}
                      />
                    </span>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="history">
          <HolographicCard className="p-6" intensity={7}>
            <h3 className="text-xl font-bold mb-6">Reward History</h3>

            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rewardHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(212, 175, 55, 0.5)"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis stroke="rgba(212, 175, 55, 0.5)" />
                  <Tooltip
                    formatter={(value) => value.toFixed(4) + " 5PT"}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="dailyReward"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Daily"
                  />
                  <Area
                    type="monotone"
                    dataKey="refReward"
                    stackId="1"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.6}
                    name="Referral"
                  />
                  <Area
                    type="monotone"
                    dataKey="poolReward"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Pool"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-300">Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-300">USD Value</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRewards.map((reward, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{reward.date}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            reward.type === "Daily"
                              ? "border-violet-500 text-violet-400"
                              : reward.type === "Referral"
                                ? "border-pink-500 text-pink-400"
                                : "border-amber-500 text-amber-400"
                          }
                        >
                          {reward.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{reward.amount} 5PT</td>
                      <td className="py-3 px-4 text-right font-medium text-green-400">
                        ${(Number.parseFloat(reward.amount) * 0.0875).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </HolographicCard>
        </TabsContent>

        <TabsContent value="pools">
          <HolographicCard className="p-6" intensity={7}>
            <h3 className="text-xl font-bold mb-6">Pool Rewards</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3, 4, 5].map((poolId) => (
                <PoolRewardCard
                  key={poolId}
                  poolId={poolId}
                  isActive={poolId <= 3}
                  dailyReward={poolId * 0.5}
                  apy={12 + poolId * 3}
                  totalEarned={poolId * 10}
                />
              ))}
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-gold/20">
              <h4 className="text-lg font-bold mb-2">Pool Rewards Strategy</h4>
              <p className="text-gray-300 mb-4">
                Maximize your earnings by participating in multiple pools. Higher tier pools offer better rewards but
                require more investment and referrals.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-black/50 p-3 rounded-lg">
                  <h5 className="text-sm font-bold text-gold mb-2">Tip #1</h5>
                  <p className="text-xs text-gray-400">
                    Reinvest your rewards to reach higher pool tiers faster and increase your passive income.
                  </p>
                </div>
                <div className="flex-1 bg-black/50 p-3 rounded-lg">
                  <h5 className="text-sm font-bold text-gold mb-2">Tip #2</h5>
                  <p className="text-xs text-gray-400">
                    Refer active investors to meet the referral requirements for higher tier pools.
                  </p>
                </div>
                <div className="flex-1 bg-black/50 p-3 rounded-lg">
                  <h5 className="text-sm font-bold text-gold mb-2">Tip #3</h5>
                  <p className="text-xs text-gray-400">
                    Distribute your investment across multiple pools to diversify your reward sources.
                  </p>
                </div>
              </div>
            </div>
          </HolographicCard>
        </TabsContent>

        <TabsContent value="referrals">
          <HolographicCard className="p-6" intensity={7}>
            <h3 className="text-xl font-bold mb-6">Referral Rewards</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-black/30 p-4 rounded-xl border border-gold/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Users size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Direct Referrals</p>
                    <p className="text-xl font-bold">{investorInfo ? investorInfo[1].toString() : "0"}</p>
                  </div>
                </div>
                <div className="h-1 bg-black/50 rounded-full mb-2">
                  <div
                    className="h-full bg-pink-400 rounded-full"
                    style={{ width: `${Math.min(100, (investorInfo ? Number(investorInfo[1]) : 0) * 5)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Next milestone:{" "}
                  {investorInfo ? (Number(investorInfo[1]) < 5 ? 5 : Number(investorInfo[1]) < 10 ? 10 : 20) : 5}{" "}
                  referrals
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-gold/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <BarChart2 size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Referral Volume</p>
                    <p className="text-xl font-bold">
                      {investorInfo ? formatEther(investorInfo[3]).slice(0, 6) : "0"} 5PT
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-black/50 rounded-full mb-2">
                  <div
                    className="h-full bg-pink-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (investorInfo ? Number(formatEther(investorInfo[3])) : 0) / 10)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  USD Value: ${investorInfo ? (Number(formatEther(investorInfo[3])) * 0.0875).toFixed(2) : "0"}
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-gold/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Award size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Referral Rewards</p>
                    <p className="text-xl font-bold">
                      {lastRewards ? (Number(formatEther(lastRewards[1])) * 30).toFixed(2) : "0"} 5PT
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-black/50 rounded-full mb-2">
                  <div
                    className="h-full bg-pink-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (lastRewards ? Number(formatEther(lastRewards[1])) * 30 : 0) / 5)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400">Monthly projection based on current referrals</p>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-gold/20 mb-6">
              <h4 className="text-lg font-bold mb-3">Referral Link</h4>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 bg-black/50 p-3 rounded-lg text-center md:text-left">
                  <p className="text-sm text-gray-300 break-all">https://5pt.finance/ref/{address || "0x..."}</p>
                </div>
                <Button className="bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-700 hover:to-pink-500 text-white">
                  <Share2 size={16} className="mr-2" />
                  Share Link
                </Button>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-gold/20">
              <h4 className="text-lg font-bold mb-3">Referral Tiers & Rewards</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-pink-400 font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 1 (Direct)</p>
                      <p className="text-xs text-gray-400">Your direct referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-400">10%</p>
                    <p className="text-xs text-gray-400">of their rewards</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-pink-400 font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 2</p>
                      <p className="text-xs text-gray-400">Referrals of your referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-400">5%</p>
                    <p className="text-xs text-gray-400">of their rewards</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-pink-400 font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 3</p>
                      <p className="text-xs text-gray-400">Third level referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-400">2.5%</p>
                    <p className="text-xs text-gray-400">of their rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </HolographicCard>
        </TabsContent>

        <TabsContent value="rank">
          <HolographicCard className="p-6" intensity={7}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-black/30 p-6 rounded-xl border border-gold/20 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-dark to-gold-light animate-pulse-gold opacity-20"></div>
                    <div className="absolute inset-2 rounded-full bg-black/80 flex items-center justify-center">
                      <Trophy size={40} className="text-gold" />
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gold-gradient)"
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * userRank.progress) / 100}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#b8860b" />
                          <stop offset="100%" stopColor="#d4af37" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold gold-gradient-text mb-2">{userRank.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">Level {userRank.level} Investor</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-400">Progress:</span>
                    <span className="font-bold">{userRank.progress}%</span>
                    <span className="text-gray-400">to next level</span>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-gold/20 mt-6">
                  <h4 className="text-lg font-bold mb-3">Your Benefits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Zap size={16} className="text-gold" />
                      <span>+{userRank.level * 5}% Reward Boost</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-gold" />
                      <span>+{userRank.level * 2}% Referral Bonus</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Star size={16} className="text-gold" />
                      <span>Access to Pool {userRank.level + 1}</span>
                    </li>
                    {userRank.level >= 3 && (
                      <li className="flex items-center gap-2 text-sm">
                        <Award size={16} className="text-gold" />
                        <span>Special NFT Rewards</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-6">Investor Rank System</h3>
                <div className="space-y-4">
                  {rankSystem.map((rank) => (
                    <div
                      key={rank.level}
                      className={`p-4 rounded-xl border ${
                        rank.level === userRank.level ? "bg-gold/10 border-gold" : "bg-black/30 border-gold/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            rank.level === userRank.level
                              ? "bg-gradient-to-r from-gold-dark to-gold-light text-black"
                              : "bg-black/50 text-gold"
                          }`}
                        >
                          <span className="text-lg font-bold">{rank.level}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-lg">{rank.title}</h4>
                            {rank.level === userRank.level && (
                              <Badge className="bg-gold text-black">Current Rank</Badge>
                            )}
                            {rank.level < userRank.level && <Badge className="bg-green-500 text-black">Achieved</Badge>}
                          </div>
                          <p className="text-sm text-gray-400">{rank.requirement}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/30 p-2 rounded-lg">
                          <p className="text-xs text-gray-400">Reward Boost</p>
                          <p className="font-bold text-gold">+{rank.level * 5}%</p>
                        </div>
                        <div className="bg-black/30 p-2 rounded-lg">
                          <p className="text-xs text-gray-400">Referral Bonus</p>
                          <p className="font-bold text-gold">+{rank.level * 2}%</p>
                        </div>
                        <div className="bg-black/30 p-2 rounded-lg">
                          <p className="text-xs text-gray-400">Pool Access</p>
                          <p className="font-bold text-gold">Level {rank.level + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HolographicCard>
        </TabsContent>
      </Tabs>
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

interface PoolRewardCardProps {
  poolId: number
  isActive: boolean
  dailyReward: number
  apy: number
  totalEarned: number
}

function PoolRewardCard({ poolId, isActive, dailyReward, apy, totalEarned }: PoolRewardCardProps) {
  return (
    <HolographicCard className="p-4" intensity={5}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold">Pool {poolId}</h4>
        <Badge className={isActive ? "bg-green-500 text-black" : "bg-gray-500"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Daily Reward:</span>
          <span className="font-bold text-gold">{dailyReward.toFixed(2)} 5PT</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">APY:</span>
          <span className="font-bold text-green-400">{apy}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Earned:</span>
          <span className="font-bold">{totalEarned.toFixed(2)} 5PT</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gold/10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">USD Value (Monthly):</span>
          <span className="text-green-400">${(dailyReward * 30 * 0.0875).toFixed(2)}</span>
        </div>
      </div>
    </HolographicCard>
  )
}
