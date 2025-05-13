"use client"

import { motion } from "framer-motion"

interface PageLoadingProps {
  size?: "sm" | "md" | "lg"
  color?: string
}

export function PageLoading({ size = "md", color = "purple" }: PageLoadingProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const colorMap = {
    purple: "border-purple-500",
    blue: "border-blue-500",
    cyan: "border-cyan-500",
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className={`${sizeMap[size]} border-4 ${colorMap[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

export default PageLoading
