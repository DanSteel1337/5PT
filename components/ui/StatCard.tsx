import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  trend?: number | null
  subValue?: ReactNode
  className?: string
  valueClassName?: string
  isLoading?: boolean
}

/**
 * StatCard component for displaying statistics in a consistent format
 * Handles loading states and null values gracefully
 */
export function StatCard({
  label,
  value,
  icon,
  trend,
  subValue,
  className,
  valueClassName,
  isLoading = false,
}: StatCardProps) {
  return (
    <div className={cn("glass-card-purple rounded-xl p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-32 bg-purple-900/30 animate-pulse rounded"></div>
          ) : (
            <p className={cn("text-3xl font-bold text-gradient", valueClassName)}>{value}</p>
          )}
          {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        </div>
        {icon && <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">{icon}</div>}
      </div>

      {trend !== undefined && trend !== null && (
        <div className="mt-2">
          <div className="flex items-center">
            <span className={cn("text-sm font-medium", trend >= 0 ? "text-green-400" : "text-red-400")}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
