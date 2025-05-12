"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/wagmi-config"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useMemo, useState, useEffect } from "react"
import { shouldUseMockData } from "@/lib/environment"
import { logger } from "@/lib/debug-utils"

// Debug helper for hooks
function debugHook(hookName: string, args: any = {}, result: any = {}) {
  logger.debug("contract-hooks", `${hookName} called`, { args, result })
  return result
}

// Token contract hooks - export directly
export function useTokenDecimals(options = {}) {
  logger.debug("contract-hooks", "useTokenDecimals called", { options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useTokenDecimals mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useTokenDecimals unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: 18,
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contractCall = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: mounted && !useMockData && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "useTokenDecimals result", result)
  return result
}

export function useTokenTotalSupply(options = {}) {
  logger.debug("contract-hooks", "useTokenTotalSupply called", { options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useTokenTotalSupply mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useTokenTotalSupply unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: BigInt("1000000000000000000000000"),
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contractCall = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
    query: {
      enabled: mounted && !useMockData && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "useTokenTotalSupply result", result)
  return result
}

export function useTokenBalance(address?: `0x${string}`, options = {}) {
  logger.debug("contract-hooks", "useTokenBalance called", { address, options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useTokenBalance mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useTokenBalance unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: BigInt("1000000000000000000000"),
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contractCall = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: mounted && !useMockData && !!address && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "useTokenBalance result", result)
  return result
}

// Investment manager hooks - export directly
export function useInvestmentData(options = {}) {
  logger.debug("contract-hooks", "useInvestmentData called", { options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useInvestmentData mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useInvestmentData unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: [
        BigInt("5000000000000000000000"), // totalDeposits
        BigInt("1000000000000000000000"), // totalRewards
        BigInt("500"), // feePercentage (5%)
        BigInt("86400"), // depositDelay (1 day)
        [BigInt("1000000000000000000"), BigInt("5000000000000000000")], // poolCriteria
      ],
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contracts = [
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
  ] as const

  const contractCall = useReadContracts({
    contracts,
    query: {
      enabled: mounted && !useMockData && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "useInvestmentData result", result)
  return result
}

export function useUserInvestmentData(address?: `0x${string}`, options = {}) {
  logger.debug("contract-hooks", "useUserInvestmentData called", { address, options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useUserInvestmentData mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useUserInvestmentData unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: [
        [BigInt("1000000000000000000000"), BigInt("100000000000000000000"), BigInt("1630000000")], // userInfo
        BigInt("50000000000000000000"), // reward
      ],
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contracts = [
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
  ] as const

  const contractCall = useReadContracts({
    contracts,
    query: {
      enabled: mounted && !useMockData && !!address && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "useUserInvestmentData result", result)
  return result
}

export function usePoolCount(options = {}) {
  logger.debug("contract-hooks", "usePoolCount called", { options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "usePoolCount mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "usePoolCount unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: BigInt("5"),
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contractCall = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolCount",
    query: {
      enabled: mounted && !useMockData && options?.enabled !== false,
      ...options?.query,
    },
  })

  const result = useMockData ? mockData : contractCall

  logger.debug("contract-hooks", "usePoolCount result", result)
  return result
}

export function useInvestorCount(options = {}) {
  logger.debug("contract-hooks", "useInvestorCount called", { options })

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    logger.debug("contract-hooks", "useInvestorCount mounted")
    setMounted(true)
    return () => logger.debug("contract-hooks", "useInvestorCount unmounted")
  }, [])

  const useMockData = shouldUseMockData()

  const mockData = useMemo(
    () => ({
      data: 3500,
      isLoading: false,
      isError: false,
      error: null,
    }),
    [],
  )

  const contractCall = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalDeposits",
    query: {
      enabled: mounted && !useMockData && options?.enabled !== false,
      ...options?.query,
    },
  })

  // In a real implementation, this would be a direct contract call
  // For now, we'll derive a mock count based on total deposits
  const investorCount = useMemo(() => {
    if (!contractCall.data) return 0
    // Mock calculation: 1 investor per 1000 tokens
    const totalDeposits = contractCall.data
    const decimals = 18 // Assuming 18 decimals
    const formattedDeposits = Number(formatUnits(totalDeposits, decimals))
    return Math.floor(formattedDeposits / 1000) + 3000 // Base of 3000 investors
  }, [contractCall.data])

  const finalResult = {
    ...contractCall,
    data: useMockData ? mockData.data : investorCount,
    isLoading: contractCall.isLoading,
    isError: contractCall.isError,
    error: contractCall.error,
  }

  logger.debug("contract-hooks", "useInvestorCount result", finalResult)
  return finalResult
}

// ENS resolver hooks - export directly
export function useEnsResolver(options = {}) {
  logger.debug("contract-hooks", "useEnsResolver called", { options })

  return {
    useEnsName: (address?: `0x${string}`, options = {}) => {
      logger.debug("contract-hooks", "useEnsName called", { address, options })

      return {
        data: address ? `user-${address.substring(2, 6)}.eth` : undefined,
        isPending: false,
        isError: false,
        error: null,
      }
    },
  }
}

// Add back the useInvestmentManager function for backward compatibility
// This returns references to the directly exported hooks
export function useInvestmentManager() {
  logger.debug("contract-hooks", "useInvestmentManager called")

  return {
    usePoolCount,
    useInvestmentData,
    useUserInvestmentData,
    useInvestorCount,
    useTokenDecimals, // Add this line to include useTokenDecimals
    useTokenTotalSupply, // Add this line to include useTokenTotalSupply
    useTokenBalance, // Add this line to include useTokenBalance
    useTokenContract,
  }
}

// Export the useTokenContract hook
export function useTokenContract() {
  logger.debug("contract-hooks", "useTokenContract called")

  return {
    useTokenDecimals,
    useTokenTotalSupply,
    useTokenBalance,
  }
}

// Export all hooks directly for easier imports
