"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { CyberCard } from "@/components/ui/cyber-card"
import { useAccount, useReadContract } from "wagmi"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatAddress } from "@/lib/utils"
import { Copy, Check, Users, Twitter, Facebook, Share2, Award, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { INVESTMENT_MANAGER_ABI, getContractAddress } from "@/lib/contracts"

export function ReferralSystem() {
  const { address, isConnected } = useAccount()
  const { userReferralBonus, userReferralCount, tokenSymbol } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get contract address
  const chainId = 56 // BSC Mainnet
  const investmentManagerAddress = getContractAddress("investmentManager", chainId)

  // Get referrals data
  const { data: referralAddresses } = useReadContract({
    address: investmentManagerAddress,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferrals",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: mounted && isConnected && !!address,
    },
  })

  useEffect(() => {
    setMounted(true)

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (mounted && referralAddresses && Array.isArray(referralAddresses)) {
      // Process referral data
      const processedReferrals = referralAddresses.map((referralAddress, index) => {
        // In a real app, you would fetch more data about each referral
        return {
          id: index,
          address: referralAddress,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          amount: Math.random() * 10000,
          commission: Math.random() * 500,
          status: Math.random() > 0.2 ? "Active" : "Inactive",
        }
      })

      setReferrals(processedReferrals)
    }
  }, [mounted, referralAddresses])

  if (!mounted) return null

  const referralLink = address ? `https://5pt.finance/ref/${address}` : ""
  const referralShareText = `🚀 Join me on 5PT Finance and earn passive income! Use my referral link to get started: ${referralLink} #5PTFinance #DeFi #PassiveIncome`

  const copyToClipboard = () => {
    if (!referralLink) return

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
  const estimatedDailyFromReferrals = Number(userReferralBonus) * 0.05 // 5% daily from referrals
  const estimatedMonthlyFromReferrals = estimatedDailyFromReferrals * 30

  // Calculate tier based on referral count
  const getReferralTier = (count: number) => {
    if (count >= 50) return { name: "Diamond", color: "text-blue-400", percentage: "7%" }
    if (count >= 25) return { name: "Platinum", color: "text-purple-400", percentage: "6%" }
    if (count >= 10) return { name: "Gold", color: "text-yellow-400", percentage: "5.5%" }
    if (count >= 5) return { name: "Silver", color: "text-gray-300", percentage: "5%" }
    return { name: "Bronze", color: "text-amber-600", percentage: "4.5%" }
  }

  const currentTier = getReferralTier(Number(userReferralCount))
  const nextTier =
    Number(userReferralCount) < 5
      ? getReferralTier(5)
      : Number(userReferralCount) < 10
        ? getReferralTier(10)
        : Number(userReferralCount) < 25
          ? getReferralTier(25)
          : Number(userReferralCount) < 50
            ? getReferralTier(50)
            : null

  const progressToNextTier = nextTier
    ? Number(userReferralCount) < 5
      ? (Number(userReferralCount) / 5) * 100
      : Number(userReferralCount) < 10
        ? ((Number(userReferralCount) - 5) / 5) * 100
        : Number(userReferralCount) < 25
          ? ((Number(userReferralCount) - 10) / 15) * 100
          : ((Number(userReferralCount) - 25) / 25) * 100
    : 100

  return (
    <CyberCard variant="panel" glowing scanline className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Referral Network
          </h3>
          <p className="text-gray-400 text-sm">Expand your network, multiply your earnings</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
          <Users className="h-6 w-6 text-purple-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-purple-900/20 rounded-md"></div>
          <div className="h-24 bg-purple-900/20 rounded-md"></div>
          <div className="h-32 bg-purple-900/20 rounded-md"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Referrals</span>
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{userReferralCount?.toString() || "0"}</div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Earned Commissions</span>
                <Award className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">
                {formatCrypto(userReferralBonus || 0, tokenSymbol)}
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Monthly Projection</span>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {formatCrypto(estimatedMonthlyFromReferrals, tokenSymbol)}
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Your Referral Link</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 bg-black/50 rounded p-2 text-sm truncate border border-purple-500/10">
                {referralLink}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-purple-500/50 hover:bg-purple-900/20"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-4">
                    <CyberButton
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={shareToTwitter}
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </CyberButton>

                    <CyberButton
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={shareToFacebook}
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </CyberButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Referral Tier</h4>
                <p className="text-sm text-gray-400">Increase your tier to earn higher commissions</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${currentTier.color} bg-black/50 border border-purple-500/20`}
              >
                {currentTier.name}
              </div>
            </div>

            <div className="mb-2 flex justify-between text-xs text-gray-400">
              <span>Current: {currentTier.percentage} commission</span>
              {nextTier && <span>Next: {nextTier.percentage} commission</span>}
            </div>

            <div className="w-full bg-gray-700/30 rounded-full h-2.5 mb-1">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                style={{ width: `${progressToNextTier}%` }}
              ></div>
            </div>

            {nextTier && (
              <div className="text-xs text-gray-400">
                {Number(userReferralCount)} /{" "}
                {nextTier.name === "Silver"
                  ? "5"
                  : nextTier.name === "Gold"
                    ? "10"
                    : nextTier.name === "Platinum"
                      ? "25"
                      : "50"}{" "}
                referrals to {nextTier.name}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <h4 className="font-medium mb-3">Recent Referrals</h4>
            <div className="overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
              {referrals.length > 0 ? (
                <div className="space-y-2">
                  {referrals.slice(0, 5).map((referral) => (
                    <div
                      key={referral.id}
                      className="bg-black/40 rounded-lg p-3 border border-purple-500/10 flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-medium">{formatAddress(referral.address)}</div>
                        <div className="text-xs text-gray-400">{referral.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400">+{formatCrypto(referral.commission, tokenSymbol)}</div>
                        <div className="text-xs text-gray-400">
                          {referral.status === "Active" ? (
                            <span className="text-green-400">●</span>
                          ) : (
                            <span className="text-gray-500">●</span>
                          )}{" "}
                          {referral.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No referrals yet</p>
                  <p className="text-sm">Share your link to start earning</p>
                </div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-center p-3 mt-6 bg-purple-900/20 rounded-lg border border-purple-500/30"
          >
            <p className="text-sm font-medium text-purple-300">
              Potential monthly earnings with 10 referrals:
              <span className="text-green-400 ml-1">
                {formatCrypto(estimatedMonthlyFromReferrals * 10, tokenSymbol)}
              </span>
            </p>
          </motion.div>
        </>
      )}
    </CyberCard>
  )
}
