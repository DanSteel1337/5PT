"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import { INVESTMENT_MANAGER_ABI, INVESTMENT_MANAGER_ADDRESS } from "@/lib/contracts"
import { useMounted } from "./use-mounted"

export function useInvestmentManager() {
  const mounted = useMounted()
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for development
  const mockData = {
    totalInvested: 5000,
    availableRewards: parseEther("125.75"),
    referrals: ["0x123...", "0x456...", "0x789..."],
    referralCommission: parseEther("42.5"),
    rank: 2,
  }

  // Read contract data
  const { data: investorData } = useReadContract({
    address: INVESTMENT_MANAGER_ADDRESS,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getInvestorData",
    args: [address],
    query: {
      enabled: !!address && mounted,
    },
  })

  // Write contract functions
  const { writeContractAsync } = useWriteContract()

  // Deposit function
  const deposit = async (poolId: number, amount: string, referrer?: string) => {
    if (!address || !INVESTMENT_MANAGER_ADDRESS) return

    try {
      setIsPending(true)

      await writeContractAsync({
        address: INVESTMENT_MANAGER_ADDRESS,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [poolId, parseEther(amount), referrer || "0x0000000000000000000000000000000000000000"],
      })

      // Success handling would go here
    } catch (error) {
      console.error("Deposit error:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Withdraw function
  const withdraw = async () => {
    if (!address || !INVESTMENT_MANAGER_ADDRESS) return

    try {
      setIsPending(true)

      await writeContractAsync({
        address: INVESTMENT_MANAGER_ADDRESS,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "withdraw",
      })

      // Success handling would go here
    } catch (error) {
      console.error("Withdraw error:", error)
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
    totalInvested: investorData ? Number(investorData[0]) : mockData.totalInvested,
    availableRewards: mockData.availableRewards,
    referrals: mockData.referrals,
    referralCommission: mockData.referralCommission,
    rank: mockData.rank,
  }

  return {
    data,
    deposit,
    withdraw,
    loading,
    isPending,
  }
}
