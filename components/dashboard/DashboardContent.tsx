"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { WalletOverview } from "./WalletOverview"
import { RankDisplay } from "./RankDisplay"
import { InvestmentPools } from "./InvestmentPools"
import { RealTimeEarnings } from "./RealTimeEarnings"
import { ReferralSystem } from "./ReferralSystem"
import { TokenomicsVisual } from "./TokenomicsVisual"
import { PoolQualificationCard } from "./PoolQualificationCard"
import { ShareableStats } from "./ShareableStats"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { CyberButton } from "@/components/ui/cyber-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export function DashboardContent() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Connect Your Wallet to Access Dashboard
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your wallet to view your investments, track your earnings, and manage your 5PT portfolio.
          </p>
          <CyberButton variant="primary" size="lg" glitch>
            Connect Wallet
          </CyberButton>
        </motion.div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/30">
          Overview
        </TabsTrigger>
        <TabsTrigger value="investments" className="data-[state=active]:bg-purple-900/30">
          Investments
        </TabsTrigger>
        <TabsTrigger value="referrals" className="data-[state=active]:bg-purple-900/30">
          Referrals
        </TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-900/30">
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WalletOverview />
          <RankDisplay />
          <RealTimeEarnings />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvestmentPools />
          <TokenomicsVisual />
        </div>
      </TabsContent>

      <TabsContent value="investments" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <InvestmentPools expanded />
          </div>
          <PoolQualificationCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RealTimeEarnings expanded />
          <ShareableStats />
        </div>
      </TabsContent>

      <TabsContent value="referrals" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ReferralSystem />
          </div>
          <ShareableStats />
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TokenomicsVisual expanded />
          <RealTimeEarnings expanded />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PoolQualificationCard expanded />
          <ShareableStats />
        </div>
      </TabsContent>
    </Tabs>
  )
}
