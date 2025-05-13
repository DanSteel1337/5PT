// components/rewards/RewardsClaimer.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { useFivePillarsToken } from "@/hooks/useFivePillarsToken"
import { formatUnits, parseUnits } from "viem"
import { TransactionStatus } from "@/types/contracts"
import { useWaitForTransactionReceipt } from "wagmi"
import { motion } from "framer-motion"

export function RewardsClaimer() {
  const [mounted, setMounted] = useState(false)
  const { useInvestorInfo, useClaimRewards } = useInvestmentManager()
  const { useTokenInfo } = useFivePillarsToken()

  const { data: investorInfo, isLoading, isError, refetch } = useInvestorInfo()
  const { data: tokenInfo } = useTokenInfo()
  const { claim, status, hash, error } = useClaimRewards()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Refresh data after successful claim
  useEffect(() => {
    if (isConfirmed) {
      // Add a small delay to ensure the blockchain has time to update
      const timer = setTimeout(() => {
        refetch()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isConfirmed, refetch])

  if (!mounted) return null

  if (isLoading) {
    return (
      <Card className="glass border-purple-500/20">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !investorInfo) {
    return (
      <Card className="glass border-purple-500/20">
        <CardContent className="pt-6">
          <Alert className="bg-destructive/10 border-destructive/30 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Error loading rewards data. Please try again later.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Format rewards data
  const pendingRewards = investorInfo.pendingRewards
  const formattedRewards = formatUnits(pendingRewards, tokenInfo?.decimals || 18)
  const hasRewards = pendingRewards > BigInt(0)
  const minClaimAmount = parseUnits("0.01", tokenInfo?.decimals || 18)
  const canClaim = pendingRewards >= minClaimAmount

  // Handle claim
  const handleClaim = async () => {
    try {
      await claim()
    } catch (err) {
      console.error("Claim failed:", err)
    }
  }

  return (
    <Card className="glass-card overflow-hidden border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <CardTitle>Claim Rewards</CardTitle>
        </div>
        <CardDescription>Claim your earned 5PT tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20"
          whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(139, 92, 246, 0.25)" }}
        >
          <h3 className="text-sm text-muted-foreground">Available to Claim</h3>
          <motion.p
            className="text-3xl font-bold mt-2 neon-text"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {Number.parseFloat(formattedRewards).toFixed(4)} 5PT
          </motion.p>
          {hasRewards && (
            <p className="text-sm text-muted-foreground mt-1">
              ≈ ${(Number.parseFloat(formattedRewards) * 1.25).toFixed(2)} USD
            </p>
          )}
        </motion.div>

        {status === TransactionStatus.SUCCESS && isConfirmed && (
          <Alert className="mt-4 bg-green-500/10 border-green-500/30 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Rewards claimed successfully!</AlertDescription>
          </Alert>
        )}

        {status === TransactionStatus.ERROR && (
          <Alert className="mt-4 bg-destructive/10 border-destructive/30 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error?.message || "Transaction failed. Please try again."}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          onClick={handleClaim}
          disabled={!canClaim || status === TransactionStatus.PENDING || isConfirming}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {status === TransactionStatus.PENDING || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isConfirming ? "Confirming..." : "Claiming..."}
            </>
          ) : !hasRewards ? (
            "No Rewards Available"
          ) : !canClaim ? (
            "Minimum Claim: 0.01 5PT"
          ) : (
            "Claim Rewards"
          )}
        </Button>

        {hash && (
          <a
            href={`https://bscscan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm text-purple-400 hover:underline"
          >
            View transaction on BscScan
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
