"use client"

import { useState, useEffect, useMemo } from "react"
import { useAccount, useReadContract, useChainId } from "wagmi"
import { getContractAddress, INVESTMENT_MANAGER_ABI, TOKEN_ABI, REWARD_SYSTEM } from "@/lib/contracts"
import { formatTokenAmount } from "@/lib/utils"

export function useInvestmentData() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)
  const [userRank, setUserRank] = useState<number>(0)
  const [userTotalDeposits, setUserTotalDeposits] = useState<number>(0)
  const [userReferralBonus, setUserReferralBonus] = useState<number>(0)
  const [userReferralCount, setUserReferralCount] = useState<number>(0)
  const [userPoolRewards, setUserPoolRewards] = useState<number>(0)
  const [userDirectReferralVolume, setUserDirectReferralVolume] = useState<number>(0)
  const [userReferralVolume, setUserReferralVolume] = useState<number>(0)
  const [totalInvestors, setTotalInvestors] = useState<number>(0)
  const [totalValueLocked, setTotalValueLocked] = useState<number>(0)
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0)
  const [accumulatedRewards, setAccumulatedRewards] = useState<number>(0)
  const [lastRoundRewards, setLastRoundRewards] = useState<any>(null)
  const [poolEligibility, setPoolEligibility] = useState<boolean[]>(Array(9).fill(false))

  // Only run hooks after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get contract addresses
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)
  const tokenAddress = getContractAddress("fivePillarsToken", chainId)

  // Get token symbol
  const { data: tokenSymbol = "5PT" } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "symbol",
    query: {
      enabled: mounted,
    },
  })

  const { data: userData } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserInfo",
    args: [address],
    query: {
      enabled: mounted && isConnected && !!address,
      onSuccess(data) {
        setUserRank(Number(data[0]))
        setUserTotalDeposits(Number(data[1]))
        setUserReferralBonus(Number(data[2]))
        setUserReferralCount(Number(data[3]))
        setUserPoolRewards(Number(data[4]))
        setUserDirectReferralVolume(Number(data[5]))
        setUserReferralVolume(Number(data[6]))
      },
    },
  })

  const { data: totalData } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalInfo",
    query: {
      enabled: mounted,
      onSuccess(data) {
        setTotalInvestors(Number(data[0]))
        setTotalValueLocked(Number(data[1]))
      },
    },
  })

  const { data: tokenBalance } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: mounted && isConnected && !!address,
      onSuccess(data) {
        setUserTokenBalance(Number(data))
      },
    },
  })

  const { data: rewardsData } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserRewards",
    args: [address],
    query: {
      enabled: mounted && isConnected && !!address,
      onSuccess(data) {
        setAccumulatedRewards(Number(data[0]))
        setLastRoundRewards({
          dailyReward: Number(data[1][0]),
          refReward: Number(data[1][1]),
          poolsReward: Number(data[1][2]),
        })
      },
    },
  })

  const { data: poolEligibilityData } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "checkPoolEligibility",
    args: [address],
    query: {
      enabled: mounted && isConnected && !!address,
      onSuccess(data) {
        setPoolEligibility(data as boolean[])
      },
    },
  })

  const projectedYields = useMemo(() => {
    const daily = userTotalDeposits * REWARD_SYSTEM.dailyBonus
    const weekly = daily * 7
    const monthly = daily * 30
    const annual = daily * 365

    return {
      daily: formatTokenAmount(daily),
      weekly: formatTokenAmount(weekly),
      monthly: formatTokenAmount(monthly),
      annual: formatTokenAmount(annual),
    }
  }, [userTotalDeposits])

  // Return default values if not mounted yet
  if (!mounted) {
    return {
      isConnected: false,
      userRank: 0,
      userTotalDeposits: 0,
      userReferralBonus: 0,
      userReferralCount: 0,
      userPoolRewards: 0,
      userDirectReferralVolume: 0,
      userReferralVolume: 0,
      totalInvestors: 0,
      totalValueLocked: 0,
      tokenSymbol: "5PT",
      userTokenBalance: 0,
      projectedDailyYield: 0,
      projectedWeeklyYield: 0,
      projectedMonthlyYield: 0,
      projectedAnnualYield: 0,
      dailyRatePercent: 0.3, // Correct daily rate percentage
      accumulatedRewards: 0,
      lastRoundRewards: null,
      poolEligibility: Array(9).fill(false),
      isLoading: true,
    }
  }

  return {
    isConnected,
    userRank: Number(userRank),
    userTotalDeposits: formatTokenAmount(userTotalDeposits),
    userReferralBonus: formatTokenAmount(userReferralBonus),
    userReferralCount: Number(userReferralCount),
    userPoolRewards: formatTokenAmount(userPoolRewards),
    userDirectReferralVolume,
    userReferralVolume,
    totalInvestors: Number(totalInvestors),
    totalValueLocked: formatTokenAmount(totalValueLocked),
    tokenSymbol: tokenSymbol.toString(),
    userTokenBalance: formatTokenAmount(userTokenBalance),
    projectedDailyYield: projectedYields.daily,
    projectedWeeklyYield: projectedYields.weekly,
    projectedMonthlyYield: projectedYields.monthly,
    projectedAnnualYield: projectedYields.annual,
    dailyRatePercent: REWARD_SYSTEM.dailyBonus * 100, // Convert to percentage
    accumulatedRewards: accumulatedRewards ? formatTokenAmount(accumulatedRewards) : 0,
    lastRoundRewards: lastRoundRewards
      ? {
          dailyReward: formatTokenAmount(lastRoundRewards.dailyReward),
          refReward: formatTokenAmount(lastRoundRewards.refReward),
          poolsReward: formatTokenAmount(lastRoundRewards.poolsReward),
        }
      : null,
    poolEligibility,
    isLoading: false,
  }
}
