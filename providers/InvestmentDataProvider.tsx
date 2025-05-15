"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState, useCallback } from "react"
import { useAccount, useReadContract } from "wagmi"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { useMounted } from "@/hooks/useMounted"
import type { InvestmentDataContextType, ProjectedEarnings, PoolInfo } from "@/types/investment"
import { Web3ProviderWrapper } from "@/components/providers/Web3ProviderWrapper"

// Default values to prevent undefined errors
const DEFAULT_VALUES: InvestmentDataContextType = {
  // User data with safe defaults
  userTotalDeposits: 0,
  userPoolRewards: 0,
  userReferralBonus: 0,
  userReferralCount: 0,
  userRank: 0,
  userTokenBalance: 0,

  // Pool data
  pools: [],
  userPoolEligibility: [],

  // Calculation results
  dailyRatePercent: 1.75, // Default daily rate
  projectedDailyYield: 0,
  projectedEarnings: {
    hourly: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  },

  // Token info
  tokenSymbol: "5PT",
  tokenDecimals: 18,

  // Status
  isLoading: true,
  isError: false,
  error: null,
  isConnected: false,

  // Actions
  refetch: async () => {},
}

// Create context with default values
const InvestmentDataContext = createContext<InvestmentDataContextType>(DEFAULT_VALUES)

/**
 * Inner provider component that uses wagmi hooks
 * This must be wrapped with Web3ProviderWrapper to ensure
 * wagmi hooks are only used after client-side hydration
 */
function InvestmentDataProviderInner({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const [error, setError] = useState<Error | null>(null)

  // Contract addresses - in production these would come from environment or config
  const investmentManagerAddress = "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`
  const tokenAddress = "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`

  // Fetch user investment data from contract
  const {
    data: investorData,
    isLoading: isLoadingInvestor,
    isError: isErrorInvestor,
    refetch: refetchInvestor,
  } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "accountToInvestorInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address && isConnected && mounted,
    },
  })

  // Fetch user token balance
  const {
    data: tokenBalance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address && isConnected && mounted,
    },
  })

  // Fetch pool data for all pools
  const {
    data: poolsData,
    isLoading: isLoadingPools,
    isError: isErrorPools,
    refetch: refetchPools,
  } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAllPools",
    query: {
      enabled: mounted,
    },
  })

  // Process pool data into a more usable format
  const pools: PoolInfo[] = useMemo(() => {
    if (!poolsData) return []

    try {
      // This is a placeholder - actual implementation would depend on contract structure
      return [
        {
          id: 1,
          name: "Starter Pool",
          dailyRate: 0.0175,
          minDeposit: 550,
          lockPeriod: 0,
          totalStaked: 1250000,
          isWhitelisted: false,
        },
        {
          id: 2,
          name: "Growth Pool",
          dailyRate: 0.0175,
          minDeposit: 1450,
          lockPeriod: 0,
          totalStaked: 2500000,
          isWhitelisted: false,
        },
        // Additional pools would be processed from poolsData
      ]
    } catch (err) {
      console.error("Error processing pool data:", err)
      setError(err instanceof Error ? err : new Error("Failed to process pool data"))
      return []
    }
  }, [poolsData])

  // Process user data
  const userData = useMemo(() => {
    if (!investorData || !address) {
      return {
        totalDeposits: 0,
        poolRewards: 0,
        referralBonus: 0,
        referralCount: 0,
        rank: 0,
      }
    }

    try {
      // This is a placeholder - actual implementation would depend on contract structure
      // Using nullish coalescing to prevent undefined errors
      return {
        totalDeposits: Number(investorData.totalDeposits ?? 0) / 10 ** 18,
        poolRewards: Number(investorData.poolRewards ?? 0) / 10 ** 18,
        referralBonus: Number(investorData.referralBonus ?? 0) / 10 ** 18,
        referralCount: Number(investorData.referralCount ?? 0),
        rank: Number(investorData.rank ?? 0),
      }
    } catch (err) {
      console.error("Error processing user data:", err)
      setError(err instanceof Error ? err : new Error("Failed to process user data"))
      return {
        totalDeposits: 0,
        poolRewards: 0,
        referralBonus: 0,
        referralCount: 0,
        rank: 0,
      }
    }
  }, [investorData, address])

  // Calculate projected earnings
  const projectedEarnings: ProjectedEarnings = useMemo(() => {
    const { totalDeposits } = userData
    const dailyRate = DEFAULT_VALUES.dailyRatePercent / 100

    // Calculate daily yield
    const dailyYield = totalDeposits * dailyRate

    return {
      hourly: dailyYield / 24,
      daily: dailyYield,
      weekly: dailyYield * 7,
      monthly: dailyYield * 30,
      yearly: dailyYield * 365,
    }
  }, [userData])

  // Check user eligibility for each pool
  const userPoolEligibility = useMemo(() => {
    return pools.map((pool) => {
      // This is a simplified check - actual implementation would be more complex
      return userData.totalDeposits >= pool.minDeposit
    })
  }, [pools, userData])

  // Combined loading state
  const isLoading = isLoadingInvestor || isLoadingBalance || isLoadingPools

  // Combined error state
  const isError = isErrorInvestor || isErrorBalance || isErrorPools

  // Combined refetch function
  const refetch = useCallback(async () => {
    try {
      await Promise.all([refetchInvestor(), refetchBalance(), refetchPools()])
    } catch (err) {
      console.error("Error refetching data:", err)
      setError(err instanceof Error ? err : new Error("Failed to refetch data"))
    }
  }, [refetchInvestor, refetchBalance, refetchPools])

  // Combine all data into context value
  const contextValue: InvestmentDataContextType = {
    // User data
    userTotalDeposits: userData.totalDeposits,
    userPoolRewards: userData.poolRewards,
    userReferralBonus: userData.referralBonus,
    userReferralCount: userData.referralCount,
    userRank: userData.rank,
    userTokenBalance: tokenBalance ? Number(tokenBalance) / 10 ** 18 : 0,

    // Pool data
    pools,
    userPoolEligibility,

    // Calculation results
    dailyRatePercent: DEFAULT_VALUES.dailyRatePercent,
    projectedDailyYield: projectedEarnings.daily,
    projectedEarnings,

    // Token info
    tokenSymbol: DEFAULT_VALUES.tokenSymbol,
    tokenDecimals: DEFAULT_VALUES.tokenDecimals,

    // Status
    isLoading,
    isError,
    error,
    isConnected,

    // Actions
    refetch,
  }

  return <InvestmentDataContext.Provider value={contextValue}>{children}</InvestmentDataContext.Provider>
}

/**
 * Main provider component that wraps the inner provider with Web3ProviderWrapper
 * This ensures that wagmi hooks are only used after client-side hydration
 */
export function InvestmentDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ProviderWrapper>
      <InvestmentDataProviderInner>{children}</InvestmentDataProviderInner>
    </Web3ProviderWrapper>
  )
}

/**
 * Custom hook to use investment data
 * Provides type-safe access to the investment data context
 */
export function useInvestmentData(): InvestmentDataContextType {
  const context = useContext(InvestmentDataContext)

  if (context === undefined) {
    throw new Error("useInvestmentData must be used within an InvestmentDataProvider")
  }

  return context
}
