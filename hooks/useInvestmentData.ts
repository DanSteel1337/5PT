"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useChainId } from "wagmi"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI, getContractAddress, REWARD_SYSTEM } from "@/lib/contracts"

export function useInvestmentData() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)

  // Only run hooks after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get contract addresses
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)
  const tokenAddress = getContractAddress("fivePillarsToken", chainId)

  // Get user rank
  const { data: userRank = 0 } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserRank",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get user total deposits
  const { data: userTotalDeposits = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get user referral bonus
  const { data: userReferralBonus = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralBonus",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get user referral count
  const { data: userReferralCount = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get user pool rewards
  const { data: userPoolRewards = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserPoolRewards",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get total investors
  const { data: totalInvestors = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalInvestors",
    query: {
      enabled: mounted,
    },
  })

  // Get total value locked
  const { data: totalValueLocked = 0n } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalValueLocked",
    query: {
      enabled: mounted,
    },
  })

  // Get token decimals
  const { data: tokenDecimals = 18n } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: mounted,
    },
  })

  // Get token symbol
  const { data: tokenSymbol = "5PT" } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "symbol",
    query: {
      enabled: mounted,
    },
  })

  // Get user token balance
  const { data: userTokenBalance = 0n } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Get user referrals
  const { data: userReferrals = [] } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferrals",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Format values with proper decimals
  const formatTokenAmount = (amount: bigint) => {
    return Number(amount) / 10 ** Number(tokenDecimals)
  }

  // Calculate projected yields based on reward system
  const calculateProjectedYields = () => {
    const deposit = formatTokenAmount(userTotalDeposits)

    // Use the actual reward rates from the contract or fallback to default
    const dailyRate = REWARD_SYSTEM?.dailyBonus || 0.008 // 0.8% daily as fallback
    const dailyYield = deposit * dailyRate

    return {
      daily: dailyYield,
      weekly: dailyYield * 7,
      monthly: dailyYield * 30,
      annual: dailyYield * 365,
    }
  }

  const projectedYields = calculateProjectedYields()

  // Return default values if not mounted yet
  if (!mounted) {
    return {
      isConnected: false,
      userRank: 0,
      userTotalDeposits: 0,
      userReferralBonus: 0,
      userReferralCount: 0,
      userPoolRewards: 0,
      totalInvestors: 0,
      totalValueLocked: 0,
      tokenSymbol: "5PT",
      userTokenBalance: 0,
      userReferrals: [],
      projectedDailyYield: 0,
      projectedWeeklyYield: 0,
      projectedMonthlyYield: 0,
      projectedAnnualYield: 0,
      dailyRatePercent: 0.8, // Default daily rate percentage
    }
  }

  return {
    isConnected,
    userRank: Number(userRank),
    userTotalDeposits: formatTokenAmount(userTotalDeposits),
    userReferralBonus: formatTokenAmount(userReferralBonus),
    userReferralCount: Number(userReferralCount),
    userPoolRewards: formatTokenAmount(userPoolRewards),
    totalInvestors: Number(totalInvestors),
    totalValueLocked: formatTokenAmount(totalValueLocked),
    tokenSymbol: tokenSymbol.toString(),
    userTokenBalance: formatTokenAmount(userTokenBalance),
    userReferrals,
    projectedDailyYield: projectedYields.daily,
    projectedWeeklyYield: projectedYields.weekly,
    projectedMonthlyYield: projectedYields.monthly,
    projectedAnnualYield: projectedYields.annual,
    dailyRatePercent: (REWARD_SYSTEM?.dailyBonus || 0.008) * 100, // Convert to percentage
  }
}
