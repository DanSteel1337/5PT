"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"]

const tokenomicsData = [
  { name: "Liquidity Pool", value: 30, description: "Ensures trading liquidity" },
  { name: "Staking Rewards", value: 25, description: "Distributed to stakers" },
  { name: "Development", value: 15, description: "Platform development" },
  { name: "Team", value: 10, description: "Team allocation" },
  { name: "Marketing", value: 10, description: "Marketing efforts" },
  { name: "Reserve", value: 10, description: "Strategic reserve" },
]

export function TokenomicsVisual() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-900/60 p-6 backdrop-blur-sm">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

      <h3 className="mb-4 text-xl font-semibold text-white">5PT Tokenomics</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="space-y-4">
            <p className="text-gray-300">
              The 5PT token distribution is designed to ensure long-term sustainability and growth.
            </p>

            <div className="space-y-2">
              {tokenomicsData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm text-gray-300">{item.name}</span>
                    <span className="text-sm font-medium text-white">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-sm font-medium text-white">Total Supply</div>
              <div className="mt-1 text-2xl font-bold text-white">100,000,000 5PT</div>
              <div className="mt-1 text-xs text-gray-400">Deflationary mechanism: 2% of each transaction is burned</div>
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ChartContainer
            config={{
              tokenomics: {
                label: "Tokenomics",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenomicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex !== null ? [activeIndex] : undefined}
                >
                  {tokenomicsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0, 0, 0, 0.3)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
