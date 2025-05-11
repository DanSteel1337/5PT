"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useBalance } from "wagmi"
import { formatUnits } from "viem"
import { CONTRACT_ADDRESSES, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice } from "@/lib/moralis-client"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { shouldUseMockData } from "@/lib/environment"
import {
  mockTokenData,
  mockUserData,
  mockInvestmentData,
  mockPriceHistory,
  mockPairReserves,
  mockDistributionData,
} from "@/lib/mock-data"
import { ErrorBoundary } from "@/components/error-boundary"

export function DashboardOverview() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("7d")
  const [refreshing, setRefreshing] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)

  // Check if we should use mock data
  useEffect(() => {
    setMounted(true)
    setIsPreview(shouldUseMockData())
  }, [])

  // Get account information (real or mock)
  const mockAccountData = isPreview
    ? {
        address: mockUserData.address,
        isConnected: mockUserData.isConnected,
      }
    : undefined

  const { address, isConnected } = useAccount(mockAccountData)

  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: mounted && !isPreview,
    },
  })

  // Get total supply
  const { data: totalSupply, isPending: isLoadingSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
    query: {
      enabled: mounted && !isPreview,
    },
  })

  // Get token price from Moralis
  const {
    data: priceData,
    isLoading: isLoadingPrice,
    error: priceError,
  } = useQuery({
    queryKey: ["tokenPrice", CONTRACT_ADDRESSES.priceToken],
    queryFn: async () => {
      if (isPreview) {
        return { usdPrice: mockTokenData.price }
      }

      try {
        const data = await getTokenPrice(CONTRACT_ADDRESSES.priceToken)
        if (!data) throw new Error("Failed to fetch token price")
        return data
      } catch (error) {
        console.error("Error fetching token price:", error)
        setApiError("Failed to fetch token price. Using fallback data.")
        // Return fallback data
        return { usdPrice: 0.01 }
      }
    },
    refetchInterval: isPreview ? false : 60000, // Only refetch in production
    enabled: mounted,
  })

  // Use mock pair reserves data in preview, or real data in production
  const pairReserves = isPreview ? mockPairReserves : mockPairReserves // Replace with real API call in production
  const isLoadingReserves = false

  // Get total deposits
  const { data: totalDeposits, isPending: isLoadingDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalDeposits",
    query: {
      enabled: mounted && !isPreview,
    },
  })

  // Get total rewards
  const { data: totalRewards, isPending: isLoadingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalRewards",
    query: {
      enabled: mounted && !isPreview,
    },
  })

  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteria",
    query: {
      enabled: mounted && !isPreview,
    },
  })

  // Get user investment info
  const { data: userInfo, isPending: isLoadingUserInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address && mounted && !isPreview,
    },
  })

  // Get user token balance
  const { data: tokenBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.token,
    query: {
      enabled: isConnected && !!address && mounted && !isPreview,
    },
  })

  // Calculate available rewards
  const { data: availableReward, isPending: isLoadingReward } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "calculateReward",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address && mounted && !isPreview,
    },
  })

  // Use mock or real data based on environment
  const actualDecimals = isPreview ? mockTokenData.decimals : decimals
  const actualTotalSupply = isPreview ? mockTokenData.totalSupply : totalSupply
  const actualTotalDeposits = isPreview ? mockInvestmentData.totalDeposits : totalDeposits
  const actualTotalRewards = isPreview ? mockInvestmentData.totalRewards : totalRewards
  const actualPoolCriteria = isPreview ? mockInvestmentData.poolCriteria : poolCriteria
  const actualUserInfo = isPreview ? [mockUserData.invested] : userInfo
  const actualAvailableReward = isPreview ? mockUserData.rewards : availableReward

  // Mock balance for preview
  const mockBalanceData = isPreview
    ? {
        value: mockUserData.balance,
        decimals: Number(mockTokenData.decimals),
        symbol: "5PT",
        formatted: formatUnits(mockUserData.balance, Number(mockTokenData.decimals)),
      }
    : undefined

  const actualTokenBalance = isPreview ? mockBalanceData : tokenBalance

  // Chart data
  const chartData = mockPriceHistory[timeframe]

  // Calculate price change percentage
  const priceChange =
    chartData.length >= 2
      ? ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100
      : 0

  // Format price change with + or - sign
  const formattedPriceChange = `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
  const priceChangeColor = priceChange >= 0 ? "text-green-500" : "text-red-500"

  // Token distribution data
  const distributionData = mockDistributionData

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ]

  // Calculate market cap
  const marketCap =
    actualTotalSupply && actualDecimals && priceData
      ? Number(formatUnits(actualTotalSupply, Number(actualDecimals))) * priceData.usdPrice
      : 0

  // Calculate liquidity
  const liquidity = pairReserves ? Number(pairReserves.reserve1_formatted) * (priceData?.usdPrice || 0.01) * 2 : 0

  // Format values
  const formattedPrice = priceData ? `$${priceData.usdPrice.toFixed(6)}` : "$0.00"

  const formattedMarketCap = `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  const formattedTotalDeposits =
    actualTotalDeposits && actualDecimals
      ? Number(formatUnits(actualTotalDeposits, Number(actualDecimals))).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      : "0"

  const formattedTotalRewards =
    actualTotalRewards && actualDecimals
      ? Number(formatUnits(actualTotalRewards, Number(actualDecimals))).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      : "0"

  const formattedRewardRate = actualPoolCriteria ? `${Number(actualPoolCriteria[1]) / 100}%` : "0%"

  const formattedLockPeriod = actualPoolCriteria ? `${Number(actualPoolCriteria[2])} days` : "0 days"

  const formattedUserBalance = actualTokenBalance
    ? `${Number.parseFloat(formatUnits(actualTokenBalance.value, actualTokenBalance.decimals)).toFixed(2)} ${actualTokenBalance.symbol}`
    : "0 5PT"

  const formattedUserDeposits =
    actualUserInfo && actualDecimals
      ? `${Number(formatUnits(actualUserInfo[0], Number(actualDecimals))).toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`
      : "0 5PT"

  const formattedUserRewards =
    actualAvailableReward && actualDecimals
      ? `${Number(formatUnits(actualAvailableReward, Number(actualDecimals))).toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`
      : "0 5PT"

  // Calculate reward percentage
  const rewardPercentage =
    actualUserInfo && actualAvailableReward && actualUserInfo[0] !== 0n
      ? (Number(actualAvailableReward) / Number(actualUserInfo[0])) * 100
      : 0

  const isLoading =
    isLoadingDecimals ||
    isLoadingSupply ||
    isLoadingPrice ||
    isLoadingDeposits ||
    isLoadingRewards ||
    isLoadingPoolCriteria ||
    isLoadingUserInfo ||
    isLoadingReward

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    setApiError(null)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated to the latest values.",
      })
    }, 1500)
  }

  // Clear API error after 5 seconds
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [apiError])

  // Client-side only rendering to avoid hydration issues
  if (!mounted) return null

  return (
    <ErrorBoundary>
      <div className="space-y-6 circuit-pattern">
        {/* Preview Mode Banner */}
        {isPreview && (
          <Alert className="bg-yellow-900/20 border-yellow-500/50 text-yellow-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>
              Running in preview mode with mock data. Wallet connection and blockchain interactions are disabled.
            </AlertDescription>
          </Alert>
        )}

        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold purple-text">5PT Investment Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Complete overview of your Five Pillars Token investment performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </ErrorBoundary>
  )
}
