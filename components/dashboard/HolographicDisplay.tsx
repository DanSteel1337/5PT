"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface HolographicDisplayProps {
  title: string
  value: string
  icon: ReactNode
  subValue?: string
  glowColor: "purple" | "blue" | "green" | "red"
}

export function HolographicDisplay({ title, value, icon, subValue, glowColor }: HolographicDisplayProps) {
  // Color mapping
  const colorMap = {
    purple: {
      glow: "after:bg-purple-500/20",
      border: "border-purple-500/30",
      text: "text-purple-400",
    },
    blue: {
      glow: "after:bg-blue-500/20",
      border: "border-blue-500/30",
      text: "text-blue-400",
    },
    green: {
      glow: "after:bg-green-500/20",
      border: "border-green-500/30",
      text: "text-green-400",
    },
    red: {
      glow: "after:bg-red-500/20",
      border: "border-red-500/30",
      text: "text-red-400",
    },
  }

  const colors = colorMap[glowColor]

  return (
    <motion.div
      className={`relative bg-black/60 backdrop-blur-sm rounded-xl border ${colors.border} p-4 overflow-hidden
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1/2 
        after:opacity-30 after:blur-xl ${colors.glow} after:rounded-full after:transform after:translate-y-1/2`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-gray-800">
          {icon}
        </div>
      </div>

      {/* Scan line animation */}
      <motion.div
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />
    </motion.div>
  )
}
