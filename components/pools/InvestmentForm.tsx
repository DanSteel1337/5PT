"use client"

import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { parseUnits } from "viem"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { type PoolInfo, TransactionStatus } from "@/types/contracts"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { useFivePillarsToken } from "@/hooks/useFivePillarsToken"
import { getContractAddress } from "@/contracts/addresses"
import { formatCurrency, formatDuration, formatPercentage } from "@/lib/format"

interface InvestmentFormProps {
  pool: PoolInfo
}

// Form validation schema
const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
})

export function InvestmentForm({ pool }: InvestmentFormProps) {
  const [mounted, setMounted] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()

  const { formatPoolData, useInvestInPool } = useInvestmentManager()
  const { useTokenBalance, useTokenAllowance, useApproveToken, formatTokenBalance } = useFivePillarsToken()

  const { data: balance } = useTokenBalance()
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)
  const { data: allowance } = useTokenAllowance(investmentManagerAddress)

  const { approve, status: approveStatus, hash: approveHash, error: approveError } = useApproveToken()
  const { invest, status: investStatus, hash: investHash, error: investError } = useInvestInPool()

  const formattedPool = formatPoolData(pool)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  })

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Check if amount is approved
  const isApproved = (amount: string): boolean => {
    if (!allowance || !amount) return false

    try {
      const amountInWei = parseUnits(amount, 18)
      return allowance >= amountInWei
    } catch (error) {
      return false
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!address) return

    const { amount } = values

    // Check if approval is needed
    if (!isApproved(amount)) {
      await approve(investmentManagerAddress, amount)
      return
    }

    // If already approved, invest
    await invest(pool.id, amount)
  }

  // Determine button state
  const getButtonState = () => {
    const amount = form.getValues("amount")

    if (approveStatus === TransactionStatus.PENDING) {
      return {
        text: "Approving...",
        disabled: true,
        loading: true,
      }
    }

    if (investStatus === TransactionStatus.PENDING) {
      return {
        text: "Investing...",
        disabled: true,
        loading: true,
      }
    }

    if (!isApproved(amount)) {
      return {
        text: "Approve",
        disabled: false,
        loading: false,
      }
    }

    return {
      text: "Invest",
      disabled: false,
      loading: false,
    }
  }

  const buttonState = getButtonState()

  return (
    <Card className="glass border-border/40">
      <CardHeader>
        <CardTitle>Invest in {pool.name}</CardTitle>
        <CardDescription>Enter the amount you want to invest</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Amount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0.00" />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Min: {formatCurrency(formattedPool.minInvestmentFormatted)}</span>
                    <span>Balance: {balance ? formatTokenBalance(balance) : "0"} 5PT</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(approveStatus === TransactionStatus.SUCCESS || investStatus === TransactionStatus.SUCCESS) && (
              <Alert className="bg-green-500/10 border-green-500/30 text-green-500">
                <AlertDescription>
                  {approveStatus === TransactionStatus.SUCCESS && "Token approval successful!"}
                  {investStatus === TransactionStatus.SUCCESS && "Investment successful!"}
                </AlertDescription>
              </Alert>
            )}

            {(approveStatus === TransactionStatus.ERROR || investStatus === TransactionStatus.ERROR) && (
              <Alert className="bg-destructive/10 border-destructive/30 text-destructive">
                <AlertDescription>
                  {approveError?.message || investError?.message || "Transaction failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={buttonState.disabled}
            >
              {buttonState.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonState.text}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
        <p>• Funds will be locked for {formatDuration(Number(pool.lockPeriod))}</p>
        <p>• Expected APY: {formatPercentage(formattedPool.apyFormatted)}</p>
        <p>• Early withdrawal may incur penalties</p>
      </CardFooter>
    </Card>
  )
}
