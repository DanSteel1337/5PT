"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice } from "@/lib/moralis"
import { ArrowUpRight, TrendingUp, Users, Wallet, Layers, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { shouldUseMockData } from "@/lib/environment"
import { useTokenDecimals, useTokenTotalSupply, useInvestmentData } from "@/lib/contract-hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { QueryClientProvider } from "../providers/query-client-provider"

// Wrap the actual component implementation
function DashboardHeroClientContent() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const useMockData = shouldUseMockData()

  // Use our custom hooks
  const { data: decimals, isPending: isLoadingDecimals } = useTokenDecimals({
    enabled: mounted && isConnected && !useMockData,
  })

  // Get total supply
  const { data: totalSupply, isPending: isLoadingSupply } = useTokenTotalSupply({
    enabled: mounted && isConnected && !useMockData,
  })

  // Get token price from Moralis
  const { data: priceData, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: () => getTokenPrice("0x123456789abcdef"),
    enabled: mounted && !useMockData,
    refetchInterval: 60000, // Refetch every minute
  })

  // Get investment data using batched contract reads
  const {
    data: investmentData,
    isPending: isLoadingInvestmentData,
    isError,
    error,
  } = useInvestmentData({
    enabled: mounted && isConnected && !useMockData,
  })

  // Extract data from the batched response
  const totalDeposits = useMemo(
    () => (investmentData?.[0].status === "success" ? investmentData[0].result : BigInt(0)),
    [investmentData],
  )
  const totalRewards = useMemo(
    () => (investmentData?.[1].status === "success" ? investmentData[1].result : BigInt(0)),
    [investmentData],
  )
  const poolCount = useMemo(
    () => (investmentData?.[4].status === "success" ? Number(investmentData[4].result[3]) : 7),
    [investmentData],
  )

  const isLoading = isLoadingDecimals || isLoadingSupply || isLoadingPrice || isLoadingInvestmentData

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate market cap
  const marketCap = useMemo(() => {
    if (useMockData) return 12500000
    if (!totalSupply || !decimals || !priceData) return 0
    return Number(formatUnits(totalSupply, decimals)) * priceData.usdPrice
  }, [totalSupply, decimals, priceData, useMockData])

  // Format values with memoization
  const formattedPrice = useMemo(() => {
    if (useMockData) return "$0.025"
    if (!priceData) return "$0.00"
    return `$${priceData.usdPrice.toFixed(6)}`
  }, [priceData, useMockData])

  const formattedMarketCap = useMemo(() => {
    return `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }, [marketCap])

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

  // Show error if there was a problem fetching data
  if (isError && !useMockData) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to fetch dashboard data. Please try again later."}
        </AlertDescription>
      </Alert>
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
    <div className="space-y-6">
      {previewModeNotice}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/pools">
            <Button className="cyber-button">
              <Layers className="mr-2 h-4 w-4" />
              View All Pools
              {poolCount && <Badge className="ml-2 bg-primary-foreground/20">{poolCount}</Badge>}
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
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
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
            {isLoading && !useMockData ? (
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
              <Zap className="h-4 w-4 text-accent" />
            </div>
            {isLoading && !useMockData ? (
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
    </div>
  )
}

// Export the wrapped component
export function DashboardHeroClient() {
  return (
    <QueryClientProvider>
      <DashboardHeroClientContent />
    </QueryClientProvider>
  )
}
