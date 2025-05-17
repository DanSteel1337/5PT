/**
 * PageLoading Component
 *
 * A customizable loading spinner with animation.
 * This component provides a visual indicator for loading states with size and color options.
 */

"use client"

import { motion } from "framer-motion"

/**
 * Props for the PageLoading component
 */
interface PageLoadingProps {
  size?: "sm" | "md" | "lg"
  color?: string
}

/**
 * PageLoading Component
 *
 * Renders an animated loading spinner with customizable size and color.
 */
export function PageLoading({ size = "md", color = "purple" }: PageLoadingProps) {
  // Size mapping for different spinner sizes
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  // Color mapping for different spinner colors
  const colorMap = {
    purple: "border-purple-500",
    blue: "border-blue-500",
    cyan: "border-cyan-500",
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]" role="status" aria-label="Loading">
      <motion.div
        className={`${sizeMap[size]} border-4 ${colorMap[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

export default PageLoading
