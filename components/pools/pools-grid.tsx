"use client"

import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { POOL_IDS } from "@/lib/constants"
import { PoolCard } from "./pool-card"
import { useMemo } from "react"
import { usePoolInfo, useIsInvestorInPool } from "@/lib/hooks/use-investment-manager"

interface PoolsGridProps {
  filterActive?: boolean
  filterEligible?: boolean
  className?: string
}

export function PoolsGrid({ filterActive, filterEligible, className }: PoolsGridProps) {
  const { address } = useAccount()
  const { useInvestorInfo } = useInvestmentManager()
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)

  const poolInfos = POOL_IDS.map((poolId) => usePoolInfo(poolId))
  const poolStatuses = POOL_IDS.map((poolId) => useIsInvestorInPool(address, poolId))

  const poolInfosData = useMemo(() => {
    return POOL_IDS.map((poolId, index) => ({
      poolId,
      poolInfo: poolInfos[index],
      isInPool: poolStatuses[index],
    }))
  }, [address, poolInfos, poolStatuses])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Filter pools based on active and eligible criteria
  const filteredPoolIds = useMemo(() => {
    return POOL_IDS.filter((poolId) => {
      if (!filterActive && !filterEligible) return true

      const poolData = poolInfosData.find((pool) => pool.poolId === poolId)

      if (!poolData) return false

      const { poolInfo, isInPool } = poolData
      const { data: poolInfoData } = poolInfo
      const { data: isInPoolData } = isInPool

      if (!poolInfoData || !investorInfo) return true

      const [isActive] = poolInfoData

      if (filterActive && !isActive) return false

      if (filterEligible) {
        const [
          _isActive,
          _curReward,
          _lastReward,
          _participantsCount,
          _rewardPerInvestorStored,
          personalInvestRequired,
          totalDirectInvestRequired,
          directRefsRequired,
        ] = poolInfoData

        const totalDeposit = investorInfo[0]
        const directRefsCount = investorInfo[1]
        const directRefsDeposit = investorInfo[3]

        const isEligibleDeposit = totalDeposit >= personalInvestRequired
        const isEligibleRefs = directRefsCount >= directRefsRequired
        const isEligibleDirectDeposit = directRefsDeposit >= totalDirectInvestRequired

        const isEligible = isEligibleDeposit && isEligibleRefs && isEligibleDirectDeposit

        if (!isEligible) return false
      }

      return true
    })
  }, [filterActive, filterEligible, investorInfo, poolInfosData])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {filteredPoolIds.map((poolId) => {
        const poolData = poolInfosData.find((pool) => pool.poolId === poolId)

        if (!poolData) return null

        const { poolInfo, isInPool } = poolData
        const { data: poolInfoData, isLoading: isPoolInfoLoading } = poolInfo
        const { data: isInPoolData, isLoading: isStatusLoading } = isInPool

        return (
          <PoolCard
            key={poolId}
            poolId={poolId}
            address={address}
            poolInfo={poolInfoData}
            isInPool={isInPoolData || false}
            investorInfo={investorInfo}
            isLoading={isPoolInfoLoading || isStatusLoading || isInfoLoading}
            variants={itemVariants}
          />
        )
      })}

      {filteredPoolIds.length === 0 && (
        <motion.div variants={itemVariants} className="col-span-full text-center py-12">
          <p className="text-gray-400">No pools match the selected criteria.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
