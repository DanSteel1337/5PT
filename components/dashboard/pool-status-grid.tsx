"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Award, ArrowRight, Info, Lock } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useToast } from "@/hooks/use-toast"

export function PoolStatusGrid() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [selectedPool, setSelectedPool] = useState(1)

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

  // Check if investor is in pool
  const { data: isInPool, isPending: isLoadingPoolStatus } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "isInvestorInPool",
    args: [address || "0x0000000000000000000000000000000000000000", BigInt(selectedPool)],
    query: {
      enabled: isConnected,
    },
  })

  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteriaById",
    args: [BigInt(selectedPool)],
  })

  // Get pool stats
  const { data: poolStats, isPending: isLoadingPoolStats } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolStats",
    args: [BigInt(selectedPool)],
  })

  const isLoading = isLoadingInvestorInfo || isLoadingPoolStatus || isLoadingPoolCriteria || isLoadingPoolStats

  // Pool data (mock data - in a real app, this would come from the contract)
  const poolsData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `Pool ${i + 1}`,
      personalInvestRequired: (1000 * Math.pow(2, i)).toLocaleString(),
      directRefsRequired: i + 3,
      totalDirectInvestRequired: (5000 * Math.pow(2, i)).toLocaleString(),
      share: i < 5 ? 0.0175 : 0.01,
      participants: Math.floor(1000 / Math.pow(1.5, i)),
      isQualified: Math.random() > 0.5,
    }))
  }, [])

  // Format pool criteria
  const formattedPoolCriteria = useMemo(() => {
    if (!poolCriteria)
      return {
        personalInvestRequired: "0",
        directRefsRequired: 0,
        totalDirectInvestRequired: "0",
      }

    return {
      personalInvestRequired: formatUnits(poolCriteria.personalInvestRequired || 0n, 18),
      directRefsRequired: Number(poolCriteria.directRefsRequired || 0n),
      totalDirectInvestRequired: formatUnits(poolCriteria.totalDirectInvestRequired || 0n, 18),
    }
  }, [poolCriteria])

  // Format investor stats
  const investorStats = useMemo(() => {
    if (!investorInfo)
      return {
        totalDeposit: "0",
        directRefsCount: 0,
        directRefsDeposit: "0",
      }

    return {
      totalDeposit: formatUnits(investorInfo.totalDeposit || 0n, 18),
      directRefsCount: Number(investorInfo.directRefsCount || 0n),
      directRefsDeposit: formatUnits(investorInfo.directRefsDeposit || 0n, 18),
    }
  }, [investorInfo])

  // Calculate progress percentages
  const progressPercentages = useMemo(() => {
    if (!formattedPoolCriteria || !investorStats)
      return {
        personalInvest: 0,
        directRefs: 0,
        directInvest: 0,
      }

    const personalInvest = Math.min(
      (Number(investorStats.totalDeposit) / Number(formattedPoolCriteria.personalInvestRequired)) * 100,
      100,
    )

    const directRefs = Math.min((investorStats.directRefsCount / formattedPoolCriteria.directRefsRequired) * 100, 100)

    const directInvest = Math.min(
      (Number(investorStats.directRefsDeposit) / Number(formattedPoolCriteria.totalDirectInvestRequired)) * 100,
      100,
    )

    return {
      personalInvest,
      directRefs,
      directInvest,
    }
  }, [formattedPoolCriteria, investorStats])

  // Handle view pool details
  const handleViewPoolDetails = (poolId: number) => {
    setSelectedPool(poolId)
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Status</CardTitle>
          <CardDescription>Connect your wallet to view your pool qualification status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <Lock className="h-16 w-16 text-purple-400 mx-auto opacity-50" />
            <h3 className="text-xl font-medium">Wallet Not Connected</h3>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view your pool qualification status and progress.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pool Status Dashboard</CardTitle>
          <CardDescription>Track your qualification status across all investment pools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {poolsData.map((pool) => (
              <Card key={pool.id} className={`overflow-hidden ${selectedPool === pool.id ? "border-purple-500" : ""}`}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{pool.name}</CardTitle>
                    {isLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <Badge
                        variant="outline"
                        className={`${
                          pool.isQualified
                            ? "bg-green-500/10 text-green-500 border-green-500/30"
                            : "bg-red-500/10 text-red-500 border-red-500/30"
                        }`}
                      >
                        {pool.isQualified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Qualified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" /> Not Qualified
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Share:</span>
                      <span className="font-medium text-purple-300">{pool.share * 100}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium text-purple-300">{pool.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min Investment:</span>
                      <span className="font-medium text-purple-300">{pool.personalInvestRequired} 5PT</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-purple-500/30 hover:bg-purple-900/20"
                      onClick={() => handleViewPoolDetails(pool.id)}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-purple-500/30 bg-purple-900/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pool {selectedPool} Details</CardTitle>
                  <CardDescription>Qualification criteria and your current progress</CardDescription>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <Badge
                    variant="outline"
                    className={`${
                      isInPool
                        ? "bg-green-500/10 text-green-500 border-green-500/30"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    }`}
                  >
                    {isInPool ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" /> Locked
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-400" />
                    Qualification Criteria
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Personal Investment</span>
                        <span className="text-sm">
                          {isLoading ? (
                            <Skeleton className="h-4 w-20 inline-block" />
                          ) : (
                            <>
                              <span className="font-medium text-purple-300">
                                {Number(investorStats.totalDeposit).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                              <span className="text-muted-foreground">
                                {" / "}
                                {Number(formattedPoolCriteria.personalInvestRequired).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}{" "}
                                5PT
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentages.personalInvest}
                        className="h-2"
                        indicatorClassName={`${
                          progressPercentages.personalInvest >= 100 ? "bg-green-500" : "bg-purple-500"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Direct Referrals</span>
                        <span className="text-sm">
                          {isLoading ? (
                            <Skeleton className="h-4 w-20 inline-block" />
                          ) : (
                            <>
                              <span className="font-medium text-purple-300">{investorStats.directRefsCount}</span>
                              <span className="text-muted-foreground">
                                {" / "}
                                {formattedPoolCriteria.directRefsRequired}
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentages.directRefs}
                        className="h-2"
                        indicatorClassName={`${
                          progressPercentages.directRefs >= 100 ? "bg-green-500" : "bg-purple-500"
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Direct Referrals Volume</span>
                        <span className="text-sm">
                          {isLoading ? (
                            <Skeleton className="h-4 w-20 inline-block" />
                          ) : (
                            <>
                              <span className="font-medium text-purple-300">
                                {Number(investorStats.directRefsDeposit).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                              <span className="text-muted-foreground">
                                {" / "}
                                {Number(formattedPoolCriteria.totalDirectInvestRequired).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}{" "}
                                5PT
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={progressPercentages.directInvest}
                        className="h-2"
                        indicatorClassName={`${
                          progressPercentages.directInvest >= 100 ? "bg-green-500" : "bg-purple-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <h4 className="text-sm font-medium mb-2">Pool {selectedPool} Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>{poolsData[selectedPool - 1].share * 100}% share of the pool rewards</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Exclusive Pool {selectedPool} badge on your profile</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Priority support and early access to new features</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-400" />
                    Pool Performance
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Total Participants</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          poolsData[selectedPool - 1].participants.toLocaleString()
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Pool Share</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : `${poolsData[selectedPool - 1].share * 100}%`}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Your Status</div>
                      <div className="text-xl font-bold">
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          <Badge
                            className={`${
                              isInPool ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"
                            } text-black`}
                          >
                            {isInPool ? "Qualified" : "Not Qualified"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Estimated Rewards</div>
                      <div className="text-xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : isInPool ? "~25 5PT/day" : "0 5PT/day"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <h4 className="text-sm font-medium mb-3">What You Need to Qualify</h4>
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {progressPercentages.personalInvest < 100 && (
                          <div className="flex items-center text-amber-400">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>
                              Deposit{" "}
                              {(
                                Number(formattedPoolCriteria.personalInvestRequired) -
                                Number(investorStats.totalDeposit)
                              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                              more 5PT
                            </span>
                          </div>
                        )}

                        {progressPercentages.directRefs < 100 && (
                          <div className="flex items-center text-amber-400">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>
                              Invite {formattedPoolCriteria.directRefsRequired - investorStats.directRefsCount} more
                              direct referrals
                            </span>
                          </div>
                        )}

                        {progressPercentages.directInvest < 100 && (
                          <div className="flex items-center text-amber-400">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span>
                              Your referrals need to deposit{" "}
                              {(
                                Number(formattedPoolCriteria.totalDirectInvestRequired) -
                                Number(investorStats.directRefsDeposit)
                              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                              more 5PT
                            </span>
                          </div>
                        )}

                        {progressPercentages.personalInvest >= 100 &&
                          progressPercentages.directRefs >= 100 &&
                          progressPercentages.directInvest >= 100 && (
                            <div className="flex items-center text-green-400">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>You meet all requirements for Pool {selectedPool}!</span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isInPool}
                  >
                    {isInPool ? "Already Qualified" : "Qualify for Pool"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
