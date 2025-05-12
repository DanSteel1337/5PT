"use client"

import { useReadContract, useReadContracts, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/wagmi-config"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI, REFERRAL_SYSTEM_ABI } from "@/lib/contracts"
import { formatUnits, parseUnits } from "viem"
import { useMemo } from "react"
import { shouldUseMockData } from "@/lib/environment"

/**
 * Custom hook for token contract interactions
 */
export function useTokenContract() {
  const useMockData = shouldUseMockData()

  // Get token name
  const useTokenName = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "name",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get token symbol
  const useTokenSymbol = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "symbol",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get token decimals
  const useTokenDecimals = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "decimals",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get token total supply
  const useTokenTotalSupply = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "totalSupply",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get token balance
  const useTokenBalance = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get all token data in a single batch request
  const useTokenData = (address?: `0x${string}`, options = {}) => {
    return useReadContracts({
      contracts: [
        {
          address: CONTRACT_ADDRESSES.token,
          abi: TOKEN_ABI,
          functionName: "name",
        },
        {
          address: CONTRACT_ADDRESSES.token,
          abi: TOKEN_ABI,
          functionName: "symbol",
        },
        {
          address: CONTRACT_ADDRESSES.token,
          abi: TOKEN_ABI,
          functionName: "decimals",
        },
        {
          address: CONTRACT_ADDRESSES.token,
          abi: TOKEN_ABI,
          functionName: "totalSupply",
        },
        ...(address
          ? [
              {
                address: CONTRACT_ADDRESSES.token,
                abi: TOKEN_ABI,
                functionName: "balanceOf",
                args: [address],
              },
            ]
          : []),
      ],
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })
  }

  // Format token amount with proper decimals
  const formatTokenAmount = (amount: bigint | undefined, decimals: number | undefined) => {
    if (!amount || decimals === undefined) return "0"
    return formatUnits(amount, decimals)
  }

  // Parse token amount with proper decimals
  const parseTokenAmount = (amount: string, decimals: number | undefined) => {
    if (!amount || decimals === undefined) return BigInt(0)
    return parseUnits(amount, decimals)
  }

  return {
    useTokenName,
    useTokenSymbol,
    useTokenDecimals,
    useTokenTotalSupply,
    useTokenBalance,
    useTokenData,
    formatTokenAmount,
    parseTokenAmount,
  }
}

/**
 * Custom hook for investment manager contract interactions
 */
export function useInvestmentManager() {
  const useMockData = shouldUseMockData()

  // Get total deposits
  const useTotalDeposits = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getTotalDeposits",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get total rewards
  const useTotalRewards = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getTotalRewards",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get fee percentage
  const useFeePercentage = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getFeePercentage",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get deposit delay
  const useDepositDelay = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getDepositDelay",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get pool criteria
  const usePoolCriteria = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getPoolCriteria",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get user info
  const useUserInfo = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getUserInfo",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Calculate reward
  const useCalculateReward = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "calculateReward",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get all investment data in a single batch request
  const useInvestmentData = (options = {}) => {
    return useReadContracts({
      contracts: [
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getTotalDeposits",
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getTotalRewards",
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getFeePercentage",
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getDepositDelay",
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getPoolCriteria",
        },
      ],
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })
  }

  // Get user investment data in a single batch request
  const useUserInvestmentData = (address?: `0x${string}`, options = {}) => {
    return useReadContracts({
      contracts: [
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getUserInfo",
          args: address ? [address] : undefined,
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "calculateReward",
          args: address ? [address] : undefined,
        },
      ],
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })
  }

  // Get investor count (mock implementation - would be a real contract call in production)
  const useInvestorCount = (options = {}) => {
    const result = useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getTotalDeposits",
      query: {
        enabled: !useMockData && options?.enabled !== false,
        ...options?.query,
      },
    })

    // In a real implementation, this would be a direct contract call
    // For now, we'll derive a mock count based on total deposits
    const investorCount = useMemo(() => {
      if (!result.data) return 0
      // Mock calculation: 1 investor per 1000 tokens
      const totalDeposits = result.data
      const decimals = 18 // Assuming 18 decimals
      const formattedDeposits = Number(formatUnits(totalDeposits, decimals))
      return Math.floor(formattedDeposits / 1000) + 3000 // Base of 3000 investors
    }, [result.data])

    return {
      ...result,
      data: investorCount,
    }
  }

  // Make a deposit
  const useDeposit = () => {
    return useWriteContract()
  }

  // Withdraw funds
  const useWithdraw = () => {
    return useWriteContract()
  }

  // Claim rewards
  const useClaimRewards = () => {
    return useWriteContract()
  }

  // Add these additional hooks to the useInvestmentManager function

  // Get accumulated rewards for a user
  const useAccumulatedRewards = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getAccumulatedRewards",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get last round rewards for a user
  const useLastRoundRewards = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getLastRoundRewards",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get pool qualification status
  const usePoolQualification = (address?: `0x${string}`, poolId?: number, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "isQualifiedForPool",
      args: address && poolId !== undefined ? [address, BigInt(poolId)] : undefined,
      query: {
        enabled: !useMockData && !!address && poolId !== undefined && options?.enabled !== false,
        ...options?.query,
      },
    })

  return {
    useTotalDeposits,
    useTotalRewards,
    useFeePercentage,
    useDepositDelay,
    usePoolCriteria,
    useUserInfo,
    useCalculateReward,
    useInvestorCount,
    useInvestmentData,
    useUserInvestmentData,
    useDeposit,
    useWithdraw,
    useClaimRewards,
    useAccumulatedRewards,
    useLastRoundRewards,
    usePoolQualification,
  }
}

