"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CyberButton } from "@/components/ui/cyber-button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto } from "@/lib/utils"
import { REWARD_SYSTEM } from "@/lib/contracts"
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { getContractAddress, TOKEN_ABI, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { parseUnits } from "viem"
import { useChainId } from "wagmi"
import { Info, ArrowRight } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useMounted } from "@/hooks/useMounted"
import { CustomConnectButton } from "@/components/ui/custom-connect-button"

export function DepositForm() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const mounted = useMounted()

  const [amount, setAmount] = useState("")
  const [referrer, setReferrer] = useState("")
  const [isApproving, setIsApproving] = useState(false)

  const { tokenSymbol, userTokenBalance } = useInvestmentData()

  // Get contract addresses
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)
  const tokenAddress = getContractAddress("fivePillarsToken", chainId)

  // Check allowance
  const { data: allowance = 0n } = useReadContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: [address || "0x0000000000000000000000000000000000000000", investmentManagerAddress],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  // Write contract hooks
  const { writeContractAsync: approveToken } = useWriteContract()
  const { writeContract: deposit, data: depositHash, isPending, isError, error } = useWriteContract()

  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: depositHash,
  })

  // Handle deposit
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !isConnected) return

    try {
      const amountInWei = parseUnits(amount, 18)

      // Check if approval is needed
      if (allowance < amountInWei) {
        setIsApproving(true)
        await approveToken({
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: "approve",
          args: [investmentManagerAddress, amountInWei],
        })
        setIsApproving(false)
      }

      // Make deposit
      deposit({
        address: investmentManagerAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "deposit",
        args: [
          parseUnits(amount, 18),
          referrer ? (referrer as `0x${string}`) : "0x0000000000000000000000000000000000000000",
        ],
      })
    } catch (err) {
      console.error("Deposit error:", err)
      setIsApproving(false)
    }
  }

  // Calculate after-tax amount
  const calculateAfterTax = (value: string) => {
    if (!value) return "0"
    try {
      const numValue = Number.parseFloat(value)
      return (numValue * (1 - REWARD_SYSTEM.depositTaxPercent)).toFixed(6)
    } catch (e) {
      return "0"
    }
  }

  if (!mounted) return null

  if (!isConnected) {
    return (
      <Card className="glass-card-purple p-6">
        <h3 className="text-xl font-bold mb-4 text-gradient">Make a Deposit</h3>
        <div className="flex flex-col items-center justify-center py-6">
          <p className="text-gray-400 mb-4 text-center">
            Connect your wallet to make deposits and manage your investments.
          </p>
          <CustomConnectButton />
        </div>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className="glass-card-purple p-6">
        <h3 className="text-xl font-bold mb-4 text-gradient">Make a Deposit</h3>

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Amount ({tokenSymbol})
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 bg-black/50 border border-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                step="0.1"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
                onClick={() => setAmount(formatCrypto(userTokenBalance, "").trim())}
              >
                MAX
              </button>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Balance: {formatCrypto(userTokenBalance, tokenSymbol)}</span>
              <span className="text-xs text-gray-500">Min: 1 {tokenSymbol}</span>
            </div>
          </div>

          <div>
            <label htmlFor="referrer" className="block text-sm font-medium text-gray-300 mb-1">
              Referrer Address (Optional)
            </label>
            <input
              id="referrer"
              type="text"
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 bg-black/50 border border-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="bg-black/30 rounded-lg p-4 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Deposit Amount:</span>
              <span className="font-medium">{amount ? `${amount} ${tokenSymbol}` : `-`}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <Tooltip content="10% deposit tax is applied to all deposits">
                <TooltipTrigger asChild>
                  <span className="text-gray-400 flex items-center cursor-help">
                    Deposit Tax (10%):
                    <Info className="h-3 w-3 ml-1 text-gray-500" />
                  </span>
                </TooltipTrigger>
              </Tooltip>
              <span className="font-medium text-red-400">
                {amount
                  ? `-${(Number.parseFloat(amount) * REWARD_SYSTEM.depositTaxPercent).toFixed(6)} ${tokenSymbol}`
                  : `-`}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-gray-300">Net Investment:</span>
              <span className="font-medium text-green-400">
                {amount ? `${calculateAfterTax(amount)} ${tokenSymbol}` : `-`}
              </span>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-gray-300 mb-2">Projected Daily Earnings</h4>

            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Base (0.3%):</span>
              <span className="text-green-400">
                {amount
                  ? `+${(Number.parseFloat(calculateAfterTax(amount)) * 0.003).toFixed(6)} ${tokenSymbol}/day`
                  : `-`}
              </span>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              <p>• Additional earnings from referrals and pool rewards</p>
              <p>• 50% of rewards are automatically reinvested</p>
              <p>• 4-hour waiting period between deposits</p>
            </div>
          </div>

          <CyberButton type="submit" disabled={!amount || isApproving || isPending || isConfirming} className="w-full">
            {isApproving ? "Approving..." : isPending || isConfirming ? "Processing..." : "Deposit Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </CyberButton>

          {isError && (
            <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error?.message || "Transaction failed. Please try again."}
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg text-sm text-green-400">
              Deposit successful! Your investment has been added to the platform.
            </div>
          )}
        </form>
      </Card>
    </TooltipProvider>
  )
}
