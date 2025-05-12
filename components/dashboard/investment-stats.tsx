"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Coins, Clock, Percent, Timer } from "lucide-react"
import { shouldUseMockData } from "@/lib/environment"
import { useInvestmentManager, useTokenContract } from "@/lib/contract-hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function InvestmentStats() {
  const [mounted, setMounted] = useState(false)
  const useMockData = shouldUseMockData()

  // Use our custom hooks
  const { useTokenDecimals } = useTokenContract()
  const { useInvestmentData } = useInvestmentManager()

  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useTokenDecimals({
    enabled: mounted && !useMockData,
  })

  // Get investment data using batched contract reads
  const {
    data: investmentData,
    isPending: isLoadingInvestmentData,
    isError,
    error,
  } = useInvestmentData({
    enabled: mounted && !useMockData,
  })

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract data from the batched response
  const totalDeposits = useMemo(
    () => (investmentData?.[0].status === "success" ? investmentData[0].result : BigInt(0)),
    [investmentData],
  )
  const totalRewards = useMemo(
    () => (investmentData?.[1].status === "success" ? investmentData[1].result : BigInt(0)),
    [investmentData],
  )
  const feePercentage = useMemo(
    () => (investmentData?.[2].status === "success" ? investmentData[2].result : BigInt(0)),
    [investmentData],
  )
  const depositDelay = useMemo(
    () => (investmentData?.[3].status === "success" ? investmentData[3].result : BigInt(0)),
    [investmentData],
  )
  const poolCriteria = useMemo(
    () => (investmentData?.[4].status === "success" ? investmentData[4].result : undefined),
    [investmentData],
  )

  const isLoading = isLoadingDecimals || isLoadingInvestmentData

  // Format values using useMemo
  const formattedTotalDeposits = useMemo(() => {
    if (useMockData) return "750,000"
    if (!totalDeposits || !decimals) return "0"
    return Number(formatUnits(totalDeposits, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalDeposits, decimals, useMockData])

  const formattedTotalRewards = useMemo(() => {
    if (useMockData) return "125,000"
    if (!totalRewards || !decimals) return "0"
    return Number(formatUnits(totalRewards, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalRewards, decimals, useMockData])

  const formattedFeePercentage = useMemo(() => {
    if (useMockData) return 2.5
    if (!feePercentage) return 0
    return Number(feePercentage) / 100
  }, [feePercentage, useMockData])

  const formattedDepositDelay = useMemo(() => {
    if (useMockData) return 4
    if (!depositDelay) return 0
    return Number(depositDelay)
  }, [depositDelay, useMockData])

  const formattedMinDeposit = useMemo(() => {
    if (useMockData) return "1,000"
    if (!poolCriteria || !decimals) return "0"
    return Number(formatUnits(poolCriteria[0], decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [poolCriteria, decimals, useMockData])

  const formattedRewardRate = useMemo(() => {
    if (useMockData) return 5.0
    if (!poolCriteria) return 0
    return Number(poolCriteria[1]) / 100
  }, [poolCriteria, useMockData])

  const formattedLockPeriod = useMemo(() => {
    if (useMockData) return 30
    if (!poolCriteria) return 0
    return Number(poolCriteria[2])
  }, [poolCriteria, useMockData])

  // Calculate reward to deposit ratio
  const rewardRatio = useMemo(() => {
    if (useMockData) return 16.67
    if (!totalRewards || !totalDeposits || totalDeposits === 0n) return 0
    return (Number(totalRewards) / Number(totalDeposits)) * 100
  }, [totalRewards, totalDeposits, useMockData])

  // Show error if there was a problem fetching data
  if (isError && !useMockData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Parameters</CardTitle>
          <CardDescription>Current investment criteria and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to fetch investment data. Please try again later."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Show preview mode notice if using mock data
  const previewModeNotice = useMockData && (
    <Alert className="mb-4 bg-purple-900/10 border-purple-500/30">
      <AlertCircle className="h-4 w-4 text-purple-400" />
      <AlertTitle className="text-purple-300">Preview Mode</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Displaying mock data. Connect to BSC network to see live contract data.
      </AlertDescription>
    </Alert>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Parameters</CardTitle>
        <CardDescription>Current investment criteria and statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {previewModeNotice}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Minimum Deposit</span>
            </div>
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{formattedFeePercentage}%</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Deposits</span>
            {isLoading && !useMockData ? (
              <Skeleton className="h-5 w-[100px]" />
            ) : (
              <span className="font-medium">{formattedTotalDeposits} 5PT</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Rewards</span>
            {isLoading && !useMockData ? (
              <Skeleton className="h-5 w-[100px]" />
            ) : (
              <span className="font-medium">{formattedTotalRewards} 5PT</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reward/Deposit Ratio</span>
              {isLoading && !useMockData ? (
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
