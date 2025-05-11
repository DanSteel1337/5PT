"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAccount } from "wagmi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { useTokenContract } from "@/lib/hooks/use-token-contract"
import { Loader2, AlertCircle, CheckCircle2, Info, ShieldAlert, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import type { BlockchainError } from "@/lib/blockchain-errors"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DepositFormValues {
  amount: string
  referrer: string
}

// Validate contract address to prevent sending to incorrect addresses
const validateContractAddress = (address: string): boolean => {
  // Check if address is valid format
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false
  }

  // Check if address is a known placeholder or zero address
  const invalidAddresses = [
    "0x0000000000000000000000000000000000000000",
    "0x123456789abcdef123456789abcdef123456789a",
    "0x123456789aBCdEF123456789aBCdef123456789A",
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", // Remove this if it was a valid address
  ]

  if (invalidAddresses.includes(address.toLowerCase())) {
    return false
  }

  // Verify it's the correct investment manager address
  const correctInvestmentManager = "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc".toLowerCase()
  if (address.toLowerCase() === correctInvestmentManager) {
    return true
  }

  // Verify it's the correct token address
  const correctToken = "0x8FafdFB035C9426a50D842873D5d401C933bE09F".toLowerCase()
  if (address.toLowerCase() === correctToken) {
    return true
  }

  return false
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { address, chain } = useAccount()
  const { deposit, depositStatus, lastError } = useInvestmentManager()
  const { useTokenBalance, useTokenAllowance, approveToken, symbol } = useTokenContract()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [approvalError, setApprovalError] = useState<BlockchainError | null>(null)
  const [depositError, setDepositError] = useState<BlockchainError | null>(null)
  const [contractValidationError, setContractValidationError] = useState<boolean>(false)
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)

  // Validate contract address on component mount
  useEffect(() => {
    const isValid = validateContractAddress(CONTRACT_ADDRESSES.investmentManager)
    setContractValidationError(!isValid)
  }, [])

  const investmentManagerAddress = CONTRACT_ADDRESSES.investmentManager as `0x${string}`

  const {
    data: balanceData,
    formattedBalance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useTokenBalance(address)

  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(address, investmentManagerAddress)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<DepositFormValues>({
    defaultValues: {
      amount: "",
      referrer: "",
    },
  })

  const watchAmount = watch("amount")

  // Check if approval is needed
  useEffect(() => {
    if (watchAmount && allowance) {
      try {
        const amountBigInt = BigInt(Number.parseFloat(watchAmount) * 10 ** 18) // Convert to wei
        setNeedsApproval(amountBigInt > allowance)
      } catch (error) {
        console.error("Error checking approval:", error)
      }
    }
  }, [watchAmount, allowance])

  // Reset errors when amount changes
  useEffect(() => {
    setApprovalError(null)
    setDepositError(null)
  }, [watchAmount])

  // Refresh balance and allowance when chain changes or modal opens
  useEffect(() => {
    if (isOpen) {
      refetchBalance()
      refetchAllowance()
    }
  }, [isOpen, chain, refetchBalance, refetchAllowance])

  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true)
    await refetchBalance()
    await refetchAllowance()
    setTimeout(() => setIsRefreshingBalance(false), 1000)
  }

  const handleApprove = async () => {
    if (!watchAmount || contractValidationError) return

    try {
      setIsApproving(true)
      setApprovalError(null)
      await approveToken(watchAmount, investmentManagerAddress)
      setNeedsApproval(false)

      // Refresh allowance after approval
      await refetchAllowance()
    } catch (error) {
      console.error("Error approving tokens:", error)
      if (error && typeof error === "object" && "type" in error) {
        setApprovalError(error as BlockchainError)
      }
    } finally {
      setIsApproving(false)
    }
  }

  const onSubmit = async (data: DepositFormValues) => {
    if (contractValidationError) return

    try {
      setIsSubmitting(true)
      setDepositError(null)

      // Convert referrer to proper format or undefined
      const referrer = data.referrer && data.referrer.trim() !== "" ? (data.referrer as `0x${string}`) : undefined

      const tx = await deposit(data.amount, referrer)
      setTransactionHash(tx)

      // Reset form after successful submission
      reset()

      // Refresh balance after deposit
      await refetchBalance()
    } catch (error) {
      console.error("Error depositing:", error)
      if (lastError) {
        setDepositError(lastError)
      } else if (error && typeof error === "object") {
        // Handle case where lastError might not be set
        setDepositError({
          type: "error",
          title: "Transaction Failed",
          message: "The deposit transaction failed. Please try again.",
          suggestion: "Check your wallet and network connection.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !isApproving) {
      reset()
      setTransactionHash(null)
      setApprovalError(null)
      setDepositError(null)
      onClose()
    }
  }

  const handleSetMax = () => {
    if (formattedBalance && formattedBalance !== "0") {
      setValue("amount", formattedBalance)
    }
  }

  const tokenSymbol = symbol || "5PT"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border border-gold/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-600">
            Deposit Tokens
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Deposit your {tokenSymbol} tokens to start earning rewards
          </DialogDescription>
        </DialogHeader>

        {/* Contract Validation Error */}
        {contractValidationError && (
          <Alert className="bg-red-900/20 border-red-500/50">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Invalid Contract Configuration</AlertTitle>
            <AlertDescription className="text-gray-300">
              The investment manager contract address is not properly configured. Please contact the administrator.
            </AlertDescription>
          </Alert>
        )}

        {depositStatus.isSuccess && transactionHash ? (
          <div className="space-y-4 py-4">
            <Alert className="bg-green-900/20 border-green-500/50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Deposit Successful!</AlertTitle>
              <AlertDescription className="text-gray-300">
                Your tokens have been successfully deposited.
                <a
                  href={`https://testnet.bscscan.com/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-amber-400 hover:text-amber-300 underline text-sm"
                >
                  View transaction on BscScan
                </a>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold"
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="amount" className="text-amber-400">
                  Amount
                </Label>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={handleRefreshBalance}
                    disabled={isRefreshingBalance || isBalanceLoading}
                  >
                    <RefreshCw size={14} className={`text-amber-400 ${isRefreshingBalance ? "animate-spin" : ""}`} />
                    <span className="sr-only">Refresh Balance</span>
                  </Button>
                  <span className="text-sm text-gray-400">
                    Balance: {isBalanceLoading ? "Loading..." : formattedBalance} {tokenSymbol}
                  </span>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.0"
                  className="bg-black/60 border-amber-600/30 focus:border-amber-500 focus:ring-amber-500"
                  disabled={contractValidationError}
                  {...register("amount", {
                    required: "Amount is required",
                    pattern: {
                      value: /^[0-9]*[.,]?[0-9]*$/,
                      message: "Please enter a valid number",
                    },
                    validate: (value) => {
                      const amount = Number.parseFloat(value)
                      if (isNaN(amount) || amount <= 0) {
                        return "Amount must be greater than 0"
                      }
                      if (balanceData && BigInt(amount * 10 ** 18) > balanceData) {
                        return "Amount exceeds your balance"
                      }
                      return true
                    },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-amber-400 hover:text-amber-300"
                  disabled={contractValidationError || isBalanceLoading || formattedBalance === "0"}
                  onClick={handleSetMax}
                >
                  MAX
                </Button>
              </div>
              {errors.amount && <p className="text-red-400 text-sm">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer" className="text-amber-400">
                Referrer Address (Optional)
              </Label>
              <Input
                id="referrer"
                placeholder="0x..."
                className="bg-black/60 border-amber-600/30 focus:border-amber-500 focus:ring-amber-500"
                disabled={contractValidationError}
                {...register("referrer", {
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/,
                    message: "Please enter a valid Ethereum address",
                  },
                })}
              />
              {errors.referrer && <p className="text-red-400 text-sm">{errors.referrer.message}</p>}
            </div>

            {/* Contract Information */}
            <div className="p-3 bg-gray-900/50 rounded-md border border-amber-800/20">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Contract Information</h4>
              <p className="text-xs text-gray-400 break-all">
                Investment Manager: {CONTRACT_ADDRESSES.investmentManager}
              </p>
              <p className="text-xs text-gray-400 mt-1">Token: {CONTRACT_ADDRESSES.token}</p>
            </div>

            {/* Approval Error */}
            {approvalError && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">{approvalError.title}</AlertTitle>
                <AlertDescription className="text-gray-300">
                  {approvalError.message}
                  {approvalError.suggestion && <p className="mt-2 text-sm text-gray-400">{approvalError.suggestion}</p>}
                </AlertDescription>
              </Alert>
            )}

            {/* Deposit Error */}
            {depositError && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">{depositError.title}</AlertTitle>
                <AlertDescription className="text-gray-300">
                  {depositError.message}
                  {depositError.suggestion && <p className="mt-2 text-sm text-gray-400">{depositError.suggestion}</p>}
                </AlertDescription>
              </Alert>
            )}

            {/* Information Alert for First-Time Users */}
            {!approvalError && !depositError && needsApproval && !contractValidationError && (
              <Alert className="bg-blue-900/20 border-blue-500/50">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-500">Two-Step Process</AlertTitle>
                <AlertDescription className="text-gray-300">
                  First, you'll need to approve the contract to use your tokens. Then, you can proceed with the deposit.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              {needsApproval ? (
                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving || !watchAmount || contractValidationError}
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white font-bold"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    "Approve Tokens"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || depositStatus.isLoading || !watchAmount || contractValidationError}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold"
                >
                  {isSubmitting || depositStatus.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Depositing...
                    </>
                  ) : (
                    "Deposit"
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isApproving}
                className="w-full sm:w-auto border-amber-600/30 hover:bg-amber-900/20 text-amber-400"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
