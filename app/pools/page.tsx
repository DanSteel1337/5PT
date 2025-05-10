"use client"

import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { formatEther } from "ethers"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { HolographicCard } from "@/components/ui/holographic-card"
import { Button } from "@/components/ui/button"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { POOL_IDS } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Users, TrendingUp, Coins } from "lucide-react"
import { DepositModal } from "@/components/modals/deposit-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { QuantumParticleSystem } from "@/components/ui/quantum-particle-system"
import { PoolsHeader } from "@/components/pools/pools-header"
import { PoolsFilter } from "@/components/pools/pools-filter"
import { ConnectWalletPrompt } from "@/components/pools/connect-wallet-prompt"
import { useState } from "react"

export default function PoolsPage() {
  const { isConnected } = useAccount()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  return (
    <DashboardLayout>
      <QuantumParticleSystem />

      <div className="space-y-8">
        <PoolsHeader />

        {isConnected ? <PoolsFilter /> : <ConnectWalletPrompt />}
      </div>
    </DashboardLayout>
  )
}

interface PoolsGridProps {
  filterActive?: boolean
  filterEligible?: boolean
}

function PoolsGrid({ filterActive, filterEligible }: PoolsGridProps) {
  const { address } = useAccount()

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {POOL_IDS.map((poolId) => (
        <PoolCard key={poolId} poolId={poolId} address={address} variants={itemVariants} />
      ))}
    </motion.div>
  )
}

interface PoolCardProps {
  poolId: number
  address?: `0x${string}`
  variants: any
}

function PoolCard({ poolId, address, variants }: PoolCardProps) {
  const { usePoolInfo, useIsInvestorInPool, useInvestorInfo } = useInvestmentManager()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  const { data: poolInfo, isLoading: isPoolInfoLoading } = usePoolInfo(poolId)
  const { data: isInPool, isLoading: isStatusLoading } = useIsInvestorInPool(address, poolId)
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)

  if (isPoolInfoLoading || isInfoLoading) {
    return (
      <motion.div variants={variants}>
        <HolographicCard className="p-6 h-96" intensity={7}>
          <Skeleton className="h-8 w-3/4 mb-4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 mb-2 bg-white/5" />
          <Skeleton className="h-4 w-2/3 mb-6 bg-white/5" />
          <Skeleton className="h-20 w-full mb-4 bg-white/5" />
          <Skeleton className="h-8 w-full bg-white/5" />
        </HolographicCard>
      </motion.div>
    )
  }

  if (!poolInfo || !investorInfo) return null

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

  // Check eligibility
  const totalDeposit = investorInfo[0]
  const directRefsCount = investorInfo[1]
  const directRefsDeposit = investorInfo[3]

  const isEligibleDeposit = totalDeposit >= personalInvestRequired
  const isEligibleRefs = directRefsCount >= directRefsRequired
  const isEligibleDirectDeposit = directRefsDeposit >= totalDirectInvestRequired

  const isEligible = isEligibleDeposit && isEligibleRefs && isEligibleDirectDeposit

  return (
    <motion.div variants={variants}>
      <HolographicCard className="p-6" intensity={7}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Pool {poolId + 1}</h3>
            <p className="text-gray-400 text-sm">Tier {poolId + 1} Investment</p>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="bg-violet-600">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              <div>
                <p className="text-gray-400 text-xs">APY</p>
                <p className="text-lg font-medium">{apy}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-xs">Participants</p>
                <p className="text-lg font-medium">{participantsCount.toString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Requirements</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-gray-400" />
                <span className="text-sm">Personal Investment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatEther(personalInvestRequired)} 5PT</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={isEligibleDeposit ? "text-green-400" : "text-red-400"}>
                        {isEligibleDeposit ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your deposit: {formatEther(totalDeposit)} 5PT</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm">Direct Referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{directRefsRequired}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={isEligibleRefs ? "text-green-400" : "text-red-400"}>
                        {isEligibleRefs ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your referrals: {directRefsCount.toString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-gray-400" />
                <span className="text-sm">Direct Refs Investment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatEther(totalDirectInvestRequired)} 5PT</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={isEligibleDirectDeposit ? "text-green-400" : "text-red-400"}>
                        {isEligibleDirectDeposit ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your refs deposit: {formatEther(directRefsDeposit)} 5PT</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm mr-2">Status:</p>
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

          <Button
            variant={isEligible ? "default" : "outline"}
            size="sm"
            className={
              isEligible
                ? "bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
                : "border-gold/20 hover:bg-gold/10 text-gold"
            }
            onClick={() => setIsDepositModalOpen(true)}
            disabled={!isEligible && isInPool}
          >
            {isInPool ? "Add Deposit" : "Join Pool"}
          </Button>
        </div>

        <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
      </HolographicCard>
    </motion.div>
  )
}
