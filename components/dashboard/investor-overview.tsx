"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Trophy, Star, TrendingUp, Users } from "lucide-react"

export function InvestorOverview() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Get user rank
  const { data: userRank } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserRank",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user total deposits
  const { data: userTotalDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user referral bonus
  const { data: userReferralBonus } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralBonus",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user referral count
  const { data: userReferralCount } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const formattedDeposits = userTotalDeposits ? Number.parseFloat(formatUnits(userTotalDeposits, 18)) : 0
  const formattedReferralBonus = userReferralBonus ? Number.parseFloat(formatUnits(userReferralBonus, 18)) : 0
  const referralCount = userReferralCount ? Number(userReferralCount) : 0
  const rank = userRank ? Number(userRank) : 0

  // Get rank title based on rank number
  const getRankTitle = (rank: number) => {
    const titles = [
      "Novice Investor",
      "Bronze Investor",
      "Silver Investor",
      "Gold Investor",
      "Platinum Investor",
      "Diamond Investor",
      "Elite Investor",
      "Master Investor",
      "Legendary Investor",
    ]
    return titles[Math.min(rank, titles.length - 1)]
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <CyberCard variant="panel" glowing={true} scanline={true} className="relative overflow-hidden">
        <ParticleEffect count={15} colors={["#8B5CF6", "#6366F1", "#3B82F6"]} className="absolute inset-0" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-300">Investor Rank</h3>
                </div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span className="text-2xl font-bold">{rank}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                      {getRankTitle(rank)}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {rank < 8 ? `${8 - rank} more ranks to reach Legendary status` : "Maximum rank achieved!"}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-300">Investment Summary</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Your investment is growing steadily. Keep investing to unlock higher pools and increase your rewards.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-black/40 rounded-lg p-4 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" }}
              >
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-300">Total Invested</h3>
                </div>
                <p className="text-2xl font-bold">
                  <AnimatedCounter
                    value={formattedDeposits}
                    formatFn={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`}
                  />
                </p>
                <p className="text-xs text-gray-400">
                  ~${(formattedDeposits * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                </p>
              </motion.div>

              <motion.div
                className="bg-black/40 rounded-lg p-4 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" }}
              >
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-blue-400 mr-2" />
                  <h3 className="text-sm font-medium text-gray-300">Referral Network</h3>
                </div>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={referralCount} formatFn={(val) => `${val.toLocaleString()} Partners`} />
                </p>
                <p className="text-xs text-gray-400">
                  <AnimatedCounter
                    value={formattedReferralBonus}
                    formatFn={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT Earned`}
                  />
                </p>
              </motion.div>

              <motion.div
                className="col-span-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-300">Rank Progress</h3>
                  <span className="text-xs text-purple-400">{Math.min(rank + 1, 8)}/8</span>
                </div>
                <div className="mt-2 h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((rank / 8) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {rank < 8
                    ? "Keep investing and growing your network to reach the next rank"
                    : "Congratulations! You've reached the highest rank"}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </CyberCard>
    </motion.div>
  )
}
