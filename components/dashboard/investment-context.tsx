"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI, getContractAddress } from "@/lib/contracts"

interface InvestmentContextType {
  // User metrics
  userRank: number
  totalDeposits: bigint
  referralBonus: bigint
  referralCount: number
  poolRewards: bigint
  tokenBalance: bigint

  // Global metrics
  totalInvestors: number
  totalValueLocked: bigint
  accumulatedRewards: bigint
  lastRoundRewards: bigint

  // Formatted values
  formattedTotalDeposits: string
  formattedReferralBonus: string
  formattedPoolRewards: string
  formattedTokenBalance: string
  formattedTotalValueLocked: string

  // Status
  isLoading: boolean
  error: Error | null

  // Calculated metrics
  totalEarnings: bigint
  formattedTotalEarnings: string
  dailyEarningsRate: string
  projectedMonthlyEarnings: string
  projectedYearlyEarnings: string

  // Pool qualification
  poolQualifications: boolean[]
  nextPoolProgress: number

  // Refresh data
  refreshData: () => void
}

const defaultContext: InvestmentContextType = {
  userRank: 0,
  totalDeposits: BigInt(0),
  referralBonus: BigInt(0),
  referralCount: 0,
  poolRewards: BigInt(0),
  tokenBalance: BigInt(0),

  totalInvestors: 0,
  totalValueLocked: BigInt(0),
  accumulatedRewards: BigInt(0),
  lastRoundRewards: BigInt(0),

  formattedTotalDeposits: "0",
  formattedReferralBonus: "0",
  formattedPoolRewards: "0",
  formattedTokenBalance: "0",
  formattedTotalValueLocked: "0",

  isLoading: true,
  error: null,

  totalEarnings: BigInt(0),
  formattedTotalEarnings: "0",
  dailyEarningsRate: "0",
  projectedMonthlyEarnings: "0",
  projectedYearlyEarnings: "0",

  poolQualifications: [false, false, false, false, false],
  nextPoolProgress: 0,

  refreshData: () => {},
}

const InvestmentContext = createContext<InvestmentContextType>(defaultContext)

export function useInvestment() {
  return useContext(InvestmentContext)
}

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { address, chainId } = useAccount()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Contract addresses
  const investmentManagerAddress = getContractAddress("investmentManager", chainId || 56)
  const tokenAddress = getContractAddress("fivePillarsToken", chainId || 56)

  const enabled = !!address

  // User metrics
  const { data: userRank, isLoading: rankLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserRank",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  const { data: totalDeposits, isLoading: depositsLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  const { data: referralBonus, isLoading: referralBonusLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralBonus",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  const { data: referralCount, isLoading: referralCountLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  const { data: poolRewards, isLoading: poolRewardsLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserPoolRewards",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: enabled,
    },
  })

  // Global metrics
  const { data: totalInvestors, isLoading: investorsLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalInvestors",
    query: {
      enabled: enabled,
    },
  })

  const { data: totalValueLocked, isLoading: tvlLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalValueLocked",
    query: {
      enabled: enabled,
    },
  })

  const { data: accumulatedRewards, isLoading: accRewardsLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    query: {
      enabled: enabled,
    },
  })

  const { data: lastRoundRewards, isLoading: lastRewardsLoading } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getLastRoundRewards",
    query: {
      enabled: enabled,
    },
  })

  // Pool qualifications
  const poolQualifications = [false, false, false, false, false]
  for (let i = 0; i < 5; i++) {
    const { data: isInPool } = useReadContract({
      address: investmentManagerAddress,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "isInvestorInPool",
      args: [address as `0x${string}`, i],
      query: {
        enabled: enabled,
      },
    })
    if (isInPool) {
      poolQualifications[i] = true
    }
  }

  // Calculate derived metrics
  const totalEarnings = (referralBonus || BigInt(0)) + (poolRewards || BigInt(0))

  // Format values for display
  const formattedTotalDeposits = formatUnits(totalDeposits || BigInt(0), 18)
  const formattedReferralBonus = formatUnits(referralBonus || BigInt(0), 18)
  const formattedPoolRewards = formatUnits(poolRewards || BigInt(0), 18)
  const formattedTokenBalance = formatUnits(tokenBalance || BigInt(0), 18)
  const formattedTotalValueLocked = formatUnits(totalValueLocked || BigInt(0), 18)
  const formattedTotalEarnings = formatUnits(totalEarnings, 18)

  // Calculate earnings projections (optimistic for sharing)
  const dailyRate = Number(formattedTotalDeposits) * 0.008 // 0.8% daily
  const dailyEarningsRate = dailyRate.toFixed(2)
  const projectedMonthlyEarnings = (dailyRate * 30).toFixed(2)
  const projectedYearlyEarnings = (dailyRate * 365).toFixed(2)

  // Calculate next pool progress
  const nextPoolIndex = poolQualifications.lastIndexOf(true) + 1
  const nextPoolProgress =
    nextPoolIndex < 5 ? (Number(formattedTotalDeposits) / (550 * Math.pow(10, nextPoolIndex))) * 100 : 100

  // Loading and error states
  const isLoading =
    rankLoading ||
    depositsLoading ||
    referralBonusLoading ||
    referralCountLoading ||
    poolRewardsLoading ||
    tokenBalanceLoading ||
    investorsLoading ||
    tvlLoading ||
    accRewardsLoading ||
    lastRewardsLoading

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const value: InvestmentContextType = {
    userRank: Number(userRank || 0),
    totalDeposits: totalDeposits || BigInt(0),
    referralBonus: referralBonus || BigInt(0),
    referralCount: Number(referralCount || 0),
    poolRewards: poolRewards || BigInt(0),
    tokenBalance: tokenBalance || BigInt(0),

    totalInvestors: Number(totalInvestors || 0),
    totalValueLocked: totalValueLocked || BigInt(0),
    accumulatedRewards: accumulatedRewards || BigInt(0),
    lastRoundRewards: lastRoundRewards || BigInt(0),

    formattedTotalDeposits,
    formattedReferralBonus,
    formattedPoolRewards,
    formattedTokenBalance,
    formattedTotalValueLocked,

    isLoading,
    error: null,

    totalEarnings,
    formattedTotalEarnings,
    dailyEarningsRate,
    projectedMonthlyEarnings,
    projectedYearlyEarnings,

    poolQualifications,
    nextPoolProgress,

    refreshData,
  }

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>
}
