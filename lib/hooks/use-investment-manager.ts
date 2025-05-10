"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/constants"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { parseEther } from "ethers"
import { useTokenContract } from "./use-token-contract"

// Custom hook for getting accumulated rewards
export function useAccumulatedRewards(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    query: {
      enabled: !!address,
    },
  })
}

// Custom hook for getting last round rewards
export function useLastRoundRewards(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getLastRoundRewards",
    query: {
      enabled: !!address,
    },
  })
}

// Custom hook for getting investor info
export function useInvestorInfo(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getInvestorInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

// Custom hook for getting pool info
export function usePoolInfo(poolId: number) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolInfo",
    args: [poolId],
  })
}

// Custom hook for checking if investor is in pool
export function useIsInvestorInPool(address?: `0x${string}`, poolId?: number) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "isInvestorInPool",
    args: address && poolId !== undefined ? [address, poolId] : undefined,
    query: {
      enabled: !!(address && poolId !== undefined),
    },
  })
}

// Main investment manager hook
export function useInvestmentManager() {
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()
  const [depositHash, setDepositHash] = useState<`0x${string}` | undefined>()
  const [claimHash, setClaimHash] = useState<`0x${string}` | undefined>()
  const { approveToken } = useTokenContract()

  // Transaction status
  const depositTx = useWaitForTransactionReceipt({ hash: depositHash })
  const claimTx = useWaitForTransactionReceipt({ hash: claimHash })

  // Deposit tokens
  const deposit = async (amount: string, referer: `0x${string}` | undefined) => {
    try {
      // First approve tokens
      const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`
      await approveToken(investmentManagerAddress, amount)

      // Then deposit
      const tx = await writeContractAsync({
        address: investmentManagerAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [parseEther(amount), referer || "0x0000000000000000000000000000000000000000"],
      })

      setDepositHash(tx)

      toast({
        title: "Deposit Submitted",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
      })

      return tx
    } catch (error) {
      console.error("Error depositing tokens:", error)
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
      throw error
    }
  }

  // Claim rewards
  const claimReward = async () => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.investmentManager as `0x${string}`,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "claimReward",
        args: [], // Explicitly provide an empty array for functions with no arguments
      })

      setClaimHash(tx)

      toast({
        title: "Claim Submitted",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
      })

      return tx
    } catch (error) {
      console.error("Error claiming rewards:", error)
      toast({
        variant: "destructive",
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
      throw error
    }
  }

  return {
    deposit,
    claimReward,
    depositStatus: {
      isLoading: depositTx.isLoading,
      isSuccess: depositTx.isSuccess,
      isError: depositTx.isError,
    },
    claimStatus: {
      isLoading: claimTx.isLoading,
      isSuccess: claimTx.isSuccess,
      isError: claimTx.isError,
    },
    usePoolInfo,
    useIsInvestorInPool,
    useInvestorInfo,
    useAccumulatedRewards,
    useLastRoundRewards,
  }
}
