"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Calendar, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { useFivePillarsToken } from "@/hooks/useFivePillarsToken"
import { formatUnits } from "viem"

// Mock data for earnings chart
const earningsData = {
  daily: [25, 30, 22, 28, 33, 38, 40],
  weekly: [180, 210, 190, 240, 220, 250, 270],
  monthly: [800, 950, 1100, 1000, 1200, 1300, 1400],
}

export function EarningsOverview() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("daily")
  const [isLoading, setIsLoading] = useState(true)
  const { useInvestorInfo } = useInvestmentManager()
  const { useTokenInfo } = useFivePillarsToken()

  const { data: investorInfo } = useInvestorInfo()
  const { data: tokenInfo } = useTokenInfo()

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // Format total earnings
  const totalEarnings = investorInfo?.pendingRewards || BigInt(0)
  const formattedEarnings = formatUnits(totalEarnings, tokenInfo?.decimals || 18)
  const earningsInUsd = Number.parseFloat(formattedEarnings) * 1.25 // Assuming 1 5PT = $1.25 USD

  // Get chart data based on active tab
  const chartData = earningsData[activeTab as keyof typeof earningsData]
  const maxValue = Math.max(...chartData)

  return (
    <Card className="glass-card overflow-hidden border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl">Earnings Overview</CardTitle>
        </div>
        <CardDescription>Track your investment performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm text-muted-foreground">Total Earnings</span>
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-3xl font-bold neon-text"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {Number.parseFloat(formattedEarnings).toFixed(4)} 5PT
              </motion.span>
              <span className="text-green-500">+12.5%</span>
            </div>
            <span className="text-muted-foreground">{formatCurrency(earningsInUsd)}</span>
          </motion.div>

          <motion.div
            className="flex flex-col md:items-end justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button className="btn-futuristic">
              Claim All Rewards <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground mt-2">Last claimed: 3 days ago</span>
          </motion.div>
        </div>

        <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-background/50 border border-purple-500/20">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="relative h-[200px] w-full">
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-[180px]">
                    {chartData.map((value, index) => (
                      <motion.div
                        key={index}
                        className="w-full bg-gradient-to-t from-purple-600 via-indigo-600 to-blue-600 rounded-t-sm mx-1 relative overflow-hidden"
                        style={{ height: `${(value / maxValue) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / maxValue) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ filter: "brightness(1.2)" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/10"
                          animate={{
                            y: ["100%", "-100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between px-1">
                    {chartData.map((_, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        {activeTab === "daily"
                          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]
                          : activeTab === "weekly"
                            ? `W${index + 1}`
                            : `M${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <span className="text-green-500 font-medium">
                  +{activeTab === "daily" ? "5.2" : activeTab === "weekly" ? "12.5" : "32.8"}%
                </span>{" "}
                vs previous {activeTab}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
