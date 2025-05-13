"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Wallet, Clock } from "lucide-react"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { Web3ProviderWrapper } from "@/components/providers/Web3ProviderWrapper"

// Dynamically import wallet-dependent components
const WalletOverview = dynamic(
  () => import("@/components/dashboard/WalletOverview").then((mod) => mod.WalletOverview),
  {
    loading: () => <WalletOverviewSkeleton />,
  },
)

const InvestmentStats = dynamic(
  () => import("@/components/dashboard/InvestmentStats").then((mod) => mod.InvestmentStats),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  },
)

const ReferralSystem = dynamic(
  () => import("@/components/dashboard/ReferralSystem").then((mod) => mod.ReferralSystem),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  },
)

const InvestmentPools = dynamic(
  () => import("@/components/dashboard/InvestmentPools").then((mod) => mod.InvestmentPools),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  },
)

const RankDisplay = dynamic(() => import("@/components/dashboard/RankDisplay").then((mod) => mod.RankDisplay), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
})

function WalletOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      <div className="glass-card rounded-xl h-40"></div>
      <div className="glass-card rounded-xl h-40"></div>
      <div className="glass-card rounded-xl h-40"></div>
    </div>
  )
}

function ConnectWalletPrompt() {
  return (
    <div className="glass-card-purple rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-gradient">Connect Your Wallet</h2>
      <p className="text-gray-300 mb-6">
        Connect your wallet to view your investment dashboard, manage your pools, and track your earnings.
      </p>
      <div className="flex justify-center">
        <CustomConnectButton />
      </div>
    </div>
  )
}

// This is the internal implementation that uses Wagmi hooks
function DashboardContentInternal() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <DashboardSkeleton />

  function DashboardSkeleton() {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-60 w-full mt-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <WalletOverview />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Investment Stats and Pools */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="stats" className="data-[state=active]:bg-purple-900/50">
                <TrendingUp className="mr-2 h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="pools" className="data-[state=active]:bg-purple-900/50">
                <Wallet className="mr-2 h-4 w-4" />
                Pools
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-900/50">
                <Clock className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-0">
              <InvestmentStats />
            </TabsContent>

            <TabsContent value="pools" className="mt-0">
              <InvestmentPools />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card className="glass-card-purple p-6">
                <h3 className="text-xl font-bold mb-4 text-gradient">Transaction History</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                      <div>
                        <p className="font-medium">Deposit to Pool {(i % 3) + 1}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-400">+{(i * 0.5).toFixed(2)} 5PT</p>
                        <p className="text-xs text-gray-400">Confirmed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Rank and Referrals */}
        <div className="space-y-6">
          <RankDisplay />
          <ReferralSystem />
        </div>
      </div>

      {/* Platform Stats */}
      <div className="glass-card-purple rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gradient">Platform Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
            <p className="text-2xl font-bold text-white">$4,582,941</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Investors</p>
            <p className="text-2xl font-bold text-white">12,847</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Active Pools</p>
            <p className="text-2xl font-bold text-white">5</p>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Rewards Paid</p>
            <p className="text-2xl font-bold text-white">$1,245,632</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// This is the exported component that wraps the internal implementation with the Web3ProviderWrapper
export function DashboardContent() {
  return (
    <Web3ProviderWrapper>
      <DashboardContentInternal />
    </Web3ProviderWrapper>
  )
}

export default DashboardContent
