/**
 * @file app/dashboard/analytics/page.tsx
 * @description Dashboard analytics page
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * - This project does NOT use a dashboard layout file
 * - Each dashboard page MUST include the DashboardHeader component
 * - Each dashboard page MUST include the background gradient and container structure
 * - DO NOT create separate layout files for dashboard pages
 *
 * This component:
 * 1. Renders the DashboardHeader for navigation
 * 2. Displays analytics data and charts
 */

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/header"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Include DashboardHeader directly in the page */}
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <motion.h1
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Analytics Dashboard
          </motion.h1>

          {isLoading ? <AnalyticsSkeleton /> : <AnalyticsContent />}
        </div>
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.1 },
            }}
          >
            <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>

        <motion.div
          className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
        </motion.div>
      </div>
    </div>
  )
}

function AnalyticsContent() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-gray-200">Total Users</h3>
          <p className="text-3xl font-bold text-white mt-2">12,845</p>
          <p className="text-sm text-green-400 mt-1">+12.3% from last month</p>
        </motion.div>

        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-gray-200">Total Invested</h3>
          <p className="text-3xl font-bold text-white mt-2">$8.2M</p>
          <p className="text-sm text-green-400 mt-1">+8.7% from last month</p>
        </motion.div>

        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-gray-200">Active Pools</h3>
          <p className="text-3xl font-bold text-white mt-2">5</p>
          <p className="text-sm text-blue-400 mt-1">No change from last month</p>
        </motion.div>

        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-gray-200">Total Rewards</h3>
          <p className="text-3xl font-bold text-white mt-2">$1.4M</p>
          <p className="text-sm text-green-400 mt-1">+15.2% from last month</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-medium text-gray-200 mb-4">Investment Growth</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart placeholder - Investment growth over time</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-medium text-gray-200 mb-4">User Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart placeholder - User distribution by pool</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-medium text-gray-200 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3 font-medium">Transaction</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Pool</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 text-gray-300">0x8f...{i}e3f</td>
                  <td className="py-3 text-gray-300">${(Math.random() * 10000).toFixed(2)}</td>
                  <td className="py-3 text-gray-300">Pool {Math.floor(Math.random() * 5) + 1}</td>
                  <td className="py-3 text-gray-300">{Math.floor(Math.random() * 24)}h ago</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
