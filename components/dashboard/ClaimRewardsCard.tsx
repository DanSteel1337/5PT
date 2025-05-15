"use client"
import { Card } from "@/components/ui/card"
import { CyberButton } from "@/components/ui/cyber-button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto } from "@/lib/utils"
import { REWARD_SYSTEM } from "@/lib/contracts"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { getContractAddress, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { useChainId } from "wagmi"
import { ArrowDown, ArrowUp, RefreshCw, Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useMounted } from "@/hooks/useMounted"

export function ClaimRewardsCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const mounted = useMounted()

  const { accumulatedRewards, tokenSymbol } = useInvestmentData()

  // Get contract address
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)

  // Write contract hook
  const { writeContract: claimReward, data: claimHash, isPending, isError, error } = useWriteContract()

  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
  })

  // Handle claim
  const handleClaim = async () => {
    if (!isConnected || !accumulatedRewards || accumulatedRewards <= 0) return

    try {
      claimReward({
        address: investmentManagerAddress,
        abi: INVESTMENT_MANAGER_ABI,
        functionName: "claimReward",
      })
    } catch (err) {
      console.error("Claim error:", err)
    }
  }

  // Calculate after-tax amount
  const afterTaxAmount = accumulatedRewards * (1 - REWARD_SYSTEM.claimTaxPercent)

  // Calculate wallet and reinvestment amounts
  const toWallet = afterTaxAmount * (1 - REWARD_SYSTEM.reinvestmentPercent)
  const toReinvest = afterTaxAmount * REWARD_SYSTEM.reinvestmentPercent

  if (!mounted) return null

  return (
    <TooltipProvider>
      <Card className="glass-card-purple p-6">
        <h3 className="text-xl font-bold mb-4 text-gradient">Claim Rewards</h3>

        <div className="bg-black/40 rounded-lg p-5 border border-purple-500/20 mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm mb-1">Available Rewards</p>
            <p className="text-3xl font-bold text-gradient">{formatCrypto(accumulatedRewards, tokenSymbol)}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded">
              <Tooltip content="10% claim tax is applied to all rewards">
                <TooltipTrigger asChild>
                  <span className="text-gray-400 flex items-center cursor-help">
                    Claim Tax (10%):
                    <Info className="h-3 w-3 ml-1 text-gray-500" />
                  </span>
                </TooltipTrigger>
              </Tooltip>
              <span className="font-medium text-red-400">
                -{formatCrypto(accumulatedRewards * REWARD_SYSTEM.claimTaxPercent, tokenSymbol)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded">
              <Tooltip content="50% of post-tax rewards go to your wallet">
                <TooltipTrigger asChild>
                  <span className="text-gray-400 flex items-center cursor-help">
                    <ArrowDown className="h-4 w-4 mr-1 text-green-400" />
                    To Wallet (50%):
                  </span>
                </TooltipTrigger>
              </Tooltip>
              <span className="font-medium text-green-400">+{formatCrypto(toWallet, tokenSymbol)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-black/30 rounded">
              <Tooltip content="50% of post-tax rewards are automatically reinvested">
                <TooltipTrigger asChild>
                  <span className="text-gray-400 flex items-center cursor-help">
                    <RefreshCw className="h-4 w-4 mr-1 text-purple-400" />
                    Auto-Reinvested (50%):
                  </span>
                </TooltipTrigger>
              </Tooltip>
              <span className="font-medium text-purple-400">+{formatCrypto(toReinvest, tokenSymbol)}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <p className="text-sm text-gray-300">
              Reinvesting increases your daily earnings by {formatCrypto(toReinvest * 0.003, tokenSymbol)}/day
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Claim rewards at any time. 50% of post-tax rewards are automatically reinvested to compound your earnings.
          </p>
        </div>

        <CyberButton
          onClick={handleClaim}
          disabled={!accumulatedRewards || accumulatedRewards <= 0 || isPending || isConfirming}
          className="w-full"
        >
          {isPending || isConfirming ? "Processing..." : `Claim ${formatCrypto(accumulatedRewards, tokenSymbol)}`}
        </CyberButton>

        {isError && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-400">
            {error?.message || "Transaction failed. Please try again."}
          </div>
        )}

        {isConfirmed && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg text-sm text-green-400">
            Rewards claimed successfully! Check your wallet balance.
          </div>
        )}
      </Card>
    </TooltipProvider>
  )
}
