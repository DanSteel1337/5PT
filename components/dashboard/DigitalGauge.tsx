"use client"

import { motion } from "framer-motion"
import { formatCrypto, formatPercent } from "@/lib/utils"

interface DigitalGaugeProps {
  title: string
  value: number
  maxValue: number
  symbol: string
  percentage: number
  color: "green" | "blue" | "purple" | "red"
}

export function DigitalGauge({ title, value, maxValue, symbol, percentage, color }: DigitalGaugeProps) {
  // Calculate the fill percentage (capped at 100%)
  const fillPercentage = Math.min(100, (value / maxValue) * 100 || 0)

  // Color mapping
  const colorMap = {
    green: {
      bg: "bg-green-500/20",
      border: "border-green-500/40",
      text: "text-green-400",
      fill: "bg-green-500",
    },
    blue: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/40",
      text: "text-blue-400",
      fill: "bg-blue-500",
    },
    purple: {
      bg: "bg-purple-500/20",
      border: "border-purple-500/40",
      text: "text-purple-400",
      fill: "bg-purple-500",
    },
    red: {
      bg: "bg-red-500/20",
      border: "border-red-500/40",
      text: "text-red-400",
      fill: "bg-red-500",
    },
  }

  const colors = colorMap[color]

  return (
    <div className={`rounded-xl ${colors.bg} border ${colors.border} p-4 relative overflow-hidden`}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('/dashboard-grid.png')] opacity-10"></div>

      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>

      {/* Digital display */}
      <div className="bg-black/60 rounded-lg p-2 mb-3 border border-gray-800">
        <div className={`text-2xl font-mono font-bold ${colors.text}`}>{formatCrypto(value, symbol)}</div>
      </div>

      {/* Gauge bar */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`h-full ${colors.fill}`}
          initial={{ width: 0 }}
          animate={{ width: `${fillPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Percentage display */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">Rate</span>
        <span className={colors.text}>{formatPercent(percentage)}</span>
      </div>
    </div>
  )
}
