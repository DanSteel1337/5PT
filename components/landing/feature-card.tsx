"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { FeatureData } from "@/types/features"

interface FeatureCardProps {
  feature: FeatureData
  index: number
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div className="group relative" variants={cardVariants}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl transform scale-[0.98] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>

      <div className="relative bg-black/40 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/50 rounded-xl p-8 overflow-hidden transition-all duration-300 h-full">
        {/* Glowing corner effect */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center mb-6 text-purple-400 shadow-lg shadow-purple-900/20"
          whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
        >
          {feature.icon}
        </motion.div>

        {/* Content */}
        <motion.div variants={contentVariants}>
          <motion.h3
            className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
            variants={itemVariants}
          >
            {feature.title}
          </motion.h3>

          <motion.p className="text-gray-200 mb-6" variants={itemVariants}>
            {feature.description}
          </motion.p>

          <motion.ul className="space-y-3" variants={contentVariants}>
            {feature.points.map((point, i) => (
              <motion.li
                key={i}
                className="flex items-start text-sm text-gray-300 group-hover:text-white transition-colors"
                variants={itemVariants}
              >
                <ChevronRight className="h-4 w-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Bottom border animation */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/70 to-blue-500/70 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
      </div>
    </motion.div>
  )
}

export default FeatureCard
