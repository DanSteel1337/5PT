"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CyberButton } from "@/components/ui/CyberButton"
import { Wallet, ArrowRight } from "lucide-react"
import { formatCrypto } from "@/lib/utils"

interface InvestmentFormProps {
  data: {
    balance: number | bigint
    allowance: number | bigint
    isPending: boolean
    onApprove: (amount: string) => Promise<void>
    onDeposit: (poolId: number, amount: string, referrer?: string) => Promise<void>
    referralCode?: string
  }
}

export function InvestmentForm({ data }: InvestmentFormProps) {
  const [amount, setAmount] = useState("")
  const [referrer, setReferrer] = useState(data.referralCode || "")
  const [poolId, setPoolId] = useState(0)
  const [isApproving, setIsApproving] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [error, setError] = useState("")

  // Convert BigInt to number safely for comparison
  const safeBalance =
    typeof data.balance === "bigint"
      ? Number(data.balance) / 10 ** 18 // Assuming 18 decimals for the token
      : data.balance

  // Check if amount is valid
  const isValidAmount = () => {
    const numAmount = Number.parseFloat(amount)
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= safeBalance
  }

  // Check if approval is needed
  const needsApproval = () => {
    const numAmount = Number.parseFloat(amount)
    const safeAllowance =
      typeof data.allowance === "bigint"
        ? Number(data.allowance) / 10 ** 18 // Assuming 18 decimals for the token
        : data.allowance

    return !isNaN(numAmount) && numAmount > 0 && numAmount > safeAllowance
  }

  // Handle approve
  const handleApprove = async () => {
    if (!isValidAmount()) return

    setError("")
    setIsApproving(true)

    try {
      await data.onApprove(amount)
    } catch (error) {
      console.error("Error approving tokens:", error)
      setError("Failed to approve tokens. Please try again.")
    } finally {
      setIsApproving(false)
    }
  }

  // Handle deposit
  const handleDeposit = async () => {
    if (!isValidAmount()) return

    setError("")
    setIsDepositing(true)

    try {
      await data.onDeposit(poolId, amount, referrer || undefined)
      setAmount("")
      setReferrer("")
    } catch (error) {
      console.error("Error depositing tokens:", error)
      setError("Failed to deposit tokens. Please try again.")
    } finally {
      setIsDepositing(false)
    }
  }

  // Helper function to set percentage of balance
  const setPercentage = (percentage: number) => {
    if (typeof data.balance === "bigint") {
      // For BigInt, calculate percentage and convert to string
      const value = (data.balance * BigInt(Math.floor(percentage * 100))) / BigInt(100)
      // Convert to human-readable format (assuming 18 decimals)
      const humanReadable = Number(value) / 10 ** 18
      setAmount(humanReadable.toString())
    } else {
      // For regular numbers
      setAmount((data.balance * percentage).toString())
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-purple-400" />
            Invest in 5PT
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Available Balance</span>
              <span className="font-medium">{formatCrypto(data.balance)}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-12 bg-gray-900/50 border-purple-500/20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">5PT</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button className="text-xs text-purple-400 hover:text-purple-300" onClick={() => setPercentage(0.25)}>
                  25%
                </button>
                <button className="text-xs text-purple-400 hover:text-purple-300" onClick={() => setPercentage(0.5)}>
                  50%
                </button>
                <button className="text-xs text-purple-400 hover:text-purple-300" onClick={() => setPercentage(0.75)}>
                  75%
                </button>
                <button className="text-xs text-purple-400 hover:text-purple-300" onClick={() => setPercentage(1.0)}>
                  Max
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pool">Select Pool</Label>
              <select
                id="pool"
                value={poolId}
                onChange={(e) => setPoolId(Number.parseInt(e.target.value))}
                className="w-full rounded-md bg-gray-900/50 border-purple-500/20 p-2 text-sm"
              >
                <option value={0}>Pool 1 - Starter (0.3% daily)</option>
                <option value={1}>Pool 2 - Growth (0.5% daily)</option>
                <option value={2}>Pool 3 - Advanced (0.7% daily)</option>
                <option value={3}>Pool 4 - Elite (1.0% daily)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer">Referrer Address (Optional)</Label>
              <Input
                id="referrer"
                placeholder="0x..."
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                className="bg-gray-900/50 border-purple-500/20"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="pt-2">
              {needsApproval() ? (
                <CyberButton
                  variant="primary"
                  className="w-full"
                  disabled={!isValidAmount() || isApproving || data.isPending}
                  onClick={handleApprove}
                >
                  {isApproving || data.isPending ? (
                    "Approving..."
                  ) : (
                    <>
                      Approve 5PT Tokens
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </CyberButton>
              ) : (
                <CyberButton
                  variant="primary"
                  className="w-full"
                  disabled={!isValidAmount() || isDepositing || data.isPending}
                  onClick={handleDeposit}
                >
                  {isDepositing || data.isPending ? (
                    "Processing..."
                  ) : (
                    <>
                      Invest Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </CyberButton>
              )}
            </div>

            <div className="text-xs text-gray-500 text-center">
              A 10% deposit tax applies. 4-hour waiting period between deposits.
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
