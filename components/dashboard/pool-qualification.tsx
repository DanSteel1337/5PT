"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { CheckCircle, XCircle, TrendingUp, BarChart3 } from "lucide-react"
import { POOL_CRITERIA } from "@/lib/contracts"

export function PoolQualification() {
  const { poolQualifications, formattedTotalDeposits, nextPoolProgress, isLoading } = useInvestment()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.4,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-green-950/10 border border-green-500/30 p-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Pool Qualification</h2>
          <p className="text-green-300/70 text-sm">Your investment pool status and rewards</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-green-400" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {POOL_CRITERIA.slice(0, 5).map((pool, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`rounded-xl p-4 relative overflow-hidden ${
              poolQualifications[index]
                ? "bg-gradient-to-br from-green-900/20 to-green-800/5 border border-green-500/30"
                : "bg-gradient-to-br from-gray-900/20 to-gray-800/5 border border-gray-500/30"
            }`}
          >
            <div className="absolute top-3 right-3">
              {poolQualifications[index] ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Pool {index + 1}</h3>
            <p className={`text-xs ${poolQualifications[index] ? "text-green-300/70" : "text-gray-400/70"}`}>
              {poolQualifications[index] ? "Qualified" : "Not Qualified"}
            </p>

            <div className={`mt-3 text-xs ${poolQualifications[index] ? "text-green-300/70" : "text-gray-400/70"}`}>
              <div className="flex items-center justify-between mb-1">
                <span>Required:</span>
                <span>
                  {typeof pool.personalInvestment === "string"
                    ? pool.personalInvestment
                    : formatNumber(Number(pool.personalInvestment) / 1e18)}{" "}
                  5PT
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reward Share:</span>
                <span>{pool.share}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!poolQualifications.every(Boolean) && (
        <motion.div variants={item} className="bg-green-900/10 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-300">Next Pool Progress</h3>
            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {nextPoolProgress.toFixed(1)}% Complete
            </div>
          </div>

          <div className="h-2 bg-green-900/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
              style={{ width: `${nextPoolProgress}%` }}
            ></div>
          </div>

          <div className="text-xs text-green-300/70 flex items-center justify-between">
            <span>Current: {isLoading ? "..." : formatNumber(formattedTotalDeposits)} 5PT</span>
            <span>Next Pool: Pool {poolQualifications.filter(Boolean).length + 1}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
