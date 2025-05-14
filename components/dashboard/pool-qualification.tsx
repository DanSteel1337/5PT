"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { GlowCard } from "@/components/ui/glow-card"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES, POOL_CRITERIA } from "@/lib/contracts"
import { Check, X, Info, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PoolQualification() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [poolEligibility, setPoolEligibility] = useState<boolean[]>([])

  // Get user total deposits
  const { data: userTotalDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address as `0x${string}`],
    enabled: !!address && mounted,
  })

  // Get user referral count
  const { data: userReferralCount } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address as `0x${string}`],
    enabled: !!address && mounted,
  })

  // Get investor info
  const { data: investorInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "accountToInvestorInfo",
    args: [address as `0x${string}`],
    enabled: !!address && mounted,
  })

  // Check pool eligibility directly using contract data
  useEffect(() => {
    if (!address || !mounted || !userTotalDeposits || !userReferralCount || !investorInfo) return

    const formattedDeposits = Number.parseFloat(formatUnits(userTotalDeposits, 18))
    const referralCount = Number(userReferralCount)
    const totalReferralDeposit = Number.parseFloat(formatUnits(investorInfo[1], 18))

    // Calculate eligibility for each pool based on contract data
    const eligibility = POOL_CRITERIA.map((pool) => {
      // Skip whitelist pools (7 and 8) - these require special handling
      if (pool.id > 6) return false

      const personalInvestmentMet =
        typeof pool.personalInvestment === "string" ? false : formattedDeposits >= pool.personalInvestment / 10 ** 18

      const directRefsMet = typeof pool.directRefs === "string" ? false : referralCount >= pool.directRefs

      const directInvestmentMet =
        typeof pool.directInvestment === "string" ? false : totalReferralDeposit >= pool.directInvestment / 10 ** 18

      // User is eligible if they meet all criteria
      return personalInvestmentMet && directRefsMet && directInvestmentMet
    })

    setPoolEligibility(eligibility)
  }, [address, userTotalDeposits, userReferralCount, investorInfo, mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const formattedDeposits = userTotalDeposits ? Number.parseFloat(formatUnits(userTotalDeposits, 18)) : 0
  const referralCount = userReferralCount ? Number(userReferralCount) : 0
  const totalReferralDeposit = investorInfo ? Number.parseFloat(formatUnits(investorInfo[1], 18)) : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
      <CyberCard variant="panel" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pool Qualification Status</h2>
            <p className="text-gray-400">Qualify for higher pools to increase your daily rewards</p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mt-2 md:mt-0 flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  <Info className="h-4 w-4 mr-1" />
                  How Pools Work
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Each pool has specific requirements for personal investment, direct referrals, and total referral
                  volume. Meeting these requirements qualifies you for additional daily rewards from the pool.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POOL_CRITERIA.map((pool, index) => {
            // Skip rendering whitelist pools if not eligible
            if (pool.id > 6 && !poolEligibility[pool.id]) return null

            const isEligible = poolEligibility[pool.id] || false
            const personalInvestmentMet =
              typeof pool.personalInvestment === "string"
                ? false
                : formattedDeposits >= pool.personalInvestment / 10 ** 18
            const directRefsMet = typeof pool.directRefs === "string" ? false : referralCount >= pool.directRefs
            const directInvestmentMet =
              typeof pool.directInvestment === "string"
                ? false
                : totalReferralDeposit >= pool.directInvestment / 10 ** 18

            return (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
              >
                <GlowCard
                  glowColor={isEligible ? "rgba(139, 92, 246, 0.5)" : "rgba(75, 85, 99, 0.3)"}
                  intensity={isEligible ? "high" : "low"}
                  className={`h-full p-5 ${isEligible ? "border-purple-500/30" : "border-gray-700/30"}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${isEligible ? "text-white" : "text-gray-400"}`}>
                        Pool {pool.id + 1}
                      </h3>
                      <p className="text-xs text-gray-500">{isEligible ? "Qualified" : "Not Qualified"}</p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isEligible
                          ? "bg-purple-900/50 text-purple-400 border border-purple-500/50"
                          : "bg-gray-800/50 text-gray-500 border border-gray-700/50"
                      }`}
                    >
                      {isEligible ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                            personalInvestmentMet ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                          }`}
                        >
                          {personalInvestmentMet ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-sm text-gray-400">Personal Investment</span>
                      </div>
                      <span className={`text-sm ${personalInvestmentMet ? "text-green-400" : "text-red-400"}`}>
                        {typeof pool.personalInvestment === "string"
                          ? pool.personalInvestment
                          : `${(pool.personalInvestment / 10 ** 18).toLocaleString()} 5PT`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                            directRefsMet ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                          }`}
                        >
                          {directRefsMet ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-sm text-gray-400">Direct Referrals</span>
                      </div>
                      <span className={`text-sm ${directRefsMet ? "text-green-400" : "text-red-400"}`}>
                        {pool.directRefs}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                            directInvestmentMet ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                          }`}
                        >
                          {directInvestmentMet ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-sm text-gray-400">Referral Volume</span>
                      </div>
                      <span className={`text-sm ${directInvestmentMet ? "text-green-400" : "text-red-400"}`}>
                        {typeof pool.directInvestment === "string"
                          ? pool.directInvestment
                          : `${(pool.directInvestment / 10 ** 18).toLocaleString()} 5PT`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-400">Daily Pool Share</p>
                    <p className={`text-xl font-bold ${isEligible ? "text-purple-400" : "text-gray-500"}`}>
                      {pool.share / 10000}%
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            )
          })}
        </div>
      </CyberCard>
    </motion.div>
  )
}
