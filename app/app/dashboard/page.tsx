"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Users, Target, ArrowUpRight, Wallet, Clock, ChevronRight } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"
import { Web3ProviderWrapper } from "@/components/providers/Web3ProviderWrapper"
import { formatCrypto, formatPercent } from "@/lib/utils"

export default function DashboardPage() {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <Web3ProviderWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Investment Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your investments and track your rewards</p>
          </header>

          {!isConnected ? (
            <ConnectWalletPrompt />
          ) : isLoading ? (
            <DashboardSkeleton />
          ) : (
            <DashboardContent address={address} />
          )}
        </div>
      </div>
    </Web3ProviderWrapper>
  )
}

function ConnectWalletPrompt() {
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Wallet className="h-16 w-16 text-purple-500 mb-6" />
        <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
        <p className="text-gray-400 text-center max-w-md mb-6">
          Connect your wallet to access your investment dashboard and manage your 5PT tokens.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700">Connect Wallet</Button>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-6 w-24 bg-gray-800 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-6 w-48 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardContent({ address }: { address?: `0x${string}` }) {
  // Mock data - would be replaced with actual contract data
  const mockData = {
    totalInvested: 5000,
    totalRewards: 125.75,
    pendingRewards: 3.25,
    referralRewards: 42.5,
    poolRewards: 83.25,
    dailyRewards: 1.5,
    referralCount: 7,
    activePool: 3,
    nextPoolRequirement: 7500,
    recentTransactions: [
      { id: 1, type: "Deposit", amount: 1000, timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: 2, type: "Reward", amount: 3, timestamp: new Date(Date.now() - 86400000) },
      { id: 3, type: "Referral Bonus", amount: 5, timestamp: new Date(Date.now() - 43200000) },
      { id: 4, type: "Withdrawal", amount: 10, timestamp: new Date() },
    ],
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Invested"
          value={formatCrypto(mockData.totalInvested)}
          icon={<Wallet className="h-5 w-5" />}
          trend={+5.2}
        />

        <StatsCard
          title="Total Rewards"
          value={formatCrypto(mockData.totalRewards)}
          icon={<Zap className="h-5 w-5" />}
          trend={+12.8}
        />

        <StatsCard
          title="Pending Rewards"
          value={formatCrypto(mockData.pendingRewards)}
          icon={<Clock className="h-5 w-5" />}
          actionLabel="Claim"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Reward Distribution</CardTitle>
            <CardDescription>Breakdown of your earned rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="all">All Rewards</TabsTrigger>
                <TabsTrigger value="referral">Referral</TabsTrigger>
                <TabsTrigger value="pool">Pool</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-purple-400 mr-2" />
                    <span>Daily Rewards</span>
                  </div>
                  <span>{formatCrypto(mockData.dailyRewards)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-purple-400 mr-2" />
                    <span>Referral Rewards</span>
                  </div>
                  <span>{formatCrypto(mockData.referralRewards)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-purple-400 mr-2" />
                    <span>Pool Rewards</span>
                  </div>
                  <span>{formatCrypto(mockData.poolRewards)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center font-bold">
                    <span>Total Rewards</span>
                  </div>
                  <span className="font-bold">{formatCrypto(mockData.totalRewards)}</span>
                </div>
              </TabsContent>

              <TabsContent value="referral" className="mt-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Referrals</span>
                    <span>{mockData.referralCount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Direct Referral Rewards</span>
                    <span>{formatCrypto(mockData.referralRewards * 0.6)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Indirect Referral Rewards</span>
                    <span>{formatCrypto(mockData.referralRewards * 0.4)}</span>
                  </div>

                  <Button variant="outline" className="mt-2">
                    View Referral Network
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="pool" className="mt-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Pool</span>
                    <span>Pool {mockData.activePool}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Daily Pool Rate</span>
                    <span>{formatPercent(0.3 + mockData.activePool * 0.05)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Next Pool Requirement</span>
                    <span>{formatCrypto(mockData.nextPoolRequirement)}</span>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-500 h-2.5 rounded-full"
                      style={{ width: `${(mockData.totalInvested / mockData.nextPoolRequirement) * 100}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-400">
                    Invest {formatCrypto(mockData.nextPoolRequirement - mockData.totalInvested)} more to reach Pool{" "}
                    {mockData.activePool + 1}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-gray-400">{tx.timestamp.toLocaleDateString()}</p>
                  </div>
                  <span className={tx.type === "Withdrawal" ? "text-red-400" : "text-green-400"}>
                    {tx.type === "Withdrawal" ? "-" : "+"}
                    {formatCrypto(tx.amount)}
                  </span>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2">
                View All Transactions
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatsCard({
  title,
  value,
  icon,
  trend,
  actionLabel,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: number
  actionLabel?: string
}) {
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-gray-800 rounded-lg">{icon}</div>

          {trend !== undefined && (
            <div className={`flex items-center text-sm ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
              {trend >= 0 ? "+" : ""}
              {trend}%
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          )}

          {actionLabel && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs py-1 h-auto">
              {actionLabel}
            </Button>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
