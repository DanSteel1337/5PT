"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { Coins, Clock, Percent, Timer } from "lucide-react"

export function InvestmentStats() {
  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get total deposits
  const { data: totalDeposits, isPending: isLoadingDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalDeposits",
  })

  // Get total rewards
  const { data: totalRewards, isPending: isLoadingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalRewards",
  })

  // Get fee percentage
  const { data: feePercentage, isPending: isLoadingFee } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getFeePercentage",
  })

  // Get deposit delay
  const { data: depositDelay, isPending: isLoadingDelay } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getDepositDelay",
  })

  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteria",
  })

  const isLoading = useMemo(
    () =>
      isLoadingDecimals ||
      isLoadingDeposits ||
      isLoadingRewards ||
      isLoadingFee ||
      isLoadingDelay ||
      isLoadingPoolCriteria,
    [isLoadingDecimals, isLoadingDeposits, isLoadingRewards, isLoadingFee, isLoadingDelay, isLoadingPoolCriteria],
  )

  // Format values using useMemo
  const formattedTotalDeposits = useMemo(() => {
    if (!totalDeposits || !decimals) return "0"
    return Number(formatUnits(totalDeposits, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalDeposits, decimals])

  const formattedTotalRewards = useMemo(() => {
    if (!totalRewards || !decimals) return "0"
    return Number(formatUnits(totalRewards, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalRewards, decimals])

  const formattedFeePercentage = useMemo(() => {
    if (!feePercentage) return "0"
    return Number(feePercentage) / 100
  }, [feePercentage])

  const formattedDepositDelay = useMemo(() => {
    if (!depositDelay) return "0"
    return Number(depositDelay)
  }, [depositDelay])

  const formattedMinDeposit = useMemo(() => {
    if (!poolCriteria || !decimals) return "0"
    return Number(formatUnits(poolCriteria[0], decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [poolCriteria, decimals])

  const formattedRewardRate = useMemo(() => {
    if (!poolCriteria) return "0"
    return Number(poolCriteria[1]) / 100
  }, [poolCriteria])

  const formattedLockPeriod = useMemo(() => {
    if (!poolCriteria) return "0"
    return Number(poolCriteria[2])
  }, [poolCriteria])

  // Calculate reward to deposit ratio
  const rewardRatio = useMemo(() => {
    if (!totalRewards || !totalDeposits || totalDeposits === 0n) return 0
    return (Number(totalRewards) / Number(totalDeposits)) * 100
  }, [totalRewards, totalDeposits])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Parameters</CardTitle>
        <CardDescription>Current investment criteria and statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Minimum Deposit</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedMinDeposit} 5PT</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Percent className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Reward Rate</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedRewardRate}%</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Lock Period</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedLockPeriod} days</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Timer className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Deposit Delay</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedDepositDelay} hours</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Percent className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Fee Percentage</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedFeePercentage}%</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Deposits</span>
            {isLoading ? (
              <Skeleton className="h-5 w-[100px]" />
            ) : (
              <span className="font-medium">{formattedTotalDeposits} 5PT</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Rewards</span>
            {isLoading ? (
              <Skeleton className="h-5 w-[100px]" />
            ) : (
              <span className="font-medium">{formattedTotalRewards} 5PT</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reward/Deposit Ratio</span>
              {isLoading ? (
                <Skeleton className="h-5 w-[60px]" />
              ) : (
                <span className="font-medium">{rewardRatio.toFixed(2)}%</span>
              )}
            </div>
            <Progress value={rewardRatio} className="h-2" indicatorClassName="bg-gold-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
