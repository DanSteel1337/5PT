"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/constants"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { parseEther } from "ethers"
import { useTokenContract } from "./use-token-contract"
import { parseBlockchainError } from "@/lib/blockchain-errors"

// Validate contract address to prevent sending to incorrect addresses
const validateContractAddress = (address: string): boolean => {
  // Check if address is valid format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    console.error("Invalid contract address format:", address)
    return false
  }

  // Check if address is a known placeholder or zero address
  const invalidAddresses = [
    "0x0000000000000000000000000000000000000000",
    "0x123456789abcdef123456789abcdef123456789a",
    "0x123456789aBCdEF123456789aBCdef123456789A",
  ]

  if (invalidAddresses.includes(address.toLowerCase())) {
    console.error("Using placeholder/invalid contract address:", address)
    return false
  }

  // Verify it's the correct investment manager address
  const correctInvestmentManager = "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc".toLowerCase()
  if (address.toLowerCase() === correctInvestmentManager) {
    console.log("Verified correct investment manager address:", address)
    return true
  }

  // Verify it's the correct token address
  const correctToken = "0x8FafdFB035C9426a50D842873D5d401C933bE09F".toLowerCase()
  if (address.toLowerCase() === correctToken) {
    console.log("Verified correct token address:", address)
    return true
  }

  return false
}

// Get the validated investment manager address or throw an error
const getInvestmentManagerAddress = (): `0x${string}` => {
  const address = CONTRACT_ADDRESSES.investmentManager
  if (!validateContractAddress(address)) {
    throw new Error("Invalid investment manager contract address. Please update the address in constants.ts")
  }
  return address as `0x${string}`
}

// Custom hook for getting accumulated rewards
export function useAccumulatedRewards(address?: `0x${string}`) {
  const contractAddress = getInvestmentManagerAddress()
  return useReadContract({
    address: contractAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    query: {
      enabled: !!address && !!contractAddress,
    },
  })
}

// Custom hook for getting last round rewards
export function useLastRoundRewards(address?: `0x${string}`) {
  const contractAddress = getInvestmentManagerAddress()
  return useReadContract({
    address: contractAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getLastRoundRewards",
    query: {
      enabled: !!address && !!contractAddress,
    },
  })
}

// Custom hook for getting investor info
export function useInvestorInfo(address?: `0x${string}`) {
  const contractAddress = getInvestmentManagerAddress()
  return useReadContract({
    address: contractAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getInvestorInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  })
}

// Custom hook for getting pool info
export function usePoolInfo(poolId: number) {
  const contractAddress = getInvestmentManagerAddress()
  return useReadContract({
    address: contractAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getPoolInfo",
    args: [poolId],
  })
}

// Custom hook for checking if investor is in pool
export function useIsInvestorInPool(address?: `0x${string}`, poolId?: number) {
  const contractAddress = getInvestmentManagerAddress()
  return useReadContract({
    address: contractAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "isInvestorInPool",
    args: address && poolId !== undefined ? [address, poolId] : undefined,
    query: {
      enabled: !!(address && poolId !== undefined && contractAddress),
    },
  })
}

// Main investment manager hook
export function useInvestmentManager() {
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()
  const [depositHash, setDepositHash] = useState<`0x${string}` | undefined>()
  const [claimHash, setClaimHash] = useState<`0x${string}` | undefined>()
  const [lastError, setLastError] = useState<any>(null)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const { approveToken } = useTokenContract()

  // Transaction status
  const depositTx = useWaitForTransactionReceipt({
    hash: depositHash,
    onSuccess: () => {
      setIsDepositing(false)
    },
    onError: (error) => {
      console.error("Error in deposit transaction:", error)
      const parsedError = parseBlockchainError(error)
      setLastError(parsedError)
      setIsDepositing(false)

      toast({
        variant: "destructive",
        title: parsedError.title,
        description: parsedError.message,
      })
    },
  })

  const claimTx = useWaitForTransactionReceipt({
    hash: claimHash,
    onSuccess: () => {
      setIsClaiming(false)
    },
    onError: (error) => {
      console.error("Error in claim transaction:", error)
      const parsedError = parseBlockchainError(error)
      setLastError(parsedError)
      setIsClaiming(false)

      toast({
        variant: "destructive",
        title: parsedError.title,
        description: parsedError.message,
      })
    },
  })

  // Deposit tokens
  const deposit = async (amount: string, referer: `0x${string}` | undefined) => {
    try {
      setLastError(null)
      setIsDepositing(true)

      // Get and validate the investment manager address
      const investmentManagerAddress = getInvestmentManagerAddress()

      // Log the contract we're interacting with for verification
      console.log("Depositing to investment manager contract:", investmentManagerAddress)

      // First approve tokens
      await approveToken(amount, investmentManagerAddress)

      // Prepare the deposit parameters
      const amountInWei = parseEther(amount)
      const referrerAddress = referer || "0x0000000000000000000000000000000000000000"

      // Log the function call for verification
      console.log("Calling deposit function with params:", {
        amount: amountInWei.toString(),
        referer: referrerAddress,
      })

      // Then deposit - explicitly specify all parameters to ensure correct function call
      const tx = await writeContractAsync({
        address: investmentManagerAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [amountInWei, referrerAddress],
      })

      setDepositHash(tx)

      toast({
        title: "Deposit Submitted",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
      })

      return tx
    } catch (error) {
      console.error("Error depositing tokens:", error)
      setIsDepositing(false)

      // Parse the error to get user-friendly message
      const parsedError = parseBlockchainError(error)
      setLastError(parsedError)

      toast({
        variant: "destructive",
        title: parsedError.title,
        description: parsedError.message,
      })

      throw error
    }
  }

  // Claim rewards
  const claimReward = async () => {
    try {
      setLastError(null)
      setIsClaiming(true)

      // Get and validate the investment manager address
      const investmentManagerAddress = getInvestmentManagerAddress()

      // Log the contract we're interacting with for verification
      console.log("Claiming rewards from investment manager contract:", investmentManagerAddress)

      const tx = await writeContractAsync({
        address: investmentManagerAddress,
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
      setIsClaiming(false)

      // Parse the error to get user-friendly message
      const parsedError = parseBlockchainError(error)
      setLastError(parsedError)

      toast({
        variant: "destructive",
        title: parsedError.title,
        description: parsedError.message,
      })

      throw error
    }
  }

  return {
    deposit,
    claimReward,
    lastError,
    isDepositing,
    isClaiming,
    depositStatus: {
      isLoading: depositTx.isLoading || isDepositing,
      isSuccess: depositTx.isSuccess,
      isError: depositTx.isError,
    },
    claimStatus: {
      isLoading: claimTx.isLoading || isClaiming,
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
