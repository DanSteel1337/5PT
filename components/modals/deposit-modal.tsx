"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAccount } from "wagmi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { useTokenContract } from "@/lib/hooks/use-token-contract"
import { formatEther } from "ethers"
import { Loader2 } from "lucide-react"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DepositFormValues {
  amount: string
  referrer: string
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { address } = useAccount()
  const { deposit, depositStatus } = useInvestmentManager()
  const { useTokenBalance } = useTokenContract()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: balance } = useTokenBalance(address)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositFormValues>({
    defaultValues: {
      amount: "",
      referrer: "",
    },
  })

  const onSubmit = async (data: DepositFormValues) => {
    try {
      setIsSubmitting(true)

      // Convert referrer to proper format or undefined
      const referrer = data.referrer && data.referrer.trim() !== "" ? (data.referrer as `0x${string}`) : undefined

      await deposit(data.amount, referrer)

      // Reset form after successful submission
      reset()

      // Close modal if transaction was successful
      if (depositStatus.isSuccess) {
        onClose()
      }
    } catch (error) {
      console.error("Error depositing:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      onClose()
    }
  }

  const maxBalance = balance ? formatEther(balance) : "0"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border border-gold/30 text-white">
        <DialogHeader>
          <DialogTitle className="gold-gradient-text text-xl">Deposit Tokens</DialogTitle>
          <DialogDescription className="text-gray-400">
            Deposit your 5PT tokens to start earning rewards
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount" className="text-gold">
                Amount
              </Label>
              <span className="text-sm text-gray-400">Balance: {maxBalance} 5PT</span>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="0.0"
                className="bg-black/60 border-gold/30 focus:border-gold focus:ring-gold"
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
                    if (balance && amount > Number.parseFloat(maxBalance)) {
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gold hover:text-gold-light"
                onClick={() => {
                  if (balance) {
                    const form = document.getElementById("amount") as HTMLInputElement
                    if (form) {
                      form.value = maxBalance
                    }
                  }
                }}
              >
                MAX
              </Button>
            </div>
            {errors.amount && <p className="text-red-400 text-sm">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrer" className="text-gold">
              Referrer Address (Optional)
            </Label>
            <Input
              id="referrer"
              placeholder="0x..."
              className="bg-black/60 border-gold/30 focus:border-gold focus:ring-gold"
              {...register("referrer", {
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Please enter a valid Ethereum address",
                },
              })}
            />
            {errors.referrer && <p className="text-red-400 text-sm">{errors.referrer.message}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gold/30 hover:bg-gold/10 text-gold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || depositStatus.isLoading}
              className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
