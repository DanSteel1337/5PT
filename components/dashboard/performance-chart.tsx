"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for the chart
const generateChartData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate some random data with an upward trend
    const baseValue = 1000 + Math.random() * 100
    const growthFactor = 1 + (days - i) * 0.01

    data.push({
      date: date.toISOString().split("T")[0],
      value: baseValue * growthFactor,
      rewards: baseValue * growthFactor * 0.05 + Math.random() * 20,
    })
  }

  return data
}

const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "All", days: 730 },
]

export function PerformanceChart() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[1])
  const chartData = generateChartData(selectedRange.days)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.6,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
      <h2 className="text-2xl font-bold mb-6 gold-gradient-text">Performance</h2>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-200">Portfolio Growth</h3>

          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.label}
                variant={selectedRange.label === range.label ? "default" : "outline"}
                size="sm"
                className={
                  selectedRange.label === range.label
                    ? "bg-gold text-black hover:bg-gold-light"
                    : "border-gold/30 hover:bg-gold/10 text-gold"
                }
                onClick={() => setSelectedRange(range)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ChartContainer
            config={{
              value: {
                label: "Portfolio Value",
                color: "hsl(var(--gold))",
              },
              rewards: {
                label: "Rewards",
                color: "hsl(var(--gold-light))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(212, 175, 55, 0.5)"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis stroke="rgba(212, 175, 55, 0.5)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#d4af37" }}
                />
                <Line
                  type="monotone"
                  dataKey="rewards"
                  stroke="var(--color-rewards)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#f5d76e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </GlassCard>
    </motion.div>
  )
}
