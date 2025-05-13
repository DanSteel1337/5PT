"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface ContentCardProps {
  children: ReactNode
  className?: string
}

export function ContentCard({ children, className = "" }: ContentCardProps) {
  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{
        borderColor: "rgba(139, 92, 246, 0.3)",
      }}
    >
      {children}
    </motion.div>
  )
}
