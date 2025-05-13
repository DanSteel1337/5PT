"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto } from "@/lib/utils"
import { Copy, Check, Users } from "lucide-react"

export function ReferralSystem() {
  const { address } = useAccount()
  const { userReferralBonus, userReferralCount, tokenSymbol } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const referralLink = `https://5pt.finance/ref/${address}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="glass-card-purple p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gradient">Referral Program</h3>
        <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
          <Users className="h-5 w-5 text-purple-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Total Referrals</p>
          <p className="font-medium">{userReferralCount}</p>
        </div>

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Earned Commissions</p>
          <p className="font-medium text-purple-400">{formatCrypto(userReferralBonus, tokenSymbol)}</p>
        </div>

        <div className="p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300 mb-2">Your Referral Link</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-black/50 rounded p-2 text-sm truncate">{referralLink}</div>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-500/50 hover:bg-purple-900/20"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p className="mb-1">Invite friends and earn:</p>
          <ul className="space-y-1 pl-5 list-disc">
            <li>5% of their deposits directly to your wallet</li>
            <li>Boost your rank progression</li>
            <li>Unlock exclusive pool access</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
