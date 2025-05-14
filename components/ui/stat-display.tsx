"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatDisplayProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string | number
    positive?: boolean
  }
  className?: string
  valueClassName?: string
  iconClassName?: string
}

export function StatDisplay({ title, value, icon, trend, className, valueClassName, iconClassName }: StatDisplayProps) {
  return (
    <motion.div
      className={cn("flex flex-col space-y-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {icon && <div className={cn("flex items-center justify-center rounded-lg p-2", iconClassName)}>{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
        {trend && (
          <div
            className={cn(
              "flex items-center space-x-1 text-xs font-medium",
              trend.positive ? "text-green-400" : "text-red-400",
            )}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
