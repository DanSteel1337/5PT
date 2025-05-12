"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  BarChart3,
  Clock,
  Coins,
  DollarSign,
  Lock,
  Percent,
  Shield,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react"
import { formatUnits } from "viem"
import { shouldUseMockData } from "@/lib/environment"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useInvestmentManager, useTokenContract } from "@/lib/contract-hooks"
import { QueryClientProvider } from "../providers/query-client-provider"

interface ContractStatisticsCardProps {
  expanded?: boolean
}

function ContractStatisticsCardContent({ expanded = false }: ContractStatisticsCardProps) {
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 0,
    seconds: 0,
  })
  const [error, setError] = useState<string | null>(null)

  // Use environment detection to determine if we should use mock data
  const useMockData = shouldUseMockData()

  // Use the hooks from contract-hooks.ts
  const { useTokenDecimals } = useTokenContract()
  const { useInvestmentData, useInvestorCount } = useInvestmentManager()

  // Get token decimals
  const { data: decimals } = useTokenDecimals({
    enabled: mounted && !useMockData,
  })

  // Use the batched contract reads for better performance
  const {
    data: contractData,
    isPending: isLoadingContractData,
    isError,
  } = useInvestmentData({
    enabled: mounted && !useMockData,
    onError: (err) => {
      console.error("Error fetching contract data:", err)
      setError("Failed to fetch contract data. Please try again later.")
    },
  })

  // Use the custom hook for investor count
  const { data: investorCount, isPending: isLoadingInvestorCount } = useInvestorCount({
    enabled: mounted && !useMockData,
  })

  const isLoading = isLoadingContractData || isLoadingInvestorCount

  // Extract data from the batched response with proper type safety
  const totalDeposits = useMemo(() => {
    if (useMockData) return BigInt(750000 * 10 ** 18)
    if (!contractData || contractData[0].status !== "success") return BigInt(0)
    return contractData[0].result
  }, [contractData, useMockData])

  const totalRewards = useMemo(() => {
    if (useMockData) return BigInt(125000 * 10 ** 18)
    if (!contractData || contractData[1].status !== "success") return BigInt(0)
    return contractData[1].result
  }, [contractData, useMockData])

  const feePercentage = useMemo(() => {
    if (useMockData) return BigInt(250) // 2.5%
    if (!contractData || contractData[2].status !== "success") return BigInt(0)
    return contractData[2].result
  }, [contractData, useMockData])

  const depositDelay = useMemo(() => {
    if (useMockData) return BigInt(4)
    if (!contractData || contractData[3].status !== "success") return BigInt(4)
    return contractData[3].result
  }, [contractData, useMockData])

  // Format total deposits with memoization for better performance
  const formattedTotalDeposits = useMemo(() => {
    if (useMockData) return "750,000"
    if (!totalDeposits || !decimals) return "0"
    return Number(formatUnits(totalDeposits, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalDeposits, decimals, useMockData])

  // Format total rewards with memoization
  const formattedTotalRewards = useMemo(() => {
    if (useMockData) return "125,000"
    if (!totalRewards || !decimals) return "0"
    return Number(formatUnits(totalRewards, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalRewards, decimals, useMockData])

  // Format fee percentage with memoization
  const formattedFeePercentage = useMemo(() => {
    if (useMockData) return 2.5
    if (!feePercentage) return 0
    return Number(feePercentage) / 100
  }, [feePercentage, useMockData])

  // Format deposit delay with memoization
  const formattedDepositDelay = useMemo(() => {
    if (useMockData) return 4
    if (!depositDelay) return 4
    return Number(depositDelay)
  }, [depositDelay, useMockData])

  // Format investor count with memoization
  const formattedInvestorCount = useMemo(() => {
    if (useMockData) return "3,842"
    if (!investorCount) return "0"
    return Number(investorCount).toLocaleString()
  }, [investorCount, useMockData])

  // Calculate contract age (mock data - in a real app, this would come from the contract)
  const contractAge = useMemo(() => {
    // Assuming contract was deployed on May 1, 2023
    const deploymentDate = new Date(2023, 4, 1)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - deploymentDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [])

  // Update countdown timer
  useEffect(() => {
    setMounted(true)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: formattedDepositDelay, minutes: 0, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [formattedDepositDelay])

  // Calculate progress percentage for the countdown timer
  const progressPercentage = useMemo(() => {
    const totalSeconds = formattedDepositDelay * 3600
    const elapsedSeconds = totalSeconds - (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds)
    return Math.round((elapsedSeconds / totalSeconds) * 100)
  }, [countdown, formattedDepositDelay])

  // Show error if there was a problem fetching data
  if (error && !useMockData) {
    return (
      <Card className={expanded ? "col-span-full" : ""}>
        <CardHeader>
          <CardTitle>Contract Statistics</CardTitle>
          <CardDescription>Key metrics and statistics for the 5PT investment platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Contract Statistics</CardTitle>
        <CardDescription>Key metrics and statistics for the 5PT investment platform</CardDescription>
      </CardHeader>
      <CardContent>
        {previewModeNotice}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Coins className="h-4 w-4 mr-1 text-purple-400" />
              Total Value Locked
            </div>
            {isLoading && !useMockData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-purple-300">{formattedTotalDeposits} 5PT</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Users className="h-4 w-4 mr-1 text-purple-400" />
              Total Investors
            </div>
            {isLoading && !useMockData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-purple-300">{formattedInvestorCount}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Percent className="h-4 w-4 mr-1 text-purple-400" />
              Platform Fee
            </div>
            {isLoading && !useMockData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-purple-300">{formattedFeePercentage}%</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-4 w-4 mr-1 text-purple-400" />
              Contract Age
            </div>
            <div className="text-2xl font-bold text-purple-300">{contractAge} days</div>
          </div>

          {expanded && (
            <>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4 mr-1 text-purple-400" />
                  Total Rewards Paid
                </div>
                {isLoading && !useMockData ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">{formattedTotalRewards} 5PT</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Shield className="h-4 w-4 mr-1 text-purple-400" />
                  Treasury Balance
                </div>
                <div className="text-2xl font-bold text-purple-300">250,000 5PT</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <BarChart3 className="h-4 w-4 mr-1 text-purple-400" />
                  Daily Volume
                </div>
                <div className="text-2xl font-bold text-purple-300">12,500 5PT</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-purple-400" />
                  USD Value
                </div>
                <div className="text-2xl font-bold text-purple-300">$1.25M</div>
              </div>
            </>
          )}
        </div>

        {expanded ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Performance</CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Performance chart will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Events</CardTitle>
                <CardDescription>Recent contract events and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <Coins className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">New Deposit</div>
                          <div className="text-xs text-muted-foreground">{30 - i * 5} minutes ago</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">{(Math.random() * 10000).toFixed(0)} 5PT</div>
                        <div className="text-xs text-muted-foreground">
                          0x{Math.random().toString(16).substring(2, 8)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-6">
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-purple-400" />
                  Next Deposit Available In
                </h4>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  {formattedDepositDelay}h Delay
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-300 font-mono">
                    {countdown.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>

                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-300 font-mono">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>

                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-300 font-mono">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Time Elapsed</span>
                  <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-1"
                  indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ContractStatisticsCard(props: ContractStatisticsCardProps) {
  return (
    <QueryClientProvider>
      <ContractStatisticsCardContent {...props} />
    </QueryClientProvider>
  )
}
