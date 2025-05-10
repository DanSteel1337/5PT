"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { formatEther } from "ethers"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { ConnectKitButton } from "connectkit"
import { Award, Calendar, Users, Coins, RefreshCw } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function RewardsPage() {
  const { isConnected } = useAccount()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rewards Center</h1>

          {!isConnected && (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button
                  onClick={show}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          )}
        </div>

        {isConnected ? (
          <>
            <RewardsSummary />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RewardsBreakdown />
              <RewardsSettings />
            </div>
            <RewardsHistory />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect your wallet to view your rewards, claim history, and manage reward settings.
            </p>
            <ConnectKitButton />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function RewardsSummary() {
  const { address } = useAccount()
  const { useAccumulatedRewards, claimReward, claimStatus } = useInvestmentManager()

  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-medium text-gray-300 mb-2">Total Accumulated Rewards</h2>
              {isRewardsLoading ? (
                <Skeleton className="h-16 w-48 bg-white/5" />
              ) : (
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                  <AnimatedCounter
                    from={0}
                    to={Number(formatEther(rewards || 0n))}
                    formatValue={(value) => value.toFixed(4)}
                  />
                  <span className="ml-2">5PT</span>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-8 py-6 text-lg"
              onClick={claimReward}
              disabled={claimStatus.isLoading || (rewards && rewards <= 0n)}
            >
              {claimStatus.isLoading ? (
                <>
                  <RefreshCw size={20} className="mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Award size={20} className="mr-2" />
                  Claim Rewards
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

function RewardsBreakdown() {
  const { address } = useAccount()
  const { useLastRoundRewards } = useInvestmentManager()

  const { data: lastRewards, isLoading } = useLastRoundRewards(address)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
      },
    },
  }

  // Prepare chart data
  let chartData = []

  if (lastRewards) {
    const [dailyReward, refReward, poolsReward] = lastRewards

    chartData = [
      { name: "Daily", value: Number(formatEther(dailyReward)) },
      { name: "Referral", value: Number(formatEther(refReward)) },
      { name: "Pools", value: Number(formatEther(poolsReward)) },
    ]
  }

  const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b"]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <GlassCard className="p-6 h-full">
        <h3 className="text-xl font-bold mb-6">Rewards Breakdown</h3>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Skeleton className="h-48 w-48 rounded-full bg-white/5" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toFixed(4) + " 5PT"} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex justify-center">
              <Calendar size={20} className="text-violet-400 mb-2" />
            </div>
            <p className="text-xs text-gray-400">Daily</p>
            {isLoading ? (
              <Skeleton className="h-6 w-full bg-white/5 mt-1" />
            ) : (
              <p className="font-medium">{lastRewards ? formatEther(lastRewards[0]).slice(0, 6) : "0"} 5PT</p>
            )}
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <Users size={20} className="text-pink-400 mb-2" />
            </div>
            <p className="text-xs text-gray-400">Referral</p>
            {isLoading ? (
              <Skeleton className="h-6 w-full bg-white/5 mt-1" />
            ) : (
              <p className="font-medium">{lastRewards ? formatEther(lastRewards[1]).slice(0, 6) : "0"} 5PT</p>
            )}
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <Coins size={20} className="text-amber-400 mb-2" />
            </div>
            <p className="text-xs text-gray-400">Pools</p>
            {isLoading ? (
              <Skeleton className="h-6 w-full bg-white/5 mt-1" />
            ) : (
              <p className="font-medium">{lastRewards ? formatEther(lastRewards[2]).slice(0, 6) : "0"} 5PT</p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function RewardsSettings() {
  const [autoCompound, setAutoCompound] = useState(false)
  const [autoReinvest, setAutoReinvest] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <GlassCard className="p-6 h-full">
        <h3 className="text-xl font-bold mb-6">Reward Settings</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-compound">Auto-Compound Rewards</Label>
              <p className="text-sm text-gray-400">Automatically reinvest daily rewards</p>
            </div>
            <Switch id="auto-compound" checked={autoCompound} onCheckedChange={setAutoCompound} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-reinvest">Auto-Reinvest</Label>
              <p className="text-sm text-gray-400">Automatically reinvest all rewards</p>
            </div>
            <Switch id="auto-reinvest" checked={autoReinvest} onCheckedChange={setAutoReinvest} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Reward Notifications</Label>
              <p className="text-sm text-gray-400">Receive notifications for new rewards</p>
            </div>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
            Save Settings
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function RewardsHistory() {
  // Mock data for rewards history
  const rewardsHistory = [
    { date: "2023-05-10", amount: "12.5", type: "Daily" },
    { date: "2023-05-09", amount: "8.3", type: "Referral" },
    { date: "2023-05-08", amount: "15.7", type: "Pool" },
    { date: "2023-05-07", amount: "11.2", type: "Daily" },
    { date: "2023-05-06", amount: "9.8", type: "Referral" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-6">Rewards History</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rewardsHistory.map((reward, index) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  )
}
