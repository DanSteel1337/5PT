"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { useAccount } from "wagmi"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto } from "@/lib/utils"
import { Copy, Check, Users, Twitter, Facebook } from "lucide-react"
import { motion } from "framer-motion"

export function ReferralSystem() {
  const { address } = useAccount()
  const { userReferralBonus, userReferralCount, tokenSymbol } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const referralLink = `https://5pt.finance/ref/${address}`
  const referralShareText = `🚀 Join me on 5PT Finance and earn passive income! Use my referral link to get started: ${referralLink} #5PTFinance #DeFi #PassiveIncome`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(referralShareText)}`, "_blank")
  }

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(referralShareText)}`,
      "_blank",
    )
  }

  // Calculate estimated earnings from referrals
  const estimatedDailyFromReferrals = userReferralBonus * 0.05 // 5% daily from referrals
  const estimatedMonthlyFromReferrals = estimatedDailyFromReferrals * 30

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

        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
          <p className="text-gray-300">Daily From Referrals</p>
          <p className="font-medium text-green-400">+{formatCrypto(estimatedDailyFromReferrals, tokenSymbol)}</p>
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

        <div className="flex gap-2">
          <CyberButton
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={shareToTwitter}
          >
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </CyberButton>

          <CyberButton
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={shareToFacebook}
          >
            <Facebook className="h-4 w-4" />
            Share on Facebook
          </CyberButton>
        </div>

        <div className="text-sm text-gray-400">
          <p className="mb-1">Invite friends and earn:</p>
          <ul className="space-y-1 pl-5 list-disc">
            <li>5% of their deposits directly to your wallet</li>
            <li>Boost your rank progression</li>
            <li>Unlock exclusive pool access</li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-center p-2 bg-purple-900/20 rounded-lg border border-purple-500/30"
        >
          <p className="text-sm font-medium text-purple-300">
            Potential monthly earnings with 10 referrals:
            <span className="text-green-400 ml-1">{formatCrypto(estimatedMonthlyFromReferrals * 10, tokenSymbol)}</span>
          </p>
        </motion.div>
      </div>
    </Card>
  )
}
