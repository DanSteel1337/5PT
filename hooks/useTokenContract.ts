"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import { TOKEN_ABI, TOKEN_ADDRESS, INVESTMENT_MANAGER_ADDRESS } from "@/lib/contracts"
import { useMounted } from "./use-mounted"

export function useTokenContract() {
  const mounted = useMounted()
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for development
  const mockData = {
    balance: parseEther("10000"),
    allowance: parseEther("0"),
  }

  // Read token balance
  const { data: balanceData } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address && mounted,
    },
  })

  // Read token allowance
  const { data: allowanceData } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: [address, INVESTMENT_MANAGER_ADDRESS],
    query: {
      enabled: !!address && !!INVESTMENT_MANAGER_ADDRESS && mounted,
    },
  })

  // Write contract functions
  const { writeContractAsync } = useWriteContract()

  // Approve function
  const approve = async (amount: string) => {
    if (!address || !TOKEN_ADDRESS || !INVESTMENT_MANAGER_ADDRESS) return

    try {
      setIsPending(true)

      await writeContractAsync({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [INVESTMENT_MANAGER_ADDRESS, parseEther(amount)],
      })

      // Success handling would go here
    } catch (error) {
      console.error("Approve error:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Simulate loading state with useEffect
  useEffect(() => {
    if (mounted && loading) {
      const timer = setTimeout(() => setLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [mounted, loading])

  // Combine real and mock data
  const data = {
    balance: balanceData || mockData.balance,
    allowance: allowanceData || mockData.allowance,
  }

  return {
    data,
    approve,
    loading,
    isPending,
  }
}
