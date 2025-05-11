"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, Clock, Award, ArrowUpRight, Users } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useToast } from "@/hooks/use-toast"

interface InvestmentPerformanceCardProps {
  expanded?: boolean
}

export function InvestmentPerformanceCard({ expanded = false }: InvestmentPerformanceCardProps) {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [rewardCounter, setRewardCounter] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get investor info
  const { data: investorInfo, isPending: isLoadingInvestorInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "accountToInvestorInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected,
    },
  })

  // Get accumulated rewards
  const { data: accumulatedRewards, isPending: isLoadingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected,
    },
  })

  // Get last round rewards
  const { data: lastRoundRewards, isPending: isLoadingLastRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getLastRoundRewards",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected,
    },
  })

  const isLoading = isLoadingDecimals || isLoadingInvestorInfo || isLoadingRewards || isLoadingLastRewards

  // Format total deposit
  const totalDeposit = useMemo(() => {
    if (!investorInfo || !decimals) return 0
    return Number(formatUnits(investorInfo.totalDeposit || 0n, decimals))
  }, [investorInfo, decimals])

  // Format accumulated rewards
  const formattedAccumulatedRewards = useMemo(() => {
    if (!accumulatedRewards || !decimals) return 0
    return Number(formatUnits(accumulatedRewards || 0n, decimals))
  }, [accumulatedRewards, decimals])

  // Format last round rewards
  const formattedLastRoundRewards = useMemo(() => {
    if (!lastRoundRewards || !decimals) return { daily: 0, referral: 0, pool: 0 }
    return {
      daily: Number(formatUnits(lastRoundRewards[0] || 0n, decimals)),
      referral: Number(formatUnits(lastRoundRewards[1] || 0n, decimals)),
      pool: Number(formatUnits(lastRoundRewards[2] || 0n, decimals)),
    }
  }, [lastRoundRewards, decimals])

  // Calculate ROI
  const roi = useMemo(() => {
    if (totalDeposit === 0) return 0
    return (formattedAccumulatedRewards / totalDeposit) * 100
  }, [totalDeposit, formattedAccumulatedRewards])

  // Calculate APY (based on daily rate of 0.3%)
  const apy = useMemo(() => {
    return Math.pow(1.003, 365) * 100 - 100
  }, [])

  // Calculate earnings per second (based on daily rate)
  const earningsPerSecond = useMemo(() => {
    if (totalDeposit === 0) return 0
    // 0.3% daily = 0.3/100/86400 per second
    return (totalDeposit * 0.003) / 86400
  }, [totalDeposit])

  // Update reward counter every second
  useEffect(() => {
    if (!isConnected || totalDeposit === 0) return

    const now = Date.now()
    const secondsElapsed = (now - lastUpdate) / 1000
    setRewardCounter((prev) => prev + earningsPerSecond * secondsElapsed)
    setLastUpdate(now)

    const interval = setInterval(() => {
      setRewardCounter((prev) => prev + earningsPerSecond)
      setLastUpdate(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected, totalDeposit, earningsPerSecond, lastUpdate])

  // Handle claim rewards
  const handleClaimRewards = () => {
    toast({
      title: "Claim Initiated",
      description: "Your rewards claim transaction has been initiated.",
    })
  }

  // Handle deposit
  const handleDeposit = () => {
    toast({
      title: "Deposit",
      description: "Opening deposit form...",
    })
  }

  if (!isConnected) {
    return (
      <Card className={expanded ? "col-span-full" : ""}>
        <CardHeader>
          <CardTitle>Investment Performance</CardTitle>
          <CardDescription>Connect your wallet to view your investment metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <Coins className="h-16 w-16 text-purple-400 mx-auto opacity-50" />
            <h3 className="text-xl font-medium">Wallet Not Connected</h3>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view your investment performance, rewards, and ROI metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Investment Performance</CardTitle>
            <CardDescription>Your 5PT investment metrics and rewards</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            {apy.toFixed(2)}% APY
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Coins className="h-4 w-4 mr-1 text-purple-400" />
                  Total Deposit
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">
                    {totalDeposit.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Award className="h-4 w-4 mr-1 text-purple-400" />
                  Total Rewards
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">
                    {formattedAccumulatedRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-purple-400" />
                  ROI
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">{roi.toFixed(2)}%</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="h-4 w-4 mr-1 text-purple-400" />
                  Next Claim
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">Now</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Current Rewards</span>
                  <span className="text-sm font-medium text-purple-300">
                    {(formattedAccumulatedRewards + rewardCounter).toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}{" "}
                    5PT
                  </span>
                </div>
                <Progress
                  value={100}
                  className="h-2"
                  indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                />
              </div>

              <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-medium mb-3">Real-time Earnings</h4>
                <div className="text-3xl font-bold text-purple-300 font-mono tabular-nums mb-1">
                  +{rewardCounter.toFixed(6)} 5PT
                </div>
                <div className="text-xs text-muted-foreground">
                  Earning approximately {(earningsPerSecond * 86400).toFixed(3)} 5PT per day
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleClaimRewards}
              >
                Claim Rewards
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-500/30 hover:bg-purple-900/20"
                onClick={handleDeposit}
              >
                Deposit More
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rewards Breakdown</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Daily Rewards</div>
                    <div className="text-xs text-muted-foreground">0.3% daily rate</div>
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <div className="text-right">
                    <div className="font-medium text-purple-300">
                      {formattedLastRoundRewards.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                    </div>
                    <div className="text-xs text-green-400">
                      <ArrowUpRight className="h-3 w-3 inline mr-1" />
                      {((formattedLastRoundRewards.daily / totalDeposit) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Referral Rewards</div>
                    <div className="text-xs text-muted-foreground">Direct: 0.025%, Downline: 0.06%</div>
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <div className="text-right">
                    <div className="font-medium text-purple-300">
                      {formattedLastRoundRewards.referral.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                    </div>
                    <div className="text-xs text-green-400">
                      <ArrowUpRight className="h-3 w-3 inline mr-1" />
                      {((formattedLastRoundRewards.referral / totalDeposit) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">Pool Rewards</div>
                    <div className="text-xs text-muted-foreground">From qualified pools</div>
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <div className="text-right">
                    <div className="font-medium text-purple-300">
                      {formattedLastRoundRewards.pool.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                    </div>
                    <div className="text-xs text-green-400">
                      <ArrowUpRight className="h-3 w-3 inline mr-1" />
                      {((formattedLastRoundRewards.pool / totalDeposit) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {expanded && (
              <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-medium mb-3">Achievement Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Early Investor</Badge>
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">Pool Qualifier</Badge>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">Referral Leader</Badge>
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">Diamond Hands</Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
