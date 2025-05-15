"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatPercent } from "@/lib/utils"
import { useAccount } from "wagmi"
import { Share2, Download, Camera, Twitter, Facebook, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import { CyberButton } from "@/components/ui/cyber-button"
import { useMounted } from "@/hooks/useMounted"
import html2canvas from "html2canvas"

export function ShareableStats() {
  const { address } = useAccount()
  const { userTotalDeposits, userReferralBonus, userPoolRewards, tokenSymbol, dailyRatePercent, userReferralCount } =
    useInvestmentData()
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mounted = useMounted()

  if (!mounted) return null

  // Calculate total earnings and ROI
  const totalEarnings = userPoolRewards + userReferralBonus
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0

  // Calculate daily earnings based on the daily rate
  const dailyEarnings = userTotalDeposits * (dailyRatePercent / 100)

  // Generate shareable image
  const generateImage = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f0f13",
        scale: 2,
      })
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = "5pt-investment-stats.png"
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
    }
    setIsGenerating(false)
  }

  // Share on social media
  const shareOnTwitter = () => {
    const text = `I've earned ${formatCrypto(
      totalEarnings,
      tokenSymbol,
    )} with 5 Pillars Token! Join me and start earning daily rewards. #5PT #Crypto #PassiveIncome`
    const url = window.location.origin
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
  }

  const shareOnFacebook = () => {
    const url = window.location.origin
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
  }

  const shareOnLinkedin = () => {
    const url = window.location.origin
    const title = "My 5 Pillars Token Investment Stats"
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(
        title,
      )}`,
    )
  }

  return (
    <Card className="glass-card-purple p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gradient">Shareable Stats</h3>
        <div className="flex gap-2">
          <CyberButton variant="outline" size="sm" onClick={generateImage} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-1" />
            {isGenerating ? "Generating..." : "Download"}
          </CyberButton>
          <CyberButton variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </CyberButton>
        </div>
      </div>

      <div
        ref={cardRef}
        className="bg-black/40 rounded-lg p-6 border border-purple-900/30 mb-6 relative overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
              <span className="font-bold text-white">5PT</span>
            </div>
            <div>
              <h4 className="font-bold">5 Pillars Token</h4>
              <p className="text-xs text-gray-400">Investment Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Wallet</p>
            <p className="text-sm font-medium">
              {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : "Not connected"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Investment</p>
            <p className="text-xl font-bold text-gradient">{formatCrypto(userTotalDeposits, tokenSymbol)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Total Earnings</p>
            <p className="text-xl font-bold text-green-400">{formatCrypto(totalEarnings, tokenSymbol)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Daily Earnings</p>
            <p className="text-xl font-bold text-blue-400">{formatCrypto(dailyEarnings, tokenSymbol)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">ROI</p>
            <p className="text-xl font-bold text-purple-400">{formatPercent(roi)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Camera className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-500">Generated on {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">Referrals:</span>
            <span className="font-medium">{userReferralCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg p-4">
        <h4 className="font-bold mb-4">Share on Social Media</h4>
        <div className="flex gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center hover:bg-[#1DA1F2]/30 transition-colors"
            onClick={shareOnTwitter}
          >
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-[#4267B2]/20 flex items-center justify-center hover:bg-[#4267B2]/30 transition-colors"
            onClick={shareOnFacebook}
          >
            <Facebook className="h-5 w-5 text-[#4267B2]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-[#0077B5]/20 flex items-center justify-center hover:bg-[#0077B5]/30 transition-colors"
            onClick={shareOnLinkedin}
          >
            <Linkedin className="h-5 w-5 text-[#0077B5]" />
          </motion.button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Share your investment stats with friends and earn referral bonuses when they join!
        </p>
      </div>
    </Card>
  )
}
