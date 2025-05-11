"use client"

import { Card } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice } from "@/lib/moralis"
import { ArrowUpRight, TrendingUp, Users, Wallet, Layers, Zap, Sparkles, Cpu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardHero() {
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

  // Get pool count
  const { data: poolCount, isPending: isLoadingPoolCount } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCount",
  })

  const isLoading = useMemo(
    () =>
      isLoadingDecimals ||
      isLoadingSupply ||
      isLoadingPrice ||
      isLoadingDeposits ||
      isLoadingRewards ||
      isLoadingPoolCount,
    [isLoadingDecimals, isLoadingSupply, isLoadingPrice, isLoadingDeposits, isLoadingRewards, isLoadingPoolCount],
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold tracking-tight cyber-text">Dashboard Overview</h2>
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
              <Cpu className="mr-1 h-3 w-3" /> AI-Enhanced
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Welcome to the next-gen Five Pillars Token investment platform</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/pools">
            <Button className="cyber-button">
              <Layers className="mr-2 h-4 w-4" />
              View All Pools
              {poolCount && <Badge className="ml-2 bg-primary-foreground/20">{poolCount.toString()}</Badge>}
            </Button>
          </Link>
          <Link href="/dashboard/share">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Users className="mr-2 h-4 w-4" />
              Invite & Earn
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card relative overflow-hidden group">
          <div className="p-6 z-10 relative">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Token Price</h3>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary text-glow">{formattedPrice}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2.5%</span> from last 24h
                </p>
              </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-data-flow bg-[length:200%_100%] animate-data-flow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Card>

        <Card className="dashboard-card-secondary relative overflow-hidden group">
          <div className="p-6 z-10 relative">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Market Cap</h3>
              <Wallet className="h-4 w-4 text-secondary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-secondary text-glow-purple">{formattedMarketCap}</div>
                <p className="text-xs text-muted-foreground mt-1">Based on current price and supply</p>
              </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-data-flow bg-[length:200%_100%] animate-data-flow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Card>

        <Card className="dashboard-card relative overflow-hidden group">
          <div className="p-6 z-10 relative">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Investments</h3>
              <Users className="h-4 w-4 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary text-glow">{formattedTotalDeposits}</div>
                <p className="text-xs text-muted-foreground mt-1">5PT tokens deposited</p>
              </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-data-flow bg-[length:200%_100%] animate-data-flow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Card>

        <Card className="dashboard-card-accent relative overflow-hidden group">
          <div className="p-6 z-10 relative">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Rewards</h3>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold text-accent text-glow-pink">{formattedTotalRewards}</div>
                <p className="text-xs text-muted-foreground mt-1">5PT tokens distributed as rewards</p>
              </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-data-flow bg-[length:200%_100%] animate-data-flow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Card>
      </div>

      <div className="glow-border p-0.5 rounded-xl">
        <div className="rounded-xl bg-card/80 backdrop-blur-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="mr-4 bg-primary/10 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-primary">AI Market Prediction</h3>
              <p className="text-sm text-muted-foreground">
                Our AI predicts a 12% price increase in the next 24 hours based on market patterns
              </p>
            </div>
          </div>
          <Button className="cyber-button-secondary whitespace-nowrap">
            <Cpu className="mr-2 h-4 w-4" />
            View AI Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
