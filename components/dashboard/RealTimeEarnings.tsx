"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { contracts } from "@/lib/contracts"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CyberButton } from "@/components/ui/cyber-button"

interface RealTimeEarningsProps {
  address?: `0x${string}`
}

export function RealTimeEarnings({ address }: RealTimeEarningsProps) {
  const [mounted, setMounted] = useState(false)
  const [earningsData, setEarningsData] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)

    // Generate mock historical data
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        earnings: Math.floor(Math.random() * 1000) + 500,
        cumulative: 0, // Will calculate below
      }
    })

    // Calculate cumulative earnings
    let cumulativeSum = 0
    mockData.forEach((item) => {
      cumulativeSum += item.earnings
      item.cumulative = cumulativeSum
    })

    setEarningsData(mockData)
  }, [])

  const { data: pendingRewards } = useReadContract({
    address: contracts.investmentManager.address as `0x${string}`,
    abi: contracts.investmentManager.abi,
    functionName: "getPendingRewards",
    args: [address],
    query: {
      enabled: mounted && !!address,
      staleTime: 10000,
    },
  })

  if (!mounted) return null

  const formattedPendingRewards = pendingRewards
    ? Number.parseFloat(formatUnits(pendingRewards as bigint, 18)).toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "0"

  // Calculate some stats
  const totalEarned = earningsData.length > 0 ? earningsData[earningsData.length - 1].cumulative : 0

  const dailyAverage = earningsData.length > 0 ? (totalEarned / earningsData.length).toFixed(2) : 0

  const projectedMonthly = (Number.parseFloat(dailyAverage) * 30).toFixed(2)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/20 p-6 backdrop-blur-sm">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl filter" />

          <div className="text-sm text-gray-400">Pending Rewards</div>
          <div className="mt-1 text-2xl font-bold text-white">{formattedPendingRewards}</div>
          <div className="mt-1 text-xs text-gray-400">5PT Tokens</div>

          <div className="mt-4">
            <CyberButton size="sm" className="w-full">
              Claim Rewards
            </CyberButton>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 p-6 backdrop-blur-sm">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl filter" />

          <div className="text-sm text-gray-400">Total Earned</div>
          <div className="mt-1 text-2xl font-bold text-white">{totalEarned.toLocaleString()}</div>
          <div className="mt-1 text-xs text-gray-400">5PT Tokens</div>

          <div className="mt-4 rounded-lg bg-gray-800/50 p-2 text-center text-xs text-gray-300">Lifetime earnings</div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/40 to-violet-900/20 p-6 backdrop-blur-sm">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl filter" />

          <div className="text-sm text-gray-400">Daily Average</div>
          <div className="mt-1 text-2xl font-bold text-white">{Number.parseFloat(dailyAverage).toLocaleString()}</div>
          <div className="mt-1 text-xs text-gray-400">5PT Tokens</div>

          <div className="mt-4 rounded-lg bg-gray-800/50 p-2 text-center text-xs text-gray-300">
            Based on 30-day history
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-900/40 to-purple-900/20 p-6 backdrop-blur-sm">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl filter" />

          <div className="text-sm text-gray-400">Projected Monthly</div>
          <div className="mt-1 text-2xl font-bold text-white">
            {Number.parseFloat(projectedMonthly).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-gray-400">5PT Tokens</div>

          <div className="mt-4 rounded-lg bg-gray-800/50 p-2 text-center text-xs text-gray-300">
            Based on current rate
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-900/60 p-6 backdrop-blur-sm">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

        <h3 className="mb-6 text-xl font-semibold text-white">Earnings History</h3>

        <div className="h-[400px]">
          <ChartContainer
            config={{
              earnings: {
                label: "Daily Earnings",
                color: "hsl(var(--chart-1))",
              },
              cumulative: {
                label: "Cumulative Earnings",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="var(--color-earnings)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="var(--color-cumulative)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="text-sm text-gray-400">Highest Daily</div>
            <div className="mt-1 text-xl font-bold text-white">
              {Math.max(...earningsData.map((d) => d.earnings)).toLocaleString()}
            </div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="text-sm text-gray-400">Lowest Daily</div>
            <div className="mt-1 text-xl font-bold text-white">
              {Math.min(...earningsData.map((d) => d.earnings)).toLocaleString()}
            </div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="text-sm text-gray-400">Growth Rate</div>
            <div className="mt-1 text-xl font-bold text-green-400">+12.5%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
