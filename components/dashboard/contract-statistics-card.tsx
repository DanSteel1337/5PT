"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Clock, Coins, DollarSign, Lock, Percent, Shield, Timer, TrendingUp, Users } from "lucide-react"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"

interface ContractStatisticsCardProps {
  expanded?: boolean
}

export function ContractStatisticsCard({ expanded = false }: ContractStatisticsCardProps) {
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 0,
    seconds: 0,
  })

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

  const isLoading = isLoadingDecimals || isLoadingDeposits || isLoadingRewards || isLoadingFee || isLoadingDelay

  // Format total deposits
  const formattedTotalDeposits = useMemo(() => {
    if (!totalDeposits || !decimals) return "0"
    return Number(formatUnits(totalDeposits, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalDeposits, decimals])

  // Format total rewards
  const formattedTotalRewards = useMemo(() => {
    if (!totalRewards || !decimals) return "0"
    return Number(formatUnits(totalRewards, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalRewards, decimals])

  // Format fee percentage
  const formattedFeePercentage = useMemo(() => {
    if (!feePercentage) return "0"
    return Number(feePercentage) / 100
  }, [feePercentage])

  // Format deposit delay
  const formattedDepositDelay = useMemo(() => {
    if (!depositDelay) return 4
    return Number(depositDelay)
  }, [depositDelay])

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

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Contract Statistics</CardTitle>
        <CardDescription>Key metrics and statistics for the 5PT investment platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Coins className="h-4 w-4 mr-1 text-purple-400" />
              Total Value Locked
            </div>
            {isLoading ? (
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
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-purple-300">3,842</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Percent className="h-4 w-4 mr-1 text-purple-400" />
              Platform Fee
            </div>
            {isLoading ? (
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
                {isLoading ? (
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
                  <span className="text-xs text-muted-foreground">
                    {Math.round(
                      (formattedDepositDelay * 3600 -
                        (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds)) /
                        (formattedDepositDelay * 36),
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (formattedDepositDelay * 3600 -
                      (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds)) /
                    (formattedDepositDelay * 36)
                  }
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
