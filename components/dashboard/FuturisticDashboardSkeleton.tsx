"use client"

import { motion } from "framer-motion"

export function FuturisticDashboardSkeleton() {
  return (
    <div className="relative min-h-[80vh] rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-purple-500/20">
      <div className="absolute inset-0 bg-[url('/dashboard-grid.png')] opacity-20"></div>

      {/* Header skeleton */}
      <div className="p-6 border-b border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-24 bg-black/60 rounded-xl border border-purple-500/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Left panel skeleton */}
          <div className="space-y-6">
            {/* Gauges skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-32 bg-black/60 rounded-xl border border-purple-500/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
                />
              ))}
            </div>

            {/* Tabs skeleton */}
            <div className="h-10 w-full bg-black/60 rounded-lg" />

            {/* Main content skeleton */}
            <motion.div
              className="h-[400px] bg-black/60 rounded-xl border border-purple-500/20"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>

          {/* Right panel skeleton */}
          <div className="space-y-6">
            <motion.div
              className="h-[400px] bg-black/60 rounded-xl border border-purple-500/20"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />

            <motion.div
              className="h-[200px] bg-black/60 rounded-xl border border-purple-500/20"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.7 }}
            />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="p-4 border-t border-gray-800 bg-black/40">
        <div className="h-6 w-full bg-black/60 rounded-lg" />
      </div>

      {/* Animated scanner line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        animate={{
          y: ["0%", "2000%", "0%"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  )
}
