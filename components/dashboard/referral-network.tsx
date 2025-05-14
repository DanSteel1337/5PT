"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { GradientBorder } from "@/components/ui/gradient-border"
import { CyberButton } from "@/components/ui/cyber-button"
import { AnimatedValue } from "@/components/ui/animated-value"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Users, Copy, Share2, Link } from "lucide-react"

export function ReferralNetwork() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)

  // Get user referral count
  const { data: userReferralCount } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user referral bonus
  const { data: userReferralBonus } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralBonus",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user referrals
  const { data: userReferrals } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferrals",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Generate referral link
  useEffect(() => {
    if (address && mounted) {
      setReferralLink(`https://5pt.finance/ref/${address}`)
    }
  }, [address, mounted])

  // Copy referral link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share referral link
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join 5PT Investment Platform",
        text: "I'm earning daily rewards with 5PT. Join using my referral link:",
        url: referralLink,
      })
    } else {
      copyToClipboard()
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const referralCount = userReferralCount ? Number(userReferralCount) : 0
  const formattedReferralBonus = userReferralBonus ? Number.parseFloat(formatUnits(userReferralBonus, 18)) : 0
  const referrals = userReferrals || []

  // Calculate daily referral earnings (0.025% of referral volume)
  const dailyReferralEarnings = formattedReferralBonus * 0.00025

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <CyberCard variant="panel" className="h-full p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-3">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">Referral Network</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
            <p className="text-sm text-gray-400 mb-2">Total Referrals</p>
            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              <AnimatedValue value={referralCount} formatFn={(val) => val.toString()} />
            </p>
            <p className="text-xs text-gray-400 mt-1">Direct partners</p>
          </div>

          <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
            <p className="text-sm text-gray-400 mb-2">Referral Earnings</p>
            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              <AnimatedValue
                value={formattedReferralBonus}
                formatFn={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`}
              />
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ~${(formattedReferralBonus * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-300">Daily Referral Rewards</p>
            <p className="text-sm text-blue-400">
              {dailyReferralEarnings.toLocaleString(undefined, { maximumFractionDigits: 6 })} 5PT/day
            </p>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((referralCount / 20) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>Target: 20 referrals</span>
          </div>
        </div>

        <GradientBorder borderWidth={1} animate={true} className="mb-6">
          <div className="p-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3 flex-shrink-0">
              <Link className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-gray-400 mb-1">Your Referral Link</p>
              <p className="text-sm font-mono truncate">{referralLink}</p>
            </div>
          </div>
        </GradientBorder>

        <div className="grid grid-cols-2 gap-4">
          <CyberButton variant="outline" onClick={copyToClipboard}>
            <div className="flex items-center justify-center">
              <Copy className="h-4 w-4 mr-2" />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </div>
          </CyberButton>

          <CyberButton variant="outline" onClick={shareReferralLink}>
            <div className="flex items-center justify-center">
              <Share2 className="h-4 w-4 mr-2" />
              <span>Share</span>
            </div>
          </CyberButton>
        </div>
      </CyberCard>
    </motion.div>
  )
}
