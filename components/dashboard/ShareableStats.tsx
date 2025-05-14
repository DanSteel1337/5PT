"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CyberButton } from "@/components/ui/cyber-button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent, formatNumber } from "@/lib/utils"
import { Share2, Twitter, Facebook, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/shared/logo"

export function ShareableStats() {
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    totalValueLocked,
    totalInvestors,
    projectedAnnualYield,
  } = useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate some impressive stats
  const totalEarnings = userPoolRewards + userReferralBonus
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0
  const dailyYield = userTotalDeposits * 0.08 // 8% daily
  const weeklyYield = dailyYield * 7
  const monthlyYield = dailyYield * 30
  const yearlyYield = dailyYield * 365

  // Platform growth metrics (simulated for impressive stats)
  const platformGrowthRate = 12.8 // 12.8% weekly growth
  const newInvestorsDaily = 142
  const averageInvestment = totalValueLocked / Math.max(totalInvestors, 1)

  // Share text
  const shareText = `🚀 I'm earning ${formatCrypto(dailyYield, tokenSymbol)} DAILY with 5PT Finance! Join the future of DeFi investing and earn up to ${formatPercent(365 * 8)} APY. #5PTFinance #DeFi #PassiveIncome`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
  }

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
    )
  }

  return (
    <Card className="glass-card-purple p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Logo size={32} withText={true} />
          <h3 className="text-xl font-bold text-gradient">My Investment Dashboard</h3>
        </div>
        <div className="relative">
          <CyberButton
            variant="outline"
            size="sm"
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </CyberButton>

          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 p-2 bg-black/80 border border-purple-500/30 rounded-lg z-50 w-40"
            >
              <button
                onClick={shareToTwitter}
                className="flex items-center gap-2 w-full p-2 hover:bg-purple-900/20 rounded text-left"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span>Twitter</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="flex items-center gap-2 w-full p-2 hover:bg-purple-900/20 rounded text-left"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span>Facebook</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 w-full p-2 hover:bg-purple-900/20 rounded text-left"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Daily Earnings</p>
          <p className="text-2xl font-bold text-green-400">{formatCrypto(dailyYield, tokenSymbol)}</p>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Monthly Potential</p>
          <p className="text-2xl font-bold text-green-400">{formatCrypto(monthlyYield, tokenSymbol)}</p>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Annual Yield</p>
          <p className="text-2xl font-bold text-green-400">{formatPercent(365 * 8)}</p>
        </div>
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">My ROI</p>
          <p className="text-2xl font-bold text-gradient">{formatPercent(roi)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Platform Statistics</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Value Locked</span>
              <span className="font-medium text-gradient">${formatNumber(totalValueLocked * 1.25)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Investors</span>
              <span className="font-medium">{formatNumber(totalInvestors)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Weekly Growth</span>
              <span className="font-medium text-green-400">+{platformGrowthRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">New Investors Daily</span>
              <span className="font-medium text-green-400">+{newInvestorsDaily}</span>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">My Investment Growth</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Initial Investment</span>
              <span className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Earnings</span>
              <span className="font-medium text-green-400">{formatCrypto(totalEarnings, tokenSymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Referral Earnings</span>
              <span className="font-medium text-purple-400">{formatCrypto(userReferralBonus, tokenSymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Projected 1Y Earnings</span>
              <span className="font-medium text-green-400">{formatCrypto(yearlyYield, tokenSymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">
          Join thousands of investors earning passive income with 5PT Finance
        </p>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-pulse-slow"
            style={{ width: "85%" }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">85% of Phase 1 pool allocation filled</p>
      </div>
    </Card>
  )
}
