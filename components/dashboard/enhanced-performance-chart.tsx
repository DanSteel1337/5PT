"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowUpRight, TrendingUp, DollarSign, BarChart3 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Chart types
type ChartType = "line" | "area" | "bar"

// Time ranges
const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "All", days: 730 },
]

// Generate mock data for the chart
const generateChartData = (days: number) => {
  const data = []
  const now = new Date()

  // Base values that will be used to generate realistic looking data
  const baseValue = 1000
  const baseRewards = 50
  const baseVolume = 200

  // Volatility factors
  const valueFactor = 0.02
  const rewardsFactor = 0.05
  const volumeFactor = 0.1

  // Growth factors
  const valueGrowth = 0.005
  const rewardsGrowth = 0.008
  const volumeGrowth = 0.003

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Calculate growth with some randomness
    const dayFactor = 1 + (days - i) * valueGrowth
    const rewardsDayFactor = 1 + (days - i) * rewardsGrowth
    const volumeDayFactor = 1 + (days - i) * volumeGrowth

    // Add randomness
    const valueRandom = (Math.random() - 0.5) * valueFactor * baseValue
    const rewardsRandom = (Math.random() - 0.5) * rewardsFactor * baseRewards
    const volumeRandom = (Math.random() - 0.5) * volumeFactor * baseVolume

    // Calculate values with growth and randomness
    const value = baseValue * dayFactor + valueRandom
    const rewards = baseRewards * rewardsDayFactor + rewardsRandom
    const volume = baseVolume * volumeDayFactor + volumeRandom

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, value),
      rewards: Math.max(0, rewards),
      volume: Math.max(0, volume),
    })
  }

  return data
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-gold/30 p-3 rounded-lg shadow-lg">
        <p className="text-amber-300 font-medium mb-1">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.name.toLowerCase().includes("volume")
                ? formatCurrency(entry.value)
                : entry.name.toLowerCase().includes("rewards")
                  ? `${formatCurrency(entry.value)}`
                  : formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Stats card component
interface StatsCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

const StatsCard = ({ title, value, change, isPositive, icon }: StatsCardProps) => (
  <Card className="bg-black/40 border-gold/20 overflow-hidden">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-xl font-bold text-white mt-1">{value}</h3>
          <div className={cn("flex items-center text-xs mt-1", isPositive ? "text-green-400" : "text-red-400")}>
            <ArrowUpRight className={cn("h-3 w-3 mr-1", !isPositive && "rotate-180")} />
            <span>{change}</span>
          </div>
        </div>
        <div className="bg-gold/10 p-2 rounded-lg">{icon}</div>
      </div>
    </CardContent>
  </Card>
)

export function EnhancedPerformanceChart() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[1]) // Default to 1M
  const [chartType, setChartType] = useState<ChartType>("area")

  // Generate chart data based on selected range
  const chartData = useMemo(() => generateChartData(selectedRange.days), [selectedRange.days])

  // Calculate stats
  const currentValue = chartData[chartData.length - 1].value
  const previousValue = chartData[0].value
  const percentChange = ((currentValue - previousValue) / previousValue) * 100
  const isPositive = percentChange >= 0

  // Calculate rewards stats
  const currentRewards = chartData[chartData.length - 1].rewards
  const previousRewards = chartData[0].rewards
  const rewardsChange = ((currentRewards - previousRewards) / previousRewards) * 100
  const isRewardsPositive = rewardsChange >= 0

  // Calculate volume stats
  const currentVolume = chartData[chartData.length - 1].volume
  const previousVolume = chartData[0].volume
  const volumeChange = ((currentVolume - previousVolume) / previousVolume) * 100
  const isVolumePositive = volumeChange >= 0

  // Animation variants
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
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-300">Portfolio Performance</h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("border-gold/30 hover:bg-gold/10", chartType === "line" && "bg-gold/20 text-amber-300")}
            onClick={() => setChartType("line")}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("border-gold/30 hover:bg-gold/10", chartType === "area" && "bg-gold/20 text-amber-300")}
            onClick={() => setChartType("area")}
          >
            <TrendingUp className="h-4 w-4 mr-1 fill-current" />
            Area
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn("border-gold/30 hover:bg-gold/10", chartType === "bar" && "bg-gold/20 text-amber-300")}
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Bar
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Portfolio Value"
            value={formatCurrency(currentValue)}
            change={`${isPositive ? "+" : ""}${percentChange.toFixed(2)}%`}
            isPositive={isPositive}
            icon={<DollarSign className="h-5 w-5 text-amber-300" />}
          />
          <StatsCard
            title="Total Rewards"
            value={formatCurrency(currentRewards)}
            change={`${isRewardsPositive ? "+" : ""}${rewardsChange.toFixed(2)}%`}
            isPositive={isRewardsPositive}
            icon={<TrendingUp className="h-5 w-5 text-amber-300" />}
          />
          <StatsCard
            title="Trading Volume"
            value={formatCurrency(currentVolume)}
            change={`${isVolumePositive ? "+" : ""}${volumeChange.toFixed(2)}%`}
            isPositive={isVolumePositive}
            icon={<BarChart3 className="h-5 w-5 text-amber-300" />}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-black/40 border border-gold/20 rounded-xl p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-white">Portfolio Growth</h3>
            <p className="text-gray-400 text-sm">
              {formatDate(chartData[0].date)} - {formatDate(chartData[chartData.length - 1].date)}
            </p>
          </div>

          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.label}
                variant={selectedRange.label === range.label ? "default" : "outline"}
                size="sm"
                className={
                  selectedRange.label === range.label
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "border-gold/30 hover:bg-gold/10 text-amber-300"
                }
                onClick={() => setSelectedRange(range)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="mb-4 bg-black/60 border border-gold/20">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-gold/20 data-[state=active]:text-amber-300"
            >
              Portfolio Value
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-gold/20 data-[state=active]:text-amber-300">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="volume" className="data-[state=active]:bg-gold/20 data-[state=active]:text-amber-300">
              Volume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Portfolio Value"
                    stroke="#d4af37"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#d4af37", stroke: "#000" }}
                  />
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Portfolio Value"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, fill: "#d4af37", stroke: "#000" }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Portfolio Value" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="rewards" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5d76e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f5d76e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rewards"
                    name="Rewards"
                    stroke="#f5d76e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#f5d76e", stroke: "#000" }}
                  />
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f5d76e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f5d76e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rewards"
                    name="Rewards"
                    stroke="#f5d76e"
                    strokeWidth={2}
                    fill="url(#colorRewards)"
                    activeDot={{ r: 6, fill: "#f5d76e", stroke: "#000" }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rewards" name="Rewards" fill="#f5d76e" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="volume" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8860b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    name="Volume"
                    stroke="#b8860b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#b8860b", stroke: "#000" }}
                  />
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8860b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    name="Volume"
                    stroke="#b8860b"
                    strokeWidth={2}
                    fill="url(#colorVolume)"
                    activeDot={{ r: 6, fill: "#b8860b", stroke: "#000" }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={formatDate}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" name="Volume" fill="#b8860b" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
