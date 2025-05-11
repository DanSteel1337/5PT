"use client"

import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Coins, Percent, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export function PoolsGrid() {
  // Get pool count
  const { data: poolCount, isPending: isLoadingPoolCount } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCount",
  })

  // Generate pool array
  const pools = useMemo(() => {
    if (!poolCount)
      return Array(7)
        .fill(0)
        .map((_, i) => i + 1)
    return Array(Number(poolCount))
      .fill(0)
      .map((_, i) => i + 1)
  }, [poolCount])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pools.map((poolId) => (
        <PoolCard key={poolId} poolId={poolId} isNew={poolId > 7} />
      ))}
    </div>
  )
}

function PoolCard({ poolId, isNew }: { poolId: number; isNew?: boolean }) {
  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteriaById",
    args: [BigInt(poolId)],
  })

  // Get pool stats
  const { data: poolStats, isPending: isLoadingPoolStats } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolStats",
    args: [BigInt(poolId)],
  })

  const isLoading = isLoadingPoolCriteria || isLoadingPoolStats

  // Format pool data
  const formattedMinDeposit = useMemo(() => {
    if (!poolCriteria) return "0"
    return Number(formatUnits(poolCriteria.minDeposit, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [poolCriteria])

  const formattedRewardRate = useMemo(() => {
    if (!poolCriteria) return "0"
    return (Number(poolCriteria.rewardRate) / 100).toFixed(2)
  }, [poolCriteria])

  const formattedLockPeriod = useMemo(() => {
    if (!poolCriteria) return "0"
    return Number(poolCriteria.lockPeriod)
  }, [poolCriteria])

  const formattedActiveInvestors = useMemo(() => {
    if (!poolStats) return "0"
    return Number(poolStats.activeInvestors).toLocaleString()
  }, [poolStats])

  // Calculate annual yield
  const annualYield = useMemo(() => {
    if (!poolCriteria) return "0"
    return (((Number(poolCriteria.rewardRate) / 100) * 365) / Number(poolCriteria.lockPeriod)).toFixed(2)
  }, [poolCriteria])

  // Calculate capacity usage
  const capacityUsage = useMemo(() => {
    if (!poolStats || !poolCriteria || poolCriteria.maxCapacity === 0n) return 0
    return (Number(poolStats.totalDeposits) / Number(poolCriteria.maxCapacity)) * 100
  }, [poolStats, poolCriteria])

  return (
    <div className={`pool-card ${isNew ? "shimmer" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center">
            Pool {poolId}
            {isNew && <Badge className="ml-2 bg-gold-500 text-black">New</Badge>}
          </h3>
          <p className="text-sm text-muted-foreground">Investment Option {poolId}</p>
        </div>
        <Shield className="h-6 w-6 text-gold-500" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <Coins className="mr-1 h-3 w-3 text-gold-500" />
              Min Deposit
            </p>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <p className="text-lg font-bold">{formattedMinDeposit} 5PT</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <Percent className="mr-1 h-3 w-3 text-gold-500" />
              Reward Rate
            </p>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <p className="text-lg font-bold text-green-500">{formattedRewardRate}%</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <Clock className="mr-1 h-3 w-3 text-gold-500" />
              Lock Period
            </p>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <p className="text-lg font-bold">{formattedLockPeriod} days</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-gold-500" />
              Annual Yield
            </p>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <p className="text-lg font-bold text-green-500">{annualYield}%</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Users className="mr-1 h-3 w-3 text-gold-500" />
              Investors
            </span>
            <span className="font-medium">{formattedActiveInvestors}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pool Capacity</span>
            <span className="font-medium">{capacityUsage.toFixed(1)}%</span>
          </div>
          <Progress value={capacityUsage} className="h-2" indicatorClassName="bg-gold-500" />
        </div>

        <Link href={`/dashboard/pools/${poolId}`}>
          <Button className="w-full bg-gold-500 hover:bg-gold-600 text-black">
            Invest Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
