"\"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI, TOKEN_ABI } from "@/lib/contracts"
import { shouldUseMockData } from "@/lib/environment"

// Token contract hooks
export function useTokenContract() {
  return {
    useTokenDecimals: (options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContract({
        address: CONTRACT_ADDRESSES.token,
        abi: TOKEN_ABI,
        functionName: "decimals",
        query: {
          enabled: !useMockData && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
    useTokenTotalSupply: (options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContract({
        address: CONTRACT_ADDRESSES.token,
        abi: TOKEN_ABI,
        functionName: "totalSupply",
        query: {
          enabled: !useMockData && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
  }
}

// Investment manager hooks
export function useInvestmentManager() {
  return {
    useInvestmentData: (options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContracts({
        contracts: [
          {
            address: CONTRACT_ADDRESSES.investmentManager,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "getTotalDeposits",
          },
        ],
        query: {
          enabled: !useMockData && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
    useCalculateReward: (address?: `0x${string}`, options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContract({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "calculateReward",
        args: address ? [address] : undefined,
        query: {
          enabled: !useMockData && !!address && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
    usePoolCount: (options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContract({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "getPoolCount",
        query: {
          enabled: !useMockData && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
    useUserInvestmentData: (address?: `0x${string}`, options = {}) => {
      const useMockData = shouldUseMockData()
      return useReadContracts({
        contracts: [
          {
            address: CONTRACT_ADDRESSES.investmentManager,
            abi: INVESTMENT_MANAGER_ABI,
            functionName: "getUserInfo",
            args: address ? [address] : undefined,
          },
        ],
        query: {
          enabled: !useMockData && !!address && options?.enabled !== false,
          ...options?.query,
        },
      })
    },
  }
}

// ENS resolver mock
export function useEnsResolver() {
  return {
    useEnsName: (address?: `0x${string}`, options = {}) => {
      return {
        data: address ? `user-${address.substring(2, 6)}.eth` : undefined,
        isPending: false,
        isError: false,
        error: null,
      }
    },
  }
}
\
"
