"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Droplets, Clock, TrendingUp, Users, BarChart3, Loader2 } from "lucide-react"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { InvestmentForm } from "@/components/pools/InvestmentForm"
import { formatCurrency, formatPercentage, formatDuration } from "@/lib/format"

interface PoolDetailProps {
  poolId: string
}

export function PoolDetail({ poolId }: PoolDetailProps) {
  const [mounted, setMounted] = useState(false)
  const { usePoolDetails, formatPoolData } = useInvestmentManager()

  const parsedPoolId = BigInt(poolId)
  const { data: pool, isLoading, isError } = usePoolDetails(parsedPoolId)

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

  if (isError || !pool) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading pool details. Please try again later.</p>
      </div>
    )
  }

  const formattedPool = formatPoolData(pool)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="glass border-border/40">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{pool.name}</CardTitle>
                <CardDescription className="mt-1">{pool.description}</CardDescription>
              </div>
              {pool.isActive ? (
                <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
              ) : (
                <Badge variant="outline">Closed</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-4 w-4" /> Total Value Locked
                </span>
                <span className="font-medium text-lg">{formatCurrency(formattedPool.totalValueLockedFormatted)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> APY
                </span>
                <span className="font-medium text-lg text-green-500">
                  {formatPercentage(formattedPool.apyFormatted)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Lock Period
                </span>
                <span className="font-medium text-lg">{formatDuration(formattedPool.lockPeriodDays)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" /> Min Investment
                </span>
                <span className="font-medium text-lg">{formatCurrency(formattedPool.minInvestmentFormatted)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Pool Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Investment Strategy</h4>
                  <p className="text-muted-foreground">
                    This pool focuses on generating yield through a diversified portfolio of DeFi protocols on the
                    Binance Smart Chain. The strategy includes lending, liquidity provision, and yield farming to
                    maximize returns while managing risk.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Risk Level</h4>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-yellow-500 h-2.5 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Key Benefits</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Professional management of your assets</li>
                    <li>Diversified exposure to multiple DeFi protocols</li>
                    <li>Automated compounding of rewards</li>
                    <li>Lower gas costs through pooled transactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance" className="mt-4">
            <Card className="glass border-border/40">
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center border border-border/40 rounded-md">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-8 w-8" />
                    <p>Performance chart will be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Past 7 Days</span>
                    <span className="font-medium text-green-500">+2.1%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Past 30 Days</span>
                    <span className="font-medium text-green-500">+8.5%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Since Inception</span>
                    <span className="font-medium text-green-500">+42.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <InvestmentForm pool={pool} />
      </div>
    </div>
  )
}