/**
 * Custom hook for referral system contract interactions
 */
export function useReferralSystem() {
  const useMockData = shouldUseMockData()

  // Get referrer
  const useReferrer = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.referralSystem,
      abi: REFERRAL_SYSTEM_ABI,
      functionName: "getReferrer",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get direct referrals
  const useDirectReferrals = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.referralSystem,
      abi: REFERRAL_SYSTEM_ABI,
      functionName: "getDirectReferrals",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get referral count
  const useReferralCount = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.referralSystem,
      abi: REFERRAL_SYSTEM_ABI,
      functionName: "getReferralCount",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get referral rewards
  const useReferralRewards = (address?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.referralSystem,
      abi: REFERRAL_SYSTEM_ABI,
      functionName: "getReferralRewards",
      args: address ? [address] : undefined,
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })

  // Get all referral data in a single batch request
  const useReferralData = (address?: `0x${string}`, options = {}) => {
    return useReadContracts({
      contracts: [
        {
          address: CONTRACT_ADDRESSES.referralSystem,
          abi: REFERRAL_SYSTEM_ABI,
          functionName: "getReferrer",
          args: address ? [address] : undefined,
        },
        {
          address: CONTRACT_ADDRESSES.referralSystem,
          abi: REFERRAL_SYSTEM_ABI,
          functionName: "getDirectReferrals",
          args: address ? [address] : undefined,
        },
        {
          address: CONTRACT_ADDRESSES.referralSystem,
          abi: REFERRAL_SYSTEM_ABI,
          functionName: "getReferralCount",
          args: address ? [address] : undefined,
        },
        {
          address: CONTRACT_ADDRESSES.referralSystem,
          abi: REFERRAL_SYSTEM_ABI,
          functionName: "getReferralRewards",
          args: address ? [address] : undefined,
        },
      ],
      query: {
        enabled: !useMockData && !!address && options?.enabled !== false,
        ...options?.query,
      },
    })
  }

  // Register referrer
  const useRegisterReferrer = () => {
    return useWriteContract()
  }

  // Claim referral rewards
  const useClaimReferralRewards = () => {
    return useWriteContract()
  }

  return {
    useReferrer,
    useDirectReferrals,
    useReferralCount,
    useReferralRewards,
    useReferralData,
    useRegisterReferrer,
    useClaimReferralRewards,
  }
}
