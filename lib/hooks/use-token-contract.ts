"use client"

import { useReadContract, useWriteContract, useAccount } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI } from "@/lib/constants"
import { formatEther, parseEther } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import { parseBlockchainError } from "@/lib/blockchain-errors"
import { useEffect, useState } from "react"

export function useTokenContract() {
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()
  const { address: connectedAddress, chain } = useAccount()
  const [tokenDecimals, setTokenDecimals] = useState<number>(18)

  // Read token decimals
  const { data: decimals, refetch: refetchDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Set token decimals when available
  useEffect(() => {
    if (decimals !== undefined) {
      setTokenDecimals(Number(decimals))
    }
  }, [decimals])

  // Read token name
  const { data: name } = useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "name",
  })

  // Read token symbol
  const { data: symbol } = useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "symbol",
  })

  // Read token balance with polling
  const useTokenBalance = (address?: `0x${string}`) => {
    const targetAddress = address || connectedAddress

    const { data, isError, isLoading, refetch } = useReadContract({
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "balanceOf",
      args: targetAddress ? [targetAddress] : undefined,
      query: {
        enabled: !!targetAddress,
        refetchInterval: 10000, // Refetch every 10 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
    })

    // Force refetch when chain changes
    useEffect(() => {
      if (chain) {
        refetch()
      }
    }, [chain, refetch])

    // Format the balance with the correct number of decimals
    const formattedBalance = data !== undefined ? formatTokenAmount(data) : "0"

    return {
      data,
      formattedBalance,
      isError,
      isLoading,
      refetch,
    }
  }

  // Read token allowance
  const useTokenAllowance = (owner?: `0x${string}`, spender?: `0x${string}`) => {
    const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`
    const targetOwner = owner || connectedAddress
    const targetSpender = spender || investmentManagerAddress

    return useReadContract({
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "allowance",
      args: targetOwner && targetSpender ? [targetOwner, targetSpender] : undefined,
      query: {
        enabled: !!(targetOwner && targetSpender),
        refetchInterval: 10000, // Refetch every 10 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
    })
  }

  // Approve token spending
  const approveToken = async (amount: string, spender?: `0x${string}`) => {
    try {
      const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`
      const targetSpender = spender || investmentManagerAddress
      const parsedAmount = parseTokenAmount(amount)

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.token as `0x${string}`,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [targetSpender, parsedAmount],
      })

      toast({
        title: "Approval Submitted",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
      })

      return tx
    } catch (error) {
      console.error("Error approving tokens:", error)

      // Parse the error to get user-friendly message
      const parsedError = parseBlockchainError(error)

      toast({
        variant: "destructive",
        title: parsedError.title,
        description: parsedError.message,
      })

      throw error
    }
  }

  // Format token amount considering token decimals
  const formatTokenAmount = (amount: bigint) => {
    try {
      // If decimals is 18, use formatEther directly
      if (tokenDecimals === 18) {
        return formatEther(amount)
      }

      // Otherwise, manually format with the correct number of decimals
      const divisor = BigInt(10) ** BigInt(tokenDecimals)
      const integerPart = amount / divisor
      const fractionalPart = amount % divisor

      // Convert to string and pad with leading zeros
      const fractionalStr = fractionalPart.toString().padStart(tokenDecimals, "0")

      // Combine integer and fractional parts
      return `${integerPart}.${fractionalStr}`
    } catch (error) {
      console.error("Error formatting token amount:", error)
      return "0"
    }
  }

  // Parse token amount considering token decimals
  const parseTokenAmount = (amount: string) => {
    try {
      // If decimals is 18, use parseEther directly
      if (tokenDecimals === 18) {
        return parseEther(amount)
      }

      // Otherwise, manually parse with the correct number of decimals
      const [integerPart, fractionalPart = ""] = amount.split(".")
      const paddedFractionalPart = fractionalPart.padEnd(tokenDecimals, "0").slice(0, tokenDecimals)
      const fullAmount = `${integerPart}${paddedFractionalPart}`

      return BigInt(fullAmount)
    } catch (error) {
      console.error("Error parsing token amount:", error)
      return BigInt(0)
    }
  }

  return {
    name,
    symbol,
    decimals: tokenDecimals,
    useTokenBalance,
    useTokenAllowance,
    approveToken,
    formatTokenAmount,
    parseTokenAmount,
  }
}
