"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits, parseUnits } from "viem"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Coins, Info, Percent, Wallet, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function UserInvestment() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [depositAmount, setDepositAmount] = useState("")
  const [referrer, setReferrer] = useState("")
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [needsApproval, setNeedsApproval] = useState(false)
  const [feePercentage, setFeePercentage] = useState<number | null>(null)

  // Get token balance
  const {
    data: balance,
    isPending: isLoadingBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Get token decimals
  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get token allowance
  const {
    data: currentAllowance,
    isPending: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: [address || "0x0000000000000000000000000000000000000000", CONTRACT_ADDRESSES.investmentManager],
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Get user investment info
  const {
    data: userInfo,
    isPending: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address && !!CONTRACT_ADDRESSES.investmentManager,
    },
  })

  // Get pool criteria
  const { data: poolCriteria, isPending: isLoadingPoolCriteria } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCriteria",
  })

  // Calculate available rewards
  const { data: availableReward, isPending: isLoadingReward } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "calculateReward",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Get fee percentage
  const { data: feeData, isPending: isLoadingFee } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getFeePercentage",
  })

  useEffect(() => {
    if (feeData !== undefined && feeData !== null) {
      setFeePercentage(Number(feeData))
    }
  }, [feeData])

  // Approve token spending
  const { writeContract: approveToken, isPending: isApproving, data: approveHash } = useWriteContract()

  // Deposit tokens
  const { writeContract: deposit, isPending: isDepositing, data: depositHash } = useWriteContract()

  // Claim rewards
  const { writeContract: claimReward, isPending: isClaiming, data: claimHash } = useWriteContract()

  // Wait for transaction receipts
  const { isLoading: isWaitingForApprove } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
      onSuccess: () => {
        toast({
          title: "Approval successful",
          description: "You can now deposit your tokens.",
        })
        refetchAllowance()
      },
    },
  })

  const { isLoading: isWaitingForDeposit } = useWaitForTransactionReceipt({
    hash: depositHash,
    query: {
      enabled: !!depositHash,
      onSuccess: () => {
        toast({
          title: "Deposit successful",
          description: "Your tokens have been deposited successfully.",
        })
        refetchBalance()
        refetchUserInfo()
        setDepositAmount("")
      },
    },
  })

  const { isLoading: isWaitingForClaim } = useWaitForTransactionReceipt({
    hash: claimHash,
    query: {
      enabled: !!claimHash,
      onSuccess: () => {
        toast({
          title: "Rewards claimed",
          description: "Your rewards have been claimed successfully.",
        })
        refetchBalance()
        refetchUserInfo()
      },
    },
  })

  // Update allowance state when currentAllowance changes - in useEffect to prevent render-time updates
  useEffect(() => {
    if (currentAllowance !== undefined) {
      setAllowance(currentAllowance)
    }
  }, [currentAllowance])

  // Check if approval is needed when deposit amount changes - in useEffect to prevent render-time updates
  useEffect(() => {
    if (depositAmount && decimals && allowance !== undefined) {
      try {
        const amountInWei = parseUnits(depositAmount, decimals)
        setNeedsApproval(amountInWei > allowance)
      } catch (error) {
        // Ignore parsing errors when the user is typing
      }
    }
  }, [depositAmount, decimals, allowance])

  // Handle approve with useCallback to prevent recreation on each render
  const handleApprove = useCallback(async () => {
    if (!isConnected || !address || !decimals) return

    try {
      const amountInWei = parseUnits(depositAmount, decimals)
      approveToken({
        address: CONTRACT_ADDRESSES.token,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.investmentManager, amountInWei],
      })
    } catch (error) {
      console.error("Approval error:", error)
      toast({
        title: "Approval failed",
        description: "There was an error approving your tokens.",
        variant: "destructive",
      })
    }
  }, [isConnected, address, decimals, depositAmount, approveToken, toast])

  // Handle deposit with useCallback to prevent recreation on each render
  const handleDeposit = useCallback(async () => {
    if (!isConnected || !address || !decimals) return

    try {
      const amountInWei = parseUnits(depositAmount, decimals)
      deposit({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [amountInWei, referrer || "0x0000000000000000000000000000000000000000"],
      })
    } catch (error) {
      console.error("Deposit error:", error)
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit.",
        variant: "destructive",
      })
    }
  }, [isConnected, address, decimals, depositAmount, referrer, deposit, toast])

  // Handle claim rewards with useCallback to prevent recreation on each render
  const handleClaimRewards = useCallback(async () => {
    if (!isConnected || !address) return

    try {
      claimReward({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "claimReward",
      })
    } catch (error) {
      console.error("Claim error:", error)
      toast({
        title: "Claim failed",
        description: "There was an error claiming your rewards.",
        variant: "destructive",
      })
    }
  }, [isConnected, address, claimReward, toast])

  // Memoize loading state to prevent recalculations
  const isLoading = useMemo(
    () =>
      isLoadingBalance ||
      isLoadingDecimals ||
      isLoadingUserInfo ||
      isLoadingPoolCriteria ||
      isLoadingAllowance ||
      isLoadingReward ||
      isLoadingFee,
    [
      isLoadingBalance,
      isLoadingDecimals,
      isLoadingUserInfo,
      isLoadingPoolCriteria,
      isLoadingAllowance,
      isLoadingReward,
      isLoadingFee,
    ],
  )

  // Memoize pending action state to prevent recalculations
  const isPendingAction = useMemo(
    () => isApproving || isDepositing || isClaiming || isWaitingForApprove || isWaitingForDeposit || isWaitingForClaim,
    [isApproving, isDepositing, isClaiming, isWaitingForApprove, isWaitingForDeposit, isWaitingForClaim],
  )

  // Calculate minimum deposit amount outside of render
  const minDepositFormatted = useMemo(
    () => (poolCriteria && decimals ? Number(formatUnits(poolCriteria[0], decimals)).toLocaleString() : "0"),
    [poolCriteria, decimals],
  )

  // Pre-calculate button disabled states
  const claimButtonDisabled = useMemo(
    () => !isConnected || !availableReward || availableReward === 0n || isPendingAction || isLoadingReward,
    [isConnected, availableReward, isPendingAction, isLoadingReward],
  )

  const approveButtonDisabled = useMemo(() => {
    if (!isConnected || !depositAmount || Number(depositAmount) <= 0 || isPendingAction) {
      return true
    }

    if (balance && decimals) {
      try {
        const depositInWei = parseUnits(depositAmount, decimals)
        return depositInWei > balance
      } catch (error) {
        return true
      }
    }

    return false
  }, [isConnected, depositAmount, isPendingAction, balance, decimals])

  const depositButtonDisabled = useMemo(() => {
    if (!isConnected || !depositAmount || Number(depositAmount) <= 0 || isPendingAction) {
      return true
    }

    if (balance && decimals && poolCriteria) {
      try {
        const depositInWei = parseUnits(depositAmount, decimals)
        return depositInWei > balance || depositInWei < poolCriteria[0]
      } catch (error) {
        return true
      }
    }

    return false
  }, [isConnected, depositAmount, isPendingAction, balance, decimals, poolCriteria])

  // Pre-calculate if deposit is below minimum
  const isDepositBelowMinimum = useMemo(() => {
    if (!poolCriteria || !decimals || !depositAmount || Number(depositAmount) <= 0) {
      return false
    }

    try {
      const depositInWei = parseUnits(depositAmount, decimals)
      return depositInWei < poolCriteria[0]
    } catch (error) {
      return false
    }
  }, [poolCriteria, decimals, depositAmount])

  // Memoize formatted values to prevent recalculations during render
  const formattedBalance = useMemo(
    () =>
      balance && decimals
        ? `${Number(formatUnits(balance, decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`
        : "0 5PT",
    [balance, decimals],
  )

  const formattedTotalDeposited = useMemo(
    () =>
      userInfo && decimals
        ? `${Number(formatUnits(userInfo[0], decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`
        : "0 5PT",
    [userInfo, decimals],
  )

  const formattedAvailableRewards = useMemo(
    () =>
      availableReward && decimals
        ? `${Number(formatUnits(availableReward, decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`
        : "0 5PT",
    [availableReward, decimals],
  )

  const formattedLastClaim = useMemo(
    () => (userInfo && Number(userInfo[2]) > 0 ? new Date(Number(userInfo[2]) * 1000).toLocaleDateString() : "Never"),
    [userInfo],
  )

  // Calculate reward percentage
  const rewardPercentage = useMemo(() => {
    if (!userInfo || !availableReward || userInfo[0] === 0n) return 0
    return (Number(availableReward) / Number(userInfo[0])) * 100
  }, [userInfo, availableReward])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investment</CardTitle>
        <CardDescription>Manage your 5PT token investments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="deposit" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="rounded-full bg-muted p-6">
                  <Wallet className="h-10 w-10 text-gold-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to view your investment details and rewards
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-gold-500" />
                        <Label>Your Balance</Label>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" />
                      ) : (
                        <p className="text-xl font-bold">{formattedBalance}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-gold-500" />
                        <Label>Total Deposited</Label>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" />
                      ) : (
                        <p className="text-xl font-bold">{formattedTotalDeposited}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Coins className="mr-2 h-4 w-4 text-gold-500" />
                        <Label>Available Rewards</Label>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-[100px]" />
                      ) : (
                        <span className="font-medium">{formattedAvailableRewards}</span>
                      )}
                    </div>
                    <Progress value={rewardPercentage} max={100} className="h-2" indicatorClassName="bg-gold-500" />
                    <p className="text-xs text-muted-foreground">{rewardPercentage.toFixed(2)}% return on investment</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gold-500" />
                        <Label>Last Claim</Label>
                      </div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-[100px]" />
                      ) : (
                        <span className="font-medium">{formattedLastClaim}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Percent className="mr-2 h-4 w-4 text-gold-500" />
                        <Label>Reward Rate</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Current reward rate for investments</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {poolCriteria ? (
                        <span className="font-medium">{Number(poolCriteria[1]) / 100}%</span>
                      ) : (
                        <Skeleton className="h-5 w-[60px]" />
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                  onClick={handleClaimRewards}
                  disabled={claimButtonDisabled}
                >
                  {isClaiming || isWaitingForClaim ? (
                    <>
                      <span className="animate-pulse">Claiming...</span>
                    </>
                  ) : (
                    <>Claim Rewards</>
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="deposit" className="space-y-4">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="rounded-full bg-muted p-6">
                  <Wallet className="h-10 w-10 text-gold-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-medium">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">Connect your wallet to make a deposit</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount" className="flex items-center">
                      <Coins className="mr-2 h-4 w-4 text-gold-500" />
                      Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder={`Minimum ${minDepositFormatted} 5PT`}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        disabled={!isConnected || isPendingAction}
                        className="pr-16"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-sm text-muted-foreground">5PT</span>
                      </div>
                    </div>
                    {isDepositBelowMinimum && (
                      <p className="text-xs text-destructive">Minimum deposit is {minDepositFormatted} 5PT</p>
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Balance: {formattedBalance}</span>
                      <button
                        type="button"
                        className="text-gold-500 hover:underline"
                        onClick={() => {
                          if (balance && decimals) {
                            setDepositAmount(formatUnits(balance, decimals))
                          }
                        }}
                        disabled={!isConnected || !balance || balance === 0n}
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referrer" className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gold-500" />
                      Referrer (Optional)
                    </Label>
                    <Input
                      id="referrer"
                      placeholder="Enter referrer address"
                      value={referrer}
                      onChange={(e) => setReferrer(e.target.value)}
                      disabled={!isConnected || isPendingAction}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a referrer address to give them 5% of your deposit as a reward
                    </p>
                  </div>

                  <div className="rounded-lg border p-3 bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reward Rate:</span>
                      <span className="font-medium">
                        {poolCriteria ? (
                          `${Number(poolCriteria[1]) / 100}%`
                        ) : (
                          <Skeleton className="h-4 w-[40px] inline-block" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lock Period:</span>
                      <span className="font-medium">
                        {poolCriteria ? (
                          `${Number(poolCriteria[2])} days`
                        ) : (
                          <Skeleton className="h-4 w-[40px] inline-block" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fee:</span>
                      <span className="font-medium">
                        {feePercentage !== null ? (
                          `${Number(feePercentage) / 100}%`
                        ) : (
                          <Skeleton className="h-4 w-[40px] inline-block" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {needsApproval ? (
                  <Button
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    onClick={handleApprove}
                    disabled={approveButtonDisabled}
                  >
                    {isApproving || isWaitingForApprove ? (
                      <>
                        <span className="animate-pulse">Approving...</span>
                      </>
                    ) : (
                      <>Approve</>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    onClick={handleDeposit}
                    disabled={depositButtonDisabled}
                  >
                    {isDepositing || isWaitingForDeposit ? (
                      <>
                        <span className="animate-pulse">Depositing...</span>
                      </>
                    ) : (
                      <>Deposit</>
                    )}
                  </Button>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
