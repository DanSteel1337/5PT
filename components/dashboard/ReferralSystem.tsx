"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { useAccount } from "wagmi"
import { Copy, Check, Users, ArrowUpRight, LinkIcon } from "lucide-react"
import { motion } from "framer-motion"
import { CyberButton } from "@/components/ui/cyber-button"
import { useMounted } from "@/hooks/useMounted"

export function ReferralSystem() {
  const { address } = useAccount()
  const { userReferralBonus, userReferralCount, tokenSymbol, userDirectReferralVolume } = useInvestmentData()
  const [copied, setCopied] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const mounted = useMounted()

  useEffect(() => {
    if (mounted && address) {
      // Create referral link with the user's address
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      setReferralLink(`${baseUrl}/?ref=${address}`)
    }
  }, [mounted, address])

  const copyToClipboard = () => {
    if (navigator.clipboard && referralLink) {
      navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!mounted) return null

  // Mock referral data (would come from the contract in production)
  const referrals = [
    {
      address: "0x1234...5678",
      investment: 1250,
      earnings: 3.125,
      date: "2023-11-15",
    },
    {
      address: "0xabcd...efgh",
      investment: 750,
      earnings: 1.875,
      date: "2023-11-10",
    },
    {
      address: "0x9876...5432",
      investment: 500,
      earnings: 1.25,
      date: "2023-11-05",
    },
  ]

  return (
    <Card className="glass-card-purple p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gradient">Referral System</h3>
        <span className="px-3 py-1 bg-purple-900/30 rounded-full text-xs text-purple-400">
          {userReferralCount} Referrals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Referral Earnings</p>
              <p className="text-2xl font-bold text-gradient">{formatCrypto(userReferralBonus, tokenSymbol)}</p>
              <p className="text-xs text-gray-500 mt-1">≈ ${formatNumber(userReferralBonus * 1.75)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-900/30">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Referral Volume</p>
              <div className="flex items-center">
                <p className="font-medium text-purple-400">{formatCrypto(userDirectReferralVolume, tokenSymbol)}</p>
                <ArrowUpRight className="h-3 w-3 text-purple-400 ml-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-3">Your Referral Link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-md text-sm text-gray-300"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center w-10 h-10 bg-purple-900/50 rounded-md hover:bg-purple-900/70 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-purple-400" />}
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LinkIcon className="h-4 w-4" />
              <span>Share your link to earn 0.025% daily on referral deposits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Referral Rewards</h4>
          <span className="text-xs text-purple-400">Earn passive income</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Direct Referrals</p>
            <p className="text-lg font-bold text-gradient">0.025%</p>
            <p className="text-xs text-gray-500">Daily on their deposits</p>
          </div>

          <div className="bg-black/40 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Level 2-5</p>
            <p className="text-lg font-bold text-gradient">0.04%</p>
            <p className="text-xs text-gray-500">Daily on their deposits</p>
          </div>

          <div className="bg-black/40 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Level 6-10</p>
            <p className="text-lg font-bold text-gradient">0.02%</p>
            <p className="text-xs text-gray-500">Daily on their deposits</p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">Recent Referrals</h4>
          <CyberButton variant="outline" size="sm">
            View All
          </CyberButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="pb-2 text-left">Address</th>
                <th className="pb-2 text-right">Investment</th>
                <th className="pb-2 text-right">Your Earnings</th>
                <th className="pb-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral, index) => (
                <motion.tr
                  key={index}
                  className="text-sm border-b border-gray-800/50 last:border-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-3">{referral.address}</td>
                  <td className="py-3 text-right">{formatCrypto(referral.investment, tokenSymbol)}</td>
                  <td className="py-3 text-right text-green-400">+{formatCrypto(referral.earnings, tokenSymbol)}</td>
                  <td className="py-3 text-right text-gray-500">{referral.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-700" />
            <p>No referrals yet</p>
            <p className="text-sm mt-1">Share your link to start earning</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 mb-3">
          Boost your earnings by referring others to the platform. Earn up to 10 levels deep!
        </p>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium"
        >
          Share Your Referral Link Now
        </motion.div>
      </div>
    </Card>
  )
}
