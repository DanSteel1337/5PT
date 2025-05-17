"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import React from "react"
import type { FeatureData } from "@/types/features"

interface FeatureCardProps {
  feature: FeatureData
  index: number
}

/**
 * Memoized FeatureCard component for better performance
 * Only re-renders when props actually change
 */
export const FeatureCard = React.memo(function FeatureCard({ feature, index }: FeatureCardProps) {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 group hover:border-purple-500/40 transition-all duration-300"
      style={{ willChange: "transform, opacity" }}
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
      <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:bg-purple-800/60 transition-colors duration-300">
        {feature.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>

      {/* Description */}
      <p className="text-gray-300 mb-4">{feature.description}</p>

      {/* Feature points */}
      <ul className="space-y-2">
        {feature.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-400">{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
})

export default FeatureCard
