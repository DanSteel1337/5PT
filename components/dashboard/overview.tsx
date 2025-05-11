"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice } from "@/lib/moralis"
import { ArrowUpRight, TrendingUp, Users, Wallet, Clock } from "lucide-react"

export function DashboardOverview() {
  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get total supply
  const { data: totalSupply, isPending: isLoadingSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
  })

  // Get token price from Moralis
  const { data: priceData, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["tokenPrice", CONTRACT_ADDRESSES.priceToken],
    queryFn: () => getTokenPrice(CONTRACT_ADDRESSES.priceToken),
    refetchInterval: 60000, // Refetch every minute
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

  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteria",
  })

  const isLoading = useMemo(
    () =>
      isLoadingDecimals ||
      isLoadingSupply ||
      isLoadingPrice ||
      isLoadingDeposits ||
      isLoadingRewards ||
      isLoadingPoolCriteria,
    [isLoadingDecimals, isLoadingSupply, isLoadingPrice, isLoadingDeposits, isLoadingRewards, isLoadingPoolCriteria],
  )

  // Calculate market cap
  const marketCap = useMemo(() => {
    if (!totalSupply || !decimals || !priceData) return 0
    return Number(formatUnits(totalSupply, decimals)) * priceData.usdPrice
  }, [totalSupply, decimals, priceData])

  // Format values
  const formattedPrice = useMemo(() => {
    if (!priceData) return "$0.00"
    return `$${priceData.usdPrice.toFixed(6)}`
  }, [priceData])

  const formattedMarketCap = useMemo(() => {
    return `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }, [marketCap])

  const formattedTotalDeposits = useMemo(() => {
    if (!totalDeposits || !decimals) return "0"
    return Number(formatUnits(totalDeposits, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalDeposits, decimals])

  const formattedTotalRewards = useMemo(() => {
    if (!totalRewards || !decimals) return "0"
    return Number(formatUnits(totalRewards, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalRewards, decimals])

  const formattedRewardRate = useMemo(() => {
    if (!poolCriteria) return "0%"
    return `${Number(poolCriteria[1]) / 100}%`
  }, [poolCriteria])

  const formattedLockPeriod = useMemo(() => {
    if (!poolCriteria) return "0 days"
    return `${Number(poolCriteria[2])} days`
  }, [poolCriteria])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Token Price</CardTitle>
          <TrendingUp className="h-4 w-4 text-gold-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold gold-text">{formattedPrice}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+2.5%</span> from last 24h
          </p>
        </CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          <Wallet className="h-4 w-4 text-gold-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold gold-text">{formattedMarketCap}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Based on current price and supply</p>
        </CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          <Users className="h-4 w-4 text-gold-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold gold-text">{formattedTotalDeposits}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">5PT tokens deposited</p>
        </CardContent>
      </Card>
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reward Rate</CardTitle>
          <Clock className="h-4 w-4 text-gold-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <div className="text-2xl font-bold gold-text">{formattedRewardRate}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Lock period: {formattedLockPeriod}</p>
        </CardContent>
      </Card>
    </div>
  )
}
