"use client"

import { useReadContract, useWriteContract } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI } from "@/lib/constants"
import { formatEther, parseEther } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import { parseBlockchainError } from "@/lib/blockchain-errors"

export function useTokenContract() {
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()

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

  // Read token balance
  const useTokenBalance = (address?: `0x${string}`) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: {
        enabled: !!address,
      },
    })
  }

  // Read token allowance
  const useTokenAllowance = (owner?: `0x${string}`, spender?: `0x${string}`) => {
    const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`
    return useReadContract({
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: "allowance",
      args: owner && spender ? [owner, spender || investmentManagerAddress] : undefined,
      query: {
        enabled: !!(owner && (spender || investmentManagerAddress)),
      },
    })
  }

  // Approve token spending
  const approveToken = async (amount: string, spender?: `0x${string}`) => {
    try {
      const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`
      const targetSpender = spender || investmentManagerAddress
      const parsedAmount = parseEther(amount)

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

  return {
    name,
    symbol,
    useTokenBalance,
    useTokenAllowance,
    approveToken,
    formatTokenAmount: (amount: bigint) => formatEther(amount),
    parseTokenAmount: (amount: string) => parseEther(amount),
  }
}
