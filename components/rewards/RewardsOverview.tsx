"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, Clock, Loader2 } from "lucide-react"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { useFivePillarsToken } from "@/hooks/useFivePillarsToken"
import { formatUnits } from "viem"
import { formatCurrency } from "@/lib/format"

export function RewardsOverview() {
  const [mounted, setMounted] = useState(false)
  const { useInvestorInfo } = useInvestmentManager()
  const { useTokenInfo } = useFivePillarsToken()

  const { data: investorInfo, isLoading, isError } = useInvestorInfo()
  const { data: tokenInfo } = useTokenInfo()

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !investorInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading rewards data. Please try again later.</p>
      </div>
    )
  }

  // Format rewards data
  const pendingRewards = investorInfo.pendingRewards
  const formattedRewards = formatUnits(pendingRewards, tokenInfo?.decimals || 18)
  const rewardsInUsd = Number.parseFloat(formattedRewards) * 1.25 // Assuming 1 5PT = $1.25 USD

  return (
    <div className="space-y-6">
      <Card className="glass border-border/40 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Rewards Overview</CardTitle>
          <CardDescription>Your current rewards and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
              <Award className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-sm text-muted-foreground">Pending Rewards</h3>
              <p className="text-2xl font-bold mt-1">{Number.parseFloat(formattedRewards).toFixed(4)} 5PT</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(rewardsInUsd)}</p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="text-sm text-muted-foreground">Estimated Daily</h3>
              <p className="text-2xl font-bold mt-1">0.0125 5PT</p>
              <p className="text-sm text-muted-foreground">$0.0156 USD</p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-900/20 to-green-900/20 rounded-lg border border-cyan-500/20">
              <Clock className="h-8 w-8 text-cyan-400 mb-2" />
              <h3 className="text-sm text-muted-foreground">Next Distribution</h3>
              <p className="text-2xl font-bold mt-1">12:00 UTC</p>
              <p className="text-sm text-muted-foreground">Daily rewards cycle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Daily Rewards</CardTitle>
              <CardDescription>Your rewards over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center border border-border/40 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-8 w-8" />
                  <p>Daily rewards chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Weekly Rewards</CardTitle>
              <CardDescription>Your rewards over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center border border-border/40 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-8 w-8" />
                  <p>Weekly rewards chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card className="glass border-border/40">
            <CardHeader>
              <CardTitle>Monthly Rewards</CardTitle>
              <CardDescription>Your rewards over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center border border-border/40 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-8 w-8" />
                  <p>Monthly rewards chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
