"use client"

import { useAccount } from "wagmi"
import { formatEther } from "ethers"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { usePoolInfo, useIsInvestorInPool } from "@/lib/hooks/use-investment-manager"
import { POOL_IDS } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export function ActiveInvestments() {
  const { address } = useAccount()

  const containerVariants = {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Active Investments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POOL_IDS.map((poolId) => (
          <PoolCard key={poolId} poolId={poolId} address={address} variants={itemVariants} />
        ))}
      </div>
    </motion.div>
  )
}

interface PoolCardProps {
  poolId: number
  address?: `0x${string}`
  variants: any
}

function PoolCard({ poolId, address, variants }: PoolCardProps) {
  const { data: poolInfo, isLoading: isPoolInfoLoading } = usePoolInfo(poolId)
  const { data: isInPool, isLoading: isStatusLoading } = useIsInvestorInPool(address, poolId)

  if (isPoolInfoLoading) {
    return (
      <motion.div variants={variants}>
        <GlassCard className="p-6 h-64">
          <Skeleton className="h-8 w-3/4 mb-4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 mb-2 bg-white/5" />
          <Skeleton className="h-4 w-2/3 mb-6 bg-white/5" />
          <Skeleton className="h-20 w-full mb-4 bg-white/5" />
          <Skeleton className="h-8 w-full bg-white/5" />
        </GlassCard>
      </motion.div>
    )
  }

  if (!poolInfo) return null

  const [
    isActive,
    curReward,
    lastReward,
    participantsCount,
    rewardPerInvestorStored,
    personalInvestRequired,
    totalDirectInvestRequired,
    directRefsRequired,
    share,
  ] = poolInfo

  // Calculate APY (mock data for now)
  const apy = 12 + poolId * 3

  return (
    <motion.div variants={variants}>
      <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Pool {poolId + 1}</h3>
            <p className="text-gray-400 text-sm">Tier {poolId + 1} Investment</p>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="bg-violet-600">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs">APY</p>
              <p className="text-lg font-medium">{apy}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Participants</p>
              <p className="text-lg font-medium">{participantsCount.toString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Min Investment</p>
              <p className="text-lg font-medium">{formatEther(personalInvestRequired).toString()} 5PT</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Referrals Needed</p>
              <p className="text-lg font-medium">{directRefsRequired.toString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm mr-2">Your Status:</p>
            {isStatusLoading ? (
              <Skeleton className="h-6 w-20 bg-white/5" />
            ) : isInPool ? (
              <div className="flex items-center text-green-400">
                <CheckCircle size={16} className="mr-1" />
                <span className="text-sm font-medium">Participating</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <XCircle size={16} className="mr-1" />
                <span className="text-sm font-medium">Not Participating</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
