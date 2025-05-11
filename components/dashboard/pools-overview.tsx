"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Coins, Percent, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export function PoolsOverview() {
  const [selectedPool, setSelectedPool] = useState(1)

  // Get pool count
  const { data: poolCount, isPending: isLoadingPoolCount } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCount",
  })

  // Get pool criteria for selected pool
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteriaById",
    args: [BigInt(selectedPool)],
  })

  // Get pool stats for selected pool
  const { data: poolStats, isPending: isLoadingPoolStats } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolStats",
    args: [BigInt(selectedPool)],
  })

  const isLoading = useMemo(
    () => isLoadingPoolCount || isLoadingPoolCriteria || isLoadingPoolStats,
    [isLoadingPoolCount, isLoadingPoolCriteria, isLoadingPoolStats],
  )

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

  const formattedTotalDeposits = useMemo(() => {
    if (!poolStats) return "0"
    return Number(formatUnits(poolStats.totalDeposits, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [poolStats])

  const formattedActiveInvestors = useMemo(() => {
    if (!poolStats) return "0"
    return Number(poolStats.activeInvestors).toLocaleString()
  }, [poolStats])

  // Calculate pool capacity usage
  const capacityUsage = useMemo(() => {
    if (!poolStats || !poolCriteria || poolCriteria.maxCapacity === 0n) return 0
    return (Number(poolStats.totalDeposits) / Number(poolCriteria.maxCapacity)) * 100
  }, [poolStats, poolCriteria])

  // Generate pool buttons
  const poolButtons = useMemo(() => {
    if (!poolCount)
      return Array(7)
        .fill(0)
        .map((_, i) => i + 1)
    return Array(Number(poolCount))
      .fill(0)
      .map((_, i) => i + 1)
  }, [poolCount])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Investment Pools</CardTitle>
            <CardDescription>Choose from multiple investment options</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {poolButtons.map((poolId) => (
              <Button
                key={poolId}
                variant={selectedPool === poolId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPool(poolId)}
                className={selectedPool === poolId ? "bg-gold-500 text-black" : ""}
              >
                Pool {poolId}
                {poolId > 7 && <Badge className="ml-1 bg-gold-300 text-black text-xs">New</Badge>}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="mr-2 h-5 w-5 text-gold-500" />
                Pool {selectedPool} Details
                {selectedPool > 7 && <Badge className="ml-2 bg-gold-500 text-black">New</Badge>}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Minimum Deposit</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-[80px]" />
                  ) : (
                    <p className="text-lg font-bold">{formattedMinDeposit} 5PT</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reward Rate</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-[80px]" />
                  ) : (
                    <p className="text-lg font-bold text-green-500">{formattedRewardRate}%</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lock Period</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-[80px]" />
                  ) : (
                    <p className="text-lg font-bold">{formattedLockPeriod} days</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Investors</p>
                  {isLoading ? (
                    <Skeleton className="h-5 w-[80px]" />
                  ) : (
                    <p className="text-lg font-bold">{formattedActiveInvestors}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pool Capacity</span>
                  <span className="font-medium">{capacityUsage.toFixed(1)}%</span>
                </div>
                <Progress value={capacityUsage} className="h-2" indicatorClassName="bg-gold-500" />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href={`/dashboard/pools/${selectedPool}`}>
                <Button className="bg-gold-500 hover:bg-gold-600 text-black">
                  Invest in Pool {selectedPool}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-gold-500" />
              Pool Performance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="mr-2 h-4 w-4 text-gold-500" />
                  <span className="text-sm font-medium">Total Deposits</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-5 w-[100px]" />
                ) : (
                  <span className="font-bold">{formattedTotalDeposits} 5PT</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Percent className="mr-2 h-4 w-4 text-gold-500" />
                  <span className="text-sm font-medium">Annual Yield</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-5 w-[80px]" />
                ) : (
                  <span className="font-bold text-green-500">
                    {((Number(formattedRewardRate) * 365) / formattedLockPeriod).toFixed(2)}%
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gold-500" />
                  <span className="text-sm font-medium">Time to Double</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-5 w-[100px]" />
                ) : (
                  <span className="font-bold">
                    {Math.ceil(100 / ((Number(formattedRewardRate) * 365) / formattedLockPeriod))} days
                  </span>
                )}
              </div>

              <div className="rounded-lg border p-4 bg-muted/50 mt-4">
                <h4 className="font-medium mb-2">Pool {selectedPool} Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                      ✓
                    </div>
                    <span>
                      {formattedRewardRate}% rewards every {formattedLockPeriod} days
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                      ✓
                    </div>
                    <span>Automatic compounding options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                      ✓
                    </div>
                    <span>5% referral rewards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
                      ✓
                    </div>
                    <span>Treasury-backed security</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
