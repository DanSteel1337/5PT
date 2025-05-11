"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useBalance } from "wagmi"
import { formatUnits } from "viem"
import { CONTRACT_ADDRESSES, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice } from "@/lib/moralis-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Wallet,
  Clock,
  Coins,
  ChevronRight,
  BarChart3,
  Share2,
  Percent,
  Shield,
  Sparkles,
  Download,
  RefreshCw,
  AlertTriangle,
  PieChart,
} from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { WalletConnector } from "@/components/wallet-connector"
import { shouldUseMockData } from "@/lib/environment"
import {
  mockTokenData,
  mockUserData,
  mockInvestmentData,
  mockPriceHistory,
  mockPairReserves,
  mockDistributionData,
  mockPoolsData,
  mockTransactions,
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

        {/* Top Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Token Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              {isLoading && !isPreview ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold purple-text">{formattedPrice}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className={`mr-1 h-3 w-3 ${priceChangeColor}`} />
                <span className={priceChangeColor}>{formattedPriceChange}</span> from last {timeframe}
              </p>
            </CardContent>
          </Card>
          <Card className="dashboard-card hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <Wallet className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              {isLoading && !isPreview ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold purple-text">{formattedMarketCap}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Based on current price and supply</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              {isLoading && !isPreview ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold purple-text">{formattedTotalDeposits}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">5PT tokens deposited</p>
            </CardContent>
          </Card>
          <Card className="dashboard-card hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Rate</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              {isLoading && !isPreview ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold purple-text">{formattedRewardRate}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Lock period: {formattedLockPeriod}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-auto bg-black/40 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="investments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              My Investments
            </TabsTrigger>
            <TabsTrigger
              value="tokenomics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Tokenomics
            </TabsTrigger>
            <TabsTrigger
              value="pools"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Pools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-7">
              {/* Price Chart */}
              <Card className="col-span-full md:col-span-5 dashboard-card">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Token Price History</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        Historical data for 5PT token
                        <span className={`ml-2 font-medium ${priceChangeColor}`}>{formattedPriceChange}</span>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant={timeframe === "7d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("7d")}
                        className={
                          timeframe === "7d"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                        }
                      >
                        7D
                      </Button>
                      <Button
                        variant={timeframe === "30d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("30d")}
                        className={
                          timeframe === "30d"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                        }
                      >
                        30D
                      </Button>
                      <Button
                        variant={timeframe === "90d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("90d")}
                        className={
                          timeframe === "90d"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                        }
                      >
                        90D
                      </Button>
                      <Button
                        variant={timeframe === "1y" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe("1y")}
                        className={
                          timeframe === "1y"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                        }
                      >
                        1Y
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis
                          tickFormatter={(value) => `$${value.toFixed(4)}`}
                          domain={["dataMin", "dataMax"]}
                          width={80}
                        />
                        <Tooltip
                          content={<ChartTooltipContent formatter={(value) => `$${Number(value).toFixed(6)}`} />}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="var(--color-price)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* User Stats */}
              <Card className="col-span-full md:col-span-2 dashboard-card">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                  <CardDescription>Your investment overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      <div className="rounded-full bg-purple-900/30 p-4 glow">
                        <Wallet className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Connect Wallet</h3>
                        <p className="text-sm text-muted-foreground mt-1">Connect to view your stats</p>
                      </div>
                      <WalletConnector variant="minimal" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Balance</span>
                          <span className="font-medium text-purple-300">{formattedUserBalance}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Invested</span>
                          <span className="font-medium text-purple-300">{formattedUserDeposits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Rewards</span>
                          <span className="font-medium text-green-500">{formattedUserRewards}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">ROI</span>
                          <span className="font-medium text-purple-300">{rewardPercentage.toFixed(2)}%</span>
                        </div>
                        <Progress
                          value={rewardPercentage}
                          max={100}
                          className="h-2"
                          indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-slow"
                        />
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isPreview}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isPreview ? "Preview Mode" : "Claim Rewards"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions and Referrals */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="dashboard-card hover-card">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest 5PT token transfers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((tx, i) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between border-b border-purple-500/10 pb-2 last:border-0"
                      >
                        <div className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                          <div>
                            <p className="text-sm font-medium">{tx.type}</p>
                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-purple-300">{tx.amount}</p>
                          <a href="#" className="text-xs text-purple-400 hover:underline">
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                  >
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>

              <Card className="dashboard-card hover-card">
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                  <CardDescription>Earn rewards by referring new investors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Your Referrals</span>
                      <span className="font-medium text-purple-300">{mockUserData.referrals}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Earned Rewards</span>
                      <span className="font-medium text-purple-300">
                        {formatUnits(mockUserData.referralRewards, Number(mockTokenData.decimals))} 5PT
                      </span>
                    </div>
                    <div className="rounded-lg border border-purple-500/20 p-3 bg-purple-900/20">
                      <p className="text-sm">Share your referral link to earn 5% of your friends' deposits</p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isPreview}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {isPreview ? "Preview Mode" : "Share Referral Link"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Investments Tab */}
          <TabsContent value="investments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2 dashboard-card">
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                  <CardDescription>Track your investment growth over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isConnected ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="rounded-full bg-purple-900/30 p-6 glow">
                        <Wallet className="h-10 w-10 text-purple-400" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-medium">Connect Your Wallet</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your wallet to view your investment details and rewards
                        </p>
                      </div>
                      <WalletConnector />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Total Invested</h3>
                          <p className="text-2xl font-bold text-purple-300">{formattedUserDeposits}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Available Rewards</h3>
                          <p className="text-2xl font-bold text-green-500">{formattedUserRewards}</p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">ROI</h3>
                          <p className="text-2xl font-bold text-purple-300">{rewardPercentage.toFixed(2)}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Reward Progress</h3>
                        <Progress
                          value={rewardPercentage}
                          max={100}
                          className="h-2"
                          indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-slow"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="rounded-lg border border-purple-500/20 p-4 bg-purple-900/20">
                        <h4 className="font-medium mb-2">Investment Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Lock Period</span>
                            <span className="text-sm font-medium text-purple-300">{formattedLockPeriod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Reward Rate</span>
                            <span className="text-sm font-medium text-purple-300">{formattedRewardRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Annual Yield</span>
                            <span className="text-sm font-medium text-green-500">
                              {actualPoolCriteria
                                ? (
                                    ((Number(actualPoolCriteria[1]) / 100) * 365) /
                                    Number(actualPoolCriteria[2])
                                  ).toFixed(2)
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          disabled={isPreview}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          {isPreview ? "Preview Mode" : "Claim Rewards"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                          disabled={isPreview}
                        >
                          {isPreview ? "Preview Mode" : "Deposit More"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Investment Parameters</CardTitle>
                  <CardDescription>Current investment criteria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">Minimum Deposit</span>
                      </div>
                      {isLoading && !isPreview ? (
                        <Skeleton className="h-5 w-[80px]" />
                      ) : (
                        <span className="font-medium text-purple-300">
                          {actualPoolCriteria && actualDecimals
                            ? Number(formatUnits(actualPoolCriteria[0], Number(actualDecimals))).toLocaleString()
                            : "0"}{" "}
                          5PT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Percent className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">Reward Rate</span>
                      </div>
                      {isLoading && !isPreview ? (
                        <Skeleton className="h-5 w-[80px]" />
                      ) : (
                        <span className="font-medium text-purple-300">{formattedRewardRate}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">Lock Period</span>
                      </div>
                      {isLoading && !isPreview ? (
                        <Skeleton className="h-5 w-[80px]" />
                      ) : (
                        <span className="font-medium text-purple-300">{formattedLockPeriod}</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-purple-500/20 p-4 bg-purple-900/20 mt-4">
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Automatic compounding options</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>5% referral rewards</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Treasury-backed security</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                  <CardDescription>Allocation of 5PT tokens</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      tokenomics: {
                        label: "Tokenomics",
                      },
                      ...distributionData.reduce(
                        (acc, item, index) => {
                          acc[item.name.toLowerCase().replace(" ", "_")] = {
                            label: item.name,
                            color: COLORS[index % COLORS.length],
                          }
                          return acc
                        },
                        {} as Record<string, { label: string; color: string }>,
                      ),
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Token Statistics</CardTitle>
                  <CardDescription>Key metrics of 5PT token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Token Name</h3>
                        <p className="text-xl font-bold purple-text">Five Pillars Token</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Symbol</h3>
                        <p className="text-xl font-bold purple-text">5PT</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
                        {isLoading && !isPreview ? (
                          <Skeleton className="h-6 w-[120px]" />
                        ) : (
                          <p className="text-xl font-bold text-purple-300">
                            {actualTotalSupply && actualDecimals
                              ? Number(formatUnits(actualTotalSupply, Number(actualDecimals))).toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 0,
                                  },
                                )
                              : "0"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Current Price</h3>
                        {isLoadingPrice && !isPreview ? (
                          <Skeleton className="h-6 w-[80px]" />
                        ) : (
                          <p className="text-xl font-bold text-purple-300">
                            ${priceData?.usdPrice.toFixed(6) || "0.00"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
                        {isLoading && !isPreview ? (
                          <Skeleton className="h-6 w-[120px]" />
                        ) : (
                          <p className="text-xl font-bold text-purple-300">
                            ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Liquidity</h3>
                        {isLoadingReserves && !isPreview ? (
                          <Skeleton className="h-6 w-[120px]" />
                        ) : (
                          <p className="text-xl font-bold text-purple-300">
                            ${liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pools Tab */}
          <TabsContent value="pools" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {mockPoolsData.map((pool) => (
                <Card key={pool.id} className="dashboard-card hover-card overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-purple-400" />
                        <h3 className="font-bold">{pool.name}</h3>
                      </div>
                      {pool.isPopular && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Popular</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Min. Deposit</p>
                          <p className="font-bold text-purple-300">{pool.minDeposit} 5PT</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reward Rate</p>
                          <p className="font-bold text-green-500">{pool.rewardRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lock Period</p>
                          <p className="font-bold text-purple-300">{pool.lockPeriod} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Annual Yield</p>
                          <p className="font-bold text-green-500">{pool.annualYield}%</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pool Capacity</span>
                          <span className="font-medium text-purple-300">{pool.capacity}%</span>
                        </div>
                        <Progress
                          value={pool.capacity}
                          className="h-2"
                          indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      </div>

                      <Link href={`/dashboard/pools/${pool.id}`}>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          disabled={isPreview}
                        >
                          {isPreview ? "Preview Mode" : "Invest Now"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/dashboard/pools">
                <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20">
                  View All Pools
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/investments">
            <Card className="dashboard-card hover-card transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Coins className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="font-medium text-center">Invest</h3>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/referrals">
            <Card className="dashboard-card hover-card transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Share2 className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="font-medium text-center">Refer</h3>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/analytics">
            <Card className="dashboard-card hover-card transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="font-medium text-center">Analytics</h3>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/tokenomics">
            <Card className="dashboard-card hover-card transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <PieChart className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="font-medium text-center">Tokenomics</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  )
}
