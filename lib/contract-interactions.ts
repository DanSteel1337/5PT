"use client"

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/wagmi-config"
import { INVESTMENT_MANAGER_ABI, TOKEN_ABI, DEX_ROUTER_ABI } from "@/lib/contracts"
import { formatUnits, parseUnits } from "viem"
import { useMemo } from "react"
import { isPreviewEnvironment } from "@/lib/environment"
import { safelyHandleBytes } from "./binary-utils"

// Type for binary data that properly handles Uint8Array
type BinaryData = Uint8Array | string | number[] | readonly number[]

/**
 * Process transaction data safely
 * This fixes the "u[a] is undefined" error by properly handling byte arrays
 */
export function processTransactionData(data: BinaryData): Uint8Array {
  // Convert to Uint8Array safely using our utility
  return safelyHandleBytes(data)
}

/**
 * Decode log data from events
 */
export function decodeLogData(topics: string[], data: string) {
  // Convert hex strings to Uint8Array properly
  const topicsBytes = topics.map((topic) => safelyHandleBytes(topic))
  const dataBytes = safelyHandleBytes(data)

  // Now we can safely process the bytes
  return { topicsBytes, dataBytes }
}

/**
 * Custom hook for token approval with proper binary data handling
 */
export function useTokenApproval(spender: `0x${string}`, amount: bigint) {
  const { writeContract, isPending, data: hash } = useWriteContract()

  const approve = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [spender, amount],
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

/**
 * Custom hook for investment with proper binary data handling
 */
export function useInvestment(amount: bigint, referrer: `0x${string}` | undefined) {
  const { writeContract, isPending, data: hash } = useWriteContract()

  const invest = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "deposit",
      args: [amount, referrer || "0x0000000000000000000000000000000000000000"],
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    invest,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

/**
 * Custom hook for token contract interactions
 */
export function useTokenContract() {
  const isPreview = isPreviewEnvironment()

  // Get token name
  const useTokenName = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "name",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get token symbol
  const useTokenSymbol = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "symbol",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get token decimals
  const useTokenDecimals = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "decimals",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get token total supply
  const useTokenTotalSupply = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "totalSupply",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
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
        enabled: !isPreview && !!address && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get token allowance
  const useTokenAllowance = (owner?: `0x${string}`, spender?: `0x${string}`, options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.token,
      abi: TOKEN_ABI,
      functionName: "allowance",
      args: owner && spender ? [owner, spender] : undefined,
      query: {
        enabled: !isPreview && !!owner && !!spender && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Approve token spending
  const useApproveToken = () => {
    const { writeContractAsync, isPending, error } = useWriteContract()

    const approveToken = async (spender: `0x${string}`, amount: bigint) => {
      if (isPreview) {
        console.log("Preview mode: Approve token spending simulation")
        return { hash: "0x" + "0".repeat(64) }
      }

      return writeContractAsync({
        address: CONTRACT_ADDRESSES.token,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [spender, amount],
      })
    }

    return { approveToken, isPending, error }
  }

  // Transfer tokens
  const useTransferToken = () => {
    const { writeContractAsync, isPending, error } = useWriteContract()

    const transferToken = async (recipient: `0x${string}`, amount: bigint) => {
      if (isPreview) {
        console.log("Preview mode: Transfer token simulation")
        return { hash: "0x" + "0".repeat(64) }
      }

      return writeContractAsync({
        address: CONTRACT_ADDRESSES.token,
        abi: TOKEN_ABI,
        functionName: "transfer",
        args: [recipient, amount],
      })
    }

    return { transferToken, isPending, error }
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
    useTokenAllowance,
    useApproveToken,
    useTransferToken,
    formatTokenAmount,
    parseTokenAmount,
  }
}

/**
 * Custom hook for investment manager contract interactions
 */
export function useInvestmentManager() {
  const isPreview = isPreviewEnvironment()

  // Get total deposits
  const useTotalDeposits = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getTotalDeposits",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get total rewards
  const useTotalRewards = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getTotalRewards",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get fee percentage
  const useFeePercentage = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getFeePercentage",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get deposit delay
  const useDepositDelay = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getDepositDelay",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get pool criteria
  const usePoolCriteria = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getPoolCriteria",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
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
        enabled: !isPreview && !!address && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
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
        enabled: !isPreview && !!address && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Get pool count
  const usePoolCount = (options = {}) =>
    useReadContract({
      address: CONTRACT_ADDRESSES.investmentManager,
      abi: INVESTMENT_MANAGER_ABI,
      functionName: "getPoolCount",
      query: {
        enabled: !isPreview && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

  // Deposit tokens
  const useDeposit = () => {
    const { writeContractAsync, isPending, error } = useWriteContract()

    const deposit = async (amount: bigint) => {
      if (isPreview) {
        console.log("Preview mode: Deposit simulation")
        return { hash: "0x" + "0".repeat(64) }
      }

      return writeContractAsync({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [amount],
      })
    }

    return { deposit, isPending, error }
  }

  // Withdraw tokens
  const useWithdraw = () => {
    const { writeContractAsync, isPending, error } = useWriteContract()

    const withdraw = async () => {
      if (isPreview) {
        console.log("Preview mode: Withdraw simulation")
        return { hash: "0x" + "0".repeat(64) }
      }

      return writeContractAsync({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "withdraw",
      })
    }

    return { withdraw, isPending, error }
  }

  // Claim rewards
  const useClaimRewards = () => {
    const { writeContractAsync, isPending, error } = useWriteContract()

    const claimRewards = async () => {
      if (isPreview) {
        console.log("Preview mode: Claim rewards simulation")
        return { hash: "0x" + "0".repeat(64) }
      }

      return writeContractAsync({
        address: CONTRACT_ADDRESSES.investmentManager,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "claimRewards",
      })
    }

    return { claimRewards, isPending, error }
  }

  // Get multiple contract data at once
  const useInvestmentOverview = (address?: `0x${string}`, options = {}) => {
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
    ]

    // Add user-specific contracts if address is provided
    if (address) {
      contracts.push(
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "getUserInfo",
          args: [address],
        },
        {
          address: CONTRACT_ADDRESSES.investmentManager,
          abi: INVESTMENT_MANAGER_ABI,
          functionName: "calculateReward",
          args: [address],
        },
      )
    }

    const result = useReadContracts({
      contracts,
      query: {
        enabled: !isPreview && (address ? !!address : true) && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

    // Process the results
    const processedData = useMemo(() => {
      if (!result.data) return null

      const [totalDeposits, totalRewards, feePercentage, ..._rest] = result.data
      const userInfo = address ? result.data[3] : null
      const pendingReward = address ? result.data[4] : null

      return {
        totalDeposits: totalDeposits.result as bigint,
        totalRewards: totalRewards.result as bigint,
        feePercentage: feePercentage.result as bigint,
        userInfo: userInfo?.result,
        pendingReward: pendingReward?.result as bigint,
      }
    }, [result.data, address])

    return {
      ...result,
      data: processedData,
    }
  }

  return {
    useTotalDeposits,
    useTotalRewards,
    useFeePercentage,
    useDepositDelay,
    usePoolCriteria,
    useUserInfo,
    useCalculateReward,
    usePoolCount,
    useDeposit,
    useWithdraw,
    useClaimRewards,
    useInvestmentOverview,
  }
}

/**
 * Custom hook for DEX router contract interactions
 */
export function useDexRouter() {
  const isPreview = isPreviewEnvironment()

  // Get token price
  const useTokenPrice = (tokenAddress?: `0x${string}`, options = {}) => {
    const result = useReadContract({
      address: CONTRACT_ADDRESSES.dexRouter,
      abi: DEX_ROUTER_ABI,
      functionName: "getAmountsOut",
      args: tokenAddress ? [parseUnits("1", 18), [tokenAddress, CONTRACT_ADDRESSES.wbnb]] : undefined,
      query: {
        enabled: !isPreview && !!tokenAddress && (options as any)?.enabled !== false,
        ...((options as any)?.query || {}),
      },
    })

    // Process the result
    const price = useMemo(() => {
      if (!result.data) return null
      const amounts = result.data as bigint[]
      return amounts[1]
    }, [result.data])

    return {
      ...result,
      data: price,
    }
  }

  return {
    useTokenPrice,
  }
}
