"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StatCardProps {
  value: string | number
  label: string
  icon?: ReactNode
  className?: string
  animated?: boolean
}

/**
 * StatCard component for displaying statistics
 */
export function StatCard({ value, label, icon, className = "", animated = true }: StatCardProps): JSX.Element {
  const Card = animated ? motion.div : "div"

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 group hover:border-purple-500/40 transition-all duration-300",
        className,
      )}
      {...(animated
        ? {
            whileHover: { y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" },
          }
        : {})}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      ></div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"
        aria-hidden="true"
      ></div>

      {/* Icon */}
      {icon && (
        <div className="absolute top-3 right-3 text-purple-400/70 group-hover:text-purple-400 transition-colors duration-300">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="pt-2">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors duration-300">
          {value}
        </div>
        <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">
          {label}
        </div>
      </div>
    </Card>
  )
}

export default StatCard
