"use client"

import { useState } from "react"
import { formatEther } from "ethers"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Users, TrendingUp, Coins, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DepositModal } from "@/components/modals/deposit-modal"
import { cn } from "@/lib/utils"

interface PoolCardProps {
  poolId: number
  address?: `0x${string}`
  poolInfo: any
  isInPool: boolean
  investorInfo: any
  isLoading: boolean
  className?: string
  variants?: any
}

export function PoolCard({
  poolId,
  address,
  poolInfo,
  isInPool,
  investorInfo,
  isLoading,
  className,
  variants,
}: PoolCardProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  if (isLoading) {
    return (
      <motion.div variants={variants} className={className}>
        <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
          <Skeleton className="h-8 w-3/4 mb-4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 mb-2 bg-white/5" />
          <Skeleton className="h-4 w-2/3 mb-6 bg-white/5" />
          <Skeleton className="h-20 w-full mb-4 bg-white/5" />
          <Skeleton className="h-8 w-full bg-white/5" />
        </div>
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
    <motion.div variants={variants} className={className}>
      <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm p-6 h-full transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />

        {/* Top glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Pool {poolId + 1}</h3>
              <p className="text-gray-400 text-sm">Tier {poolId + 1} Investment</p>
            </div>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "px-2 py-1 text-xs font-medium",
                isActive
                  ? "bg-gradient-to-r from-green-500/80 to-green-600/80 text-white border-green-400/30"
                  : "bg-gray-700/80 text-gray-300 border-gray-600/30",
              )}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-green-700/20 flex items-center justify-center">
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">APY</p>
                  <p className="text-lg font-medium text-white">{apy}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 flex items-center justify-center">
                  <Users size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Participants</p>
                  <p className="text-lg font-medium text-white">{participantsCount.toString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                Requirements
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Meet these requirements to join this pool</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>

              <div className="space-y-2 bg-black/20 rounded-lg p-3 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300">Personal Investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{formatEther(personalInvestRequired)} 5PT</span>
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
                    <span className="text-sm text-gray-300">Direct Referrals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{directRefsRequired}</span>
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
                    <span className="text-sm text-gray-300">Direct Refs Investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{formatEther(totalDirectInvestRequired)} 5PT</span>
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm mr-2 text-gray-300">Status:</p>
              {isInPool ? (
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
        </div>
      </div>

      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    </motion.div>
  )
}
