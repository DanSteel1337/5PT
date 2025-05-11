"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo, useState } from "react"
import { Copy, Check, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReferralStats() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Mock data - in a real app, this would come from the contract
  const referralCount = 5
  const referralRewards = 250

  // Format referral link
  const referralLink = useMemo(() => {
    if (!address) return ""
    return `https://5pt.finance/ref/${address}`
  }, [address])

  const handleCopy = () => {
    if (!referralLink) return

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program</CardTitle>
        <CardDescription>Earn rewards by referring new investors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gold-500" />
              <span className="text-sm font-medium">Your Referrals</span>
            </div>
            {!isConnected ? (
              <Skeleton className="h-5 w-[60px]" />
            ) : (
              <span className="font-medium">{referralCount}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Earned Rewards</span>
            {!isConnected ? (
              <Skeleton className="h-5 w-[80px]" />
            ) : (
              <span className="font-medium">{referralRewards} 5PT</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={isConnected ? referralLink : "Connect wallet to get your referral link"}
                readOnly
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 truncate pr-10"
                disabled={!isConnected}
              />
              {isConnected && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy</span>
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link with friends to earn 5% of their deposits as rewards
          </p>
        </div>

        <Button className="w-full bg-gold-500 hover:bg-gold-600 text-black" disabled={!isConnected}>
          View Referral Details
        </Button>
      </CardContent>
    </Card>
  )
}
