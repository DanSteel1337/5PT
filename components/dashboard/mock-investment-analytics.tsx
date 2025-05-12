"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, TrendingUp, Calendar, Coins, Clock, Award } from "lucide-react"

// Mock data for investment performance over time
const generatePerformanceData = (days: number, initialValue: number, growthRate: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    // Compound growth with some randomness
    const value = initialValue * Math.pow(1 + growthRate, i) * (1 + (Math.random() * 0.04 - 0.02))

    return {
      date: date.toISOString().split("T")[0],
      value: Number.parseFloat(value.toFixed(2)),
    }
  })
}

// Mock data for investment distribution
const investmentDistribution = [
  { name: "Pool A", value: 45 },
  { name: "Pool B", value: 30 },
  { name: "Pool C", value: 15 },
  { name: "Pool D", value: 10 },
]

export function MockInvestmentAnalytics() {
  const [activeTab, setActiveTab] = useState("performance")
  const [performanceData, setPerformanceData] = useState<any[]>([])

  // Generate performance data on component mount
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const data = generatePerformanceData(90, 1000, 0.005)
    setPerformanceData(data)
  }, [])

  // Mock investor stats
  const investorStats = {
    totalDeposit: 10000,
    totalRewards: 500,
    lastDepositTime: Date.now() / 1000 - 7 * 24 * 60 * 60, // 7 days ago
    lastClaimTime: Date.now() / 1000 - 3 * 24 * 60 * 60, // 3 days ago
  }

  // Calculate ROI
  const roi = investorStats.totalDeposit > 0 ? (investorStats.totalRewards / investorStats.totalDeposit) * 100 : 0

  // Mock APY
  const apy = 26.5

  // Format dates
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "N/A"
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Investment Analytics</CardTitle>
            <CardDescription>Detailed performance metrics and statistics</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            {apy.toFixed(2)}% APY
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Coins className="h-4 w-4 mr-1 text-purple-400" />
              Total Deposit
            </div>
            <div className="text-xl font-bold text-purple-300">
              {investorStats.totalDeposit.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT
            </div>
          </div>

          <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Award className="h-4 w-4 mr-1 text-purple-400" />
              Total Rewards
            </div>
            <div className="text-xl font-bold text-purple-300">
              {investorStats.totalRewards.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT
            </div>
          </div>

          <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4 mr-1 text-purple-400" />
              ROI
            </div>
            <div className="text-xl font-bold text-purple-300">{roi.toFixed(2)}%</div>
          </div>

          <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-1 text-purple-400" />
              Last Activity
            </div>
            <div className="text-xl font-bold text-purple-300">
              {formatDate(Math.max(investorStats.lastDepositTime, investorStats.lastClaimTime))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="distribution"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Distribution
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Market Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="h-[400px]">
            <ChartContainer
              config={{
                value: {
                  label: "Investment Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis tickFormatter={(value) => `${value.toLocaleString()} 5PT`} width={100} />
                  <Tooltip
                    content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()} 5PT`} />}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="distribution" className="h-[400px]">
            <ChartContainer
              config={{
                value: {
                  label: "Allocation",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                  <Legend />
                  <Bar dataKey="value" fill="var(--color-value)" name="Allocation %" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="comparison" className="h-[400px]">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <TrendingUp className="h-16 w-16 text-purple-400 mx-auto" />
                <h3 className="text-xl font-medium">Market Comparison</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Market comparison data will be available soon. This feature will allow you to compare your 5PT
                  investment performance against major cryptocurrencies and market indices.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Investment Metrics</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Annual Percentage Yield</div>
                    <div className="text-xs text-muted-foreground">Projected annual return</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-purple-300">{apy.toFixed(2)}%</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Lock Period</div>
                    <div className="text-xs text-muted-foreground">Required holding time</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-purple-300">30 days</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Coins className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Platform Fee</div>
                    <div className="text-xs text-muted-foreground">Fee on rewards</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-purple-300">2.5%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Benchmark Comparison</h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">5PT Performance</div>
                    <div className="text-xs text-muted-foreground">Your investment</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+{apy.toFixed(2)}%</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Bitcoin</div>
                    <div className="text-xs text-muted-foreground">Market benchmark</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+4.32%</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-4 w-4 text-red-400 rotate-180" />
                  </div>
                  <div>
                    <div className="font-medium">Ethereum</div>
                    <div className="text-xs text-muted-foreground">Market benchmark</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-400">-2.18%</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">DeFi Index</div>
                    <div className="text-xs text-muted-foreground">Market benchmark</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+1.75%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
