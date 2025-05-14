"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Users, Link, Share2, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export function ReferralNetwork() {
  const { referralCount, formattedReferralBonus, isLoading } = useInvestment()

  const [copied, setCopied] = useState(false)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const copyReferralLink = () => {
    const referralLink = `https://5pt.finance/ref/${window.location.search.includes("address=") ? window.location.search.split("address=")[1].split("&")[0] : ""}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-indigo-950/10 border border-indigo-500/30 p-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Referral Network</h2>
          <p className="text-indigo-300/70 text-sm">Your referrals and commission earnings</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-indigo-400" />
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-900/10 rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-indigo-300">Total Referrals</h3>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {isLoading ? (
                <div className="h-7 w-16 bg-indigo-500/10 animate-pulse rounded"></div>
              ) : (
                <AnimatedCounter value={referralCount} formatFn={(val) => val.toString()} />
              )}
            </div>
            <p className="text-xs text-indigo-300/70 mt-1">Active investors you've referred</p>
          </div>

          <div className="bg-indigo-900/10 rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-indigo-300">Referral Earnings</h3>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Link className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1">
              {isLoading ? (
                <div className="h-7 w-24 bg-indigo-500/10 animate-pulse rounded"></div>
              ) : (
                <>
                  <AnimatedCounter
                    value={Number.parseFloat(formattedReferralBonus)}
                    formatFn={(val) => formatNumber(val)}
                  />
                  <span className="text-sm text-indigo-300/70">5PT</span>
                </>
              )}
            </div>
            <p className="text-xs text-indigo-300/70 mt-1">Total commission earned from referrals</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-indigo-900/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-indigo-300">Your Referral Link</h3>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-indigo-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 text-sm text-indigo-300/70 truncate">
              https://5pt.finance/ref/
              {window.location.search.includes("address=")
                ? window.location.search.split("address=")[1].split("&")[0]
                : "..."}
            </div>
            <button
              onClick={copyReferralLink}
              className="px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors"
            >
              {copied ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Copied</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">Copy</span>
                </span>
              )}
            </button>
          </div>

          <p className="text-xs text-indigo-300/70 mt-3">
            Share this link to earn 5% commission on all referral investments
          </p>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-indigo-300">Referral Benefits</h3>
          </div>

          <div className="space-y-2">
            <div className="bg-indigo-900/5 rounded-lg p-3 border border-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400">5%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Direct Referral Bonus</p>
                  <p className="text-xs text-indigo-300/70">Earn 5% of all investments made by your direct referrals</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/5 rounded-lg p-3 border border-indigo-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400">+</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pool Qualification Boost</p>
                  <p className="text-xs text-indigo-300/70">Referrals help you qualify for higher investment pools</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
