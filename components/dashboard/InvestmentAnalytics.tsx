"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart } from "./charts/LineChart"
import { BarChart } from "./charts/BarChart"
import { PieChart } from "./charts/PieChart"
import { SoundEffects } from "@/lib/sound-effects"
import type { InvestmentData } from "@/types/investment"

interface InvestmentAnalyticsProps {
  investmentData?: InvestmentData
}

export function InvestmentAnalytics({ investmentData }: InvestmentAnalyticsProps) {
  const [timeframe, setTimeframe] = useState("1m") // 1d, 1w, 1m, 3m, 1y

  const handleTimeframeChange = (newTimeframe: string) => {
    SoundEffects.play("button-click", 0.2)
    setTimeframe(newTimeframe)
  }

  // Sample data for charts
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Investment Growth",
        data: [1000, 1500, 1300, 1700, 2100, 2500],
        color: "#8b5cf6",
      },
    ],
  }

  const barChartData = {
    labels: ["Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5"],
    datasets: [
      {
        label: "Rewards",
        data: [120, 80, 150, 60, 200],
        color: "#3b82f6",
      },
    ],
  }

  const pieChartData = {
    labels: ["Pool 1", "Pool 2", "Pool 3", "Pool 4", "Pool 5"],
    datasets: [
      {
        data: [30, 20, 25, 15, 10],
        backgroundColor: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4"],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-300">Investment Analytics</h2>

        <div className="flex bg-black/40 backdrop-blur-md rounded-lg border border-blue-500/30 overflow-hidden">
          {["1d", "1w", "1m", "3m", "1y"].map((option) => (
            <button
              key={option}
              className={`px-3 py-1 text-xs ${timeframe === option ? "bg-blue-900/50 text-blue-100" : "text-blue-400 hover:bg-blue-900/20"}`}
              onClick={() => handleTimeframeChange(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth chart */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-4">
          <h3 className="text-sm font-medium text-purple-300 mb-3">Investment Growth</h3>
          <div className="h-64">
            <LineChart data={lineChartData} />
          </div>
        </div>

        {/* Rewards by pool */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-blue-500/30 p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-3">Rewards by Pool</h3>
          <div className="h-64">
            <BarChart data={barChartData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-indigo-500/30 p-4">
          <h3 className="text-sm font-medium text-indigo-300 mb-3">Investment Distribution</h3>
          <div className="h-64">
            <PieChart data={pieChartData} />
          </div>
        </div>

        {/* Key metrics */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-4 lg:col-span-2">
          <h3 className="text-sm font-medium text-cyan-300 mb-3">Key Metrics</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-cyan-400 mb-1">Total Invested</div>
              <div className="text-xl font-bold">{investmentData?.totalInvested || 0} 5PT</div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-cyan-400 mb-1">Total Rewards</div>
              <div className="text-xl font-bold">{investmentData?.totalRewards || 0} 5PT</div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-cyan-400 mb-1">ROI</div>
              <div className="text-xl font-bold">+{investmentData?.roi || 0}%</div>
            </div>

            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-cyan-400 mb-1">Qualified Pools</div>
              <div className="text-xl font-bold">{investmentData?.qualifiedPools || 0}/5</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-medium text-cyan-300 mb-2">Projection</h4>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-cyan-400">Estimated Annual Yield</span>
                <span className="text-xs font-bold text-cyan-200">+{investmentData?.estimatedApy || 0}%</span>
              </div>
              <div className="w-full bg-cyan-900/30 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((investmentData?.estimatedApy || 0) / 2, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
