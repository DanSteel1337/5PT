"use client"

import { motion } from "framer-motion"
import { formatCrypto } from "@/lib/utils"
import { Users, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ReferralNetworkProps {
  userReferralCount: number
  userDirectReferralVolume: number
  userReferralBonus: number
  tokenSymbol: string
}

export function ReferralNetwork({
  userReferralCount,
  userDirectReferralVolume,
  userReferralBonus,
  tokenSymbol,
}: ReferralNetworkProps) {
  const [copied, setCopied] = useState(false)

  // Generate referral link
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=0x1234...5678` // Replace with actual user address
      : ""

  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="glass-card-purple rounded-xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gradient mb-6">Referral Network</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-black/30 rounded-lg p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Direct Referrals</p>
          <p className="text-2xl font-bold text-blue-400">{userReferralCount}</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 6V18M12 6L7 11M12 6L17 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-sm mb-1">Referral Volume</p>
          <p className="text-2xl font-bold text-purple-400">{formatCrypto(userDirectReferralVolume, tokenSymbol)}</p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-sm mb-1">Referral Earnings</p>
          <p className="text-2xl font-bold text-green-400">{formatCrypto(userReferralBonus, tokenSymbol)}</p>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium mb-3">Your Referral Link</h4>
        <div className="flex items-center">
          <div className="flex-1 bg-black/50 rounded-l-lg p-3 border border-gray-800 border-r-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <span className="text-gray-400">{referralLink}</span>
          </div>
          <button
            onClick={copyReferralLink}
            className="bg-purple-900/50 hover:bg-purple-900/70 p-3 rounded-r-lg border border-purple-500/30"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-purple-400" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link to earn 0.025% daily on direct referrals' deposits and 0.06% on downline referrals
        </p>
      </div>

      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3">Referral Rewards</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-black/20 rounded">
            <div>
              <p className="text-sm text-gray-300">Direct Referral Bonus</p>
              <p className="text-xs text-gray-500">From your direct referrals</p>
            </div>
            <p className="font-medium text-green-400">0.025% daily</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-black/20 rounded">
            <div>
              <p className="text-sm text-gray-300">Downline Bonus</p>
              <p className="text-xs text-gray-500">From levels 2-10 referrals</p>
            </div>
            <p className="font-medium text-green-400">0.06% daily</p>
          </div>

          <div className="flex justify-between items-center p-3 bg-black/20 rounded">
            <div>
              <p className="text-sm text-gray-300">Total Daily Earnings</p>
              <p className="text-xs text-gray-500">Based on current referral volume</p>
            </div>
            <p className="font-medium text-green-400">
              {formatCrypto(userDirectReferralVolume * 0.00025, tokenSymbol)}/day
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Invite friends to join and earn up to 0.085% daily on their investments!
        </p>
      </div>
    </motion.div>
  )
}
