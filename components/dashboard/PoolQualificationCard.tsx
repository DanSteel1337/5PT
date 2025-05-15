"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { POOL_CRITERIA } from "@/lib/contracts"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, AlertCircle, Info } from "lucide-react"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

export function PoolQualificationCard() {
  const { userTotalDeposits, userReferralCount, userDirectReferralVolume, tokenSymbol, poolEligibility } =
    useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [selectedPool, setSelectedPool] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Get the first 7 pools for display (excluding whitelist-only pools)
  const displayPools = POOL_CRITERIA.slice(0, 7)

  // Check if user qualifies for the selected pool
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

    const hasPersonalInvestment = userTotalDeposits >= personalInvestmentRequired
    const hasDirectRefs = userReferralCount >= directRefsRequired
    const hasDirectInvestment = userDirectReferralVolume >= directInvestmentRequired

    const qualified = hasPersonalInvestment && hasDirectInvestment && hasDirectRefs

    return {
      qualified,
      personalInvestment: hasPersonalInvestment,
      directInvestment: hasDirectInvestment,
      directRefs: hasDirectRefs,
      personalInvestmentRequired,
      directInvestmentRequired,
      directRefsRequired,
    }
  }

  const selectedPoolQualification = checkQualification(selectedPool)

  // Calculate progress percentages
  const calculateProgress = (current: number, required: number) => {
    if (required === 0) return 100
    const progress = (current / required) * 100
    return Math.min(progress, 100)
  }

  const personalInvestmentProgress = calculateProgress(
    userTotalDeposits,
    selectedPoolQualification.personalInvestmentRequired || 1,
  )

  const directRefsProgress = calculateProgress(userReferralCount, selectedPoolQualification.directRefsRequired || 1)

  const directInvestmentProgress = calculateProgress(
    userDirectReferralVolume,
    selectedPoolQualification.directInvestmentRequired || 1,
  )

  return (
    <TooltipProvider>
      <Card className="glass-card-purple p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gradient">Pool Qualification</h3>
          <Tooltip content="Qualifying for higher pools increases your daily rewards">
            <Info className="h-5 w-5 text-purple-400 cursor-help" />
          </Tooltip>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {displayPools.map((pool, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg text-center transition-all ${
                selectedPool === index
                  ? "bg-purple-900/50 border border-purple-500/50"
                  : "bg-black/30 hover:bg-purple-900/30"
              } ${poolEligibility?.[index] ? "border-green-500/30" : ""}`}
              onClick={() => setSelectedPool(index)}
            >
              <span className="text-sm font-medium">Pool {index + 1}</span>
              {poolEligibility?.[index] && <Check className="h-3 w-3 mx-auto mt-1 text-green-400" />}
            </button>
          ))}
        </div>

        <div className="bg-black/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Pool {selectedPool + 1} Requirements</h4>
            <div
              className={`px-3 py-1 rounded-full text-xs ${
                selectedPoolQualification.qualified
                  ? "bg-green-900/30 text-green-400"
                  : "bg-yellow-900/30 text-yellow-400"
              }`}
            >
              {selectedPoolQualification.qualified ? "Qualified" : "Not Qualified"}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  {selectedPoolQualification.personalInvestment ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-gray-300">Personal Investment</span>
                </div>
                <span className="font-medium">
                  {formatCrypto(selectedPoolQualification.personalInvestmentRequired || 0, tokenSymbol)}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    selectedPoolQualification.personalInvestment ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  style={{ width: `${personalInvestmentProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Current: {formatCrypto(userTotalDeposits, tokenSymbol)}</span>
                <span className="text-xs text-gray-500">
                  {personalInvestmentProgress < 100
                    ? `${formatNumber(personalInvestmentProgress, 0)}% Complete`
                    : "Completed"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  {selectedPoolQualification.directRefs ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-gray-300">Direct Referrals</span>
                </div>
                <span className="font-medium">{selectedPoolQualification.directRefsRequired}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPoolQualification.directRefs ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ width: `${directRefsProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Current: {userReferralCount}</span>
                <span className="text-xs text-gray-500">
                  {directRefsProgress < 100 ? `${formatNumber(directRefsProgress, 0)}% Complete` : "Completed"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  {selectedPoolQualification.directInvestment ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-gray-300">Direct Referral Volume</span>
                </div>
                <span className="font-medium">
                  {formatCrypto(selectedPoolQualification.directInvestmentRequired || 0, tokenSymbol)}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedPoolQualification.directInvestment ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ width: `${directInvestmentProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">
                  Current: {formatCrypto(userDirectReferralVolume, tokenSymbol)}
                </span>
                <span className="text-xs text-gray-500">
                  {directInvestmentProgress < 100
                    ? `${formatNumber(directInvestmentProgress, 0)}% Complete`
                    : "Completed"}
                </span>
              </div>
            </div>

            <div className="h-px bg-purple-900/30 my-3"></div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily Reward Share</span>
              <span className="font-medium text-purple-400">{POOL_CRITERIA[selectedPool].share / 10000}%</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Qualifying for higher pools increases your daily rewards and unlocks additional benefits
          </p>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium"
          >
            Upgrade Your Investment Today
          </motion.div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
