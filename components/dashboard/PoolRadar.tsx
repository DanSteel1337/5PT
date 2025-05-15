"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { POOL_CRITERIA } from "@/lib/contracts"
import { formatCrypto, formatNumber } from "@/lib/utils"

interface PoolRadarProps {
  poolEligibility: boolean[]
  userTotalDeposits: number
  userReferralCount: number
  userDirectReferralVolume: number
  tokenSymbol: string
}

export function PoolRadar({
  poolEligibility,
  userTotalDeposits,
  userReferralCount,
  userDirectReferralVolume,
  tokenSymbol,
}: PoolRadarProps) {
  const [selectedPool, setSelectedPool] = useState(0)

  // Get the selected pool data
  const selectedPoolData = POOL_CRITERIA[selectedPool]

  // Check qualification for a specific pool
  const checkQualification = (poolId: number) => {
    const pool = POOL_CRITERIA[poolId]

    // Handle whitelist pools
    if (pool.personalInvestment === "Whitelist") {
      return { qualified: poolEligibility?.[poolId] || false, message: "Whitelist only" }
    }

    const personalInvestmentRequired =
      typeof pool.personalInvestment === "string" ? 0 : Number(pool.personalInvestment) / 10 ** 18

    const directInvestmentRequired =
      typeof pool.directInvestment === "string" ? 0 : Number(pool.directInvestment) / 10 ** 18

    const directRefsRequired = typeof pool.directRefs === "string" ? 0 : pool.directRefs

    // Check qualification criteria
    const hasPersonalInvestment = userTotalDeposits >= personalInvestmentRequired
    const hasDirectInvestment = userDirectReferralVolume >= directInvestmentRequired
    const hasDirectRefs = userReferralCount >= directRefsRequired

    // Overall qualification
    const qualified = hasPersonalInvestment && hasDirectInvestment && hasDirectRefs

    // Generate message
    let message = ""
    if (!hasPersonalInvestment) {
      message += `Need ${formatNumber(personalInvestmentRequired - userTotalDeposits)} more ${tokenSymbol}. `
    }
    if (!hasDirectInvestment) {
      message += `Need ${formatNumber(directInvestmentRequired - userDirectReferralVolume)} more direct referral volume. `
    }
    if (!hasDirectRefs) {
      message += `Need ${directRefsRequired - userReferralCount} more direct referrals. `
    }

    return { qualified, message: message || "Qualified" }
  }

  return (
    <motion.div
      className="glass-card-purple rounded-xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gradient mb-6">Investment Pool Radar</h3>

      <div className="relative h-64 mb-6">
        {/* Radar background */}
        <div className="absolute inset-0 rounded-full border border-gray-800"></div>
        <div className="absolute inset-[15%] rounded-full border border-gray-800"></div>
        <div className="absolute inset-[30%] rounded-full border border-gray-800"></div>
        <div className="absolute inset-[45%] rounded-full border border-gray-800"></div>
        <div className="absolute inset-[60%] rounded-full border border-gray-800"></div>
        <div className="absolute inset-[75%] rounded-full border border-gray-800"></div>

        {/* Radar scan animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-[50%] bg-purple-500/50 origin-bottom"
          style={{ translateX: "-50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-3 h-3 -ml-1 -mt-1 rounded-full bg-purple-500"></div>
        </motion.div>

        {/* Pool dots */}
        {POOL_CRITERIA.slice(0, 7).map((pool, index) => {
          const angle = (index * (360 / 7) * Math.PI) / 180
          const distance = 0.8 // Distance from center (0-1)
          const x = Math.cos(angle) * distance * 50 + 50
          const y = Math.sin(angle) * distance * 50 + 50
          const { qualified } = checkQualification(pool.id)

          return (
            <motion.div
              key={pool.id}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer
                ${qualified ? "bg-green-500" : "bg-gray-700"} 
                hover:scale-125 transition-transform`}
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              onClick={() => setSelectedPool(pool.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {pool.id + 1}
            </motion.div>
          )
        })}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-purple-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Selected pool details */}
      {selectedPoolData && (
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Pool {selectedPoolData.id + 1}</h4>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium
              ${poolEligibility[selectedPoolData.id] ? "bg-green-500/20 text-green-400" : "bg-gray-700/20 text-gray-400"}`}
            >
              {poolEligibility[selectedPoolData.id] ? "Qualified" : "Not Qualified"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-black/20 rounded p-3">
              <p className="text-xs text-gray-400 mb-1">Personal Investment</p>
              <p className="font-medium">
                {typeof selectedPoolData.personalInvestment === "string"
                  ? selectedPoolData.personalInvestment
                  : formatCrypto(Number(selectedPoolData.personalInvestment) / 10 ** 18, tokenSymbol)}
              </p>
            </div>

            <div className="bg-black/20 rounded p-3">
              <p className="text-xs text-gray-400 mb-1">Direct Referral Volume</p>
              <p className="font-medium">
                {typeof selectedPoolData.directInvestment === "string"
                  ? selectedPoolData.directInvestment
                  : formatCrypto(Number(selectedPoolData.directInvestment) / 10 ** 18, tokenSymbol)}
              </p>
            </div>

            <div className="bg-black/20 rounded p-3">
              <p className="text-xs text-gray-400 mb-1">Direct Referrals</p>
              <p className="font-medium">{selectedPoolData.directRefs}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Daily Reward Rate</p>
              <p className="font-medium text-green-400">{selectedPoolData.share / 10000}%</p>
            </div>

            {!poolEligibility[selectedPoolData.id] && (
              <p className="text-xs text-gray-400 max-w-xs text-right">
                {checkQualification(selectedPoolData.id).message}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
