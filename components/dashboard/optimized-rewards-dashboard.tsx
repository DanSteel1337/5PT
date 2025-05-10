"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Award, Clock, Share2, Users, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import {
  useAccumulatedRewards,
  useLastRoundRewards,
  useInvestorInfo,
  useInvestmentManager,
} from "@/lib/hooks/use-investment-manager"
import { formatEther } from "ethers"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Skeleton } from "@/components/ui/skeleton"

export function OptimizedRewardsDashboard() {
  const { address } = useAccount()
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)
  const { data: lastRewards, isLoading: isLastRewardsLoading } = useLastRoundRewards(address)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)
  const { claimReward } = useInvestmentManager()

  // Calculate lifetime rewards (mock data for now)
  const lifetimeRewards = investorInfo ? Number(formatEther(investorInfo[0] || 0n)) * 0.15 : 0

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-300">Rewards Dashboard</h2>
        <Button variant="outline" className="bg-amber-900/20 border-amber-600/50 hover:bg-amber-800/30 text-amber-300">
          <Share2 size={16} className="mr-2" />
          Share My Rewards
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/40 border border-amber-600/30 mb-4">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300"
          >
            History
          </TabsTrigger>
          <TabsTrigger value="pools" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300">
            Pool Rewards
          </TabsTrigger>
          <TabsTrigger
            value="referrals"
            className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300"
          >
            Referral Rewards
          </TabsTrigger>
          <TabsTrigger value="rank" className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300">
            Rank & Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Rewards Card */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">Total Rewards</h3>
                    <p className="text-amber-100/70 text-sm">Your earnings from all sources</p>
                  </div>
                  <Badge className="bg-amber-900/50 text-amber-300 border-amber-600/50">
                    <Clock size={14} className="mr-1" /> Updated Just Now
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Pending Rewards */}
                  <div className="bg-black/30 rounded-xl p-4 border border-amber-600/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                        <Award size={20} className="text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm text-amber-100/70">Pending Rewards</p>
                        <div className="text-2xl font-bold text-amber-300">
                          {isRewardsLoading ? (
                            <Skeleton className="h-8 w-32 bg-amber-900/20" />
                          ) : (
                            <AnimatedCounter
                              from={0}
                              to={Number(formatEther(rewards || 0n))}
                              formatValue={(value) => value.toFixed(4)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-2 bg-amber-900/50 hover:bg-amber-800/70 text-amber-300 border border-amber-600/50">
                      Claim Now
                    </Button>
                  </div>

                  {/* Lifetime Earnings */}
                  <div className="bg-black/30 rounded-xl p-4 border border-amber-600/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                        <Clock size={20} className="text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm text-amber-100/70">Lifetime Earnings</p>
                        <div className="text-2xl font-bold text-amber-300">
                          {isInfoLoading ? (
                            <Skeleton className="h-8 w-32 bg-amber-900/20" />
                          ) : (
                            <AnimatedCounter from={0} to={lifetimeRewards} formatValue={(value) => value.toFixed(2)} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-600"
                        style={{ width: `${Math.min(100, lifetimeRewards / 2)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Daily Rewards */}
                  <RewardSourceCard
                    title="Daily Rewards"
                    icon={<Clock size={18} className="text-amber-300" />}
                    amount={lastRewards ? formatEther(lastRewards[0]).slice(0, 6) : "0"}
                    description="Earned every 24 hours"
                    isLoading={isLastRewardsLoading}
                  />

                  {/* Referral Rewards */}
                  <RewardSourceCard
                    title="Referral Rewards"
                    icon={<Users size={18} className="text-amber-300" />}
                    amount={lastRewards ? formatEther(lastRewards[1]).slice(0, 6) : "0"}
                    description={`From ${investorInfo ? investorInfo[1].toString() : "0"} referrals`}
                    isLoading={isLastRewardsLoading}
                  />

                  {/* Pool Rewards */}
                  <RewardSourceCard
                    title="Pool Rewards"
                    icon={<Coins size={18} className="text-amber-300" />}
                    amount={lastRewards ? formatEther(lastRewards[2]).slice(0, 6) : "0"}
                    description="From investment pools"
                    isLoading={isLastRewardsLoading}
                  />
                </div>
              </div>
            </Card>

            {/* Rewards Breakdown */}
            <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4">Rewards Breakdown</h3>

                {isLastRewardsLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Skeleton className="h-32 w-32 rounded-full bg-amber-900/20" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Daily Rewards */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center">
                            <Clock size={14} className="text-purple-300" />
                          </div>
                          <span className="text-sm">Daily</span>
                        </div>
                        <span className="text-sm font-medium">
                          {lastRewards ? formatEther(lastRewards[0]).slice(0, 6) : "0"} 5PT
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600"
                          style={{
                            width: lastRewards
                              ? `${
                                  (Number(formatEther(lastRewards[0])) /
                                    (Number(formatEther(lastRewards[0])) +
                                      Number(formatEther(lastRewards[1])) +
                                      Number(formatEther(lastRewards[2])))) *
                                  100
                                }%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Referral Rewards */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-pink-900/50 flex items-center justify-center">
                            <Users size={14} className="text-pink-300" />
                          </div>
                          <span className="text-sm">Referral</span>
                        </div>
                        <span className="text-sm font-medium">
                          {lastRewards ? formatEther(lastRewards[1]).slice(0, 6) : "0"} 5PT
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-600"
                          style={{
                            width: lastRewards
                              ? `${
                                  (Number(formatEther(lastRewards[1])) /
                                    (Number(formatEther(lastRewards[0])) +
                                      Number(formatEther(lastRewards[1])) +
                                      Number(formatEther(lastRewards[2])))) *
                                  100
                                }%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Pool Rewards */}
                    <div className="bg-black/30 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-900/50 flex items-center justify-center">
                            <Coins size={14} className="text-amber-300" />
                          </div>
                          <span className="text-sm">Pool</span>
                        </div>
                        <span className="text-sm font-medium">
                          {lastRewards ? formatEther(lastRewards[2]).slice(0, 6) : "0"} 5PT
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600"
                          style={{
                            width: lastRewards
                              ? `${
                                  (Number(formatEther(lastRewards[2])) /
                                    (Number(formatEther(lastRewards[0])) +
                                      Number(formatEther(lastRewards[1])) +
                                      Number(formatEther(lastRewards[2])))) *
                                  100
                                }%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Reward History</h3>
              <p className="text-amber-100/70">Select the History tab to view your reward history.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pools">
          <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Pool Rewards</h3>
              <p className="text-amber-100/70">Select the Pool Rewards tab to view your pool rewards.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Referral Rewards</h3>
              <p className="text-amber-100/70">Select the Referral Rewards tab to view your referral rewards.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rank">
          <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-4">Rank & Status</h3>
              <p className="text-amber-100/70">Select the Rank & Status tab to view your investment rank.</p>
            </div>
          </Card>
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
  isLoading?: boolean
}

function RewardSourceCard({ title, icon, amount, description, isLoading }: RewardSourceCardProps) {
  return (
    <div className="bg-black/30 p-4 rounded-xl border border-amber-600/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center">{icon}</div>
        <h4 className="text-sm font-medium text-amber-100">{title}</h4>
      </div>

      {isLoading ? (
        <Skeleton className="h-8 w-24 bg-amber-900/20 my-2" />
      ) : (
        <div className="text-xl font-bold text-amber-300 my-2">{amount} 5PT</div>
      )}

      <p className="text-xs text-amber-100/70 mt-auto">{description}</p>
    </div>
  )
}
