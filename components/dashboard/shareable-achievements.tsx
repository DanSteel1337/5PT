"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { Share2, Download, Twitter, Facebook } from "lucide-react"
import { useState, useRef } from "react"
import { Logo } from "@/components/shared/logo"

export function ShareableAchievements() {
  const { userRank, formattedTotalDeposits, formattedTotalEarnings, projectedYearlyEarnings, isLoading } =
    useInvestment()

  const [shareType, setShareType] = useState<"earnings" | "investment" | "rank">("earnings")
  const cardRef = useRef<HTMLDivElement>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.7,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const rankNames = [
    "Novice",
    "Apprentice",
    "Adept",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
    "Mythic",
    "Divine",
    "Immortal",
  ]

  const shareCard = () => {
    // In a real implementation, this would use html2canvas or a similar library
    // to capture the card as an image and then share it
    alert("Sharing functionality would be implemented here")
  }

  const downloadCard = () => {
    // In a real implementation, this would use html2canvas or a similar library
    // to capture the card as an image and then download it
    alert("Download functionality would be implemented here")
  }

  const shareToTwitter = () => {
    let text = ""
    if (shareType === "earnings") {
      text = `I'm earning ${formatNumber(projectedYearlyEarnings)} 5PT yearly with @5PTFinance! Join me and start earning passive income today.`
    } else if (shareType === "investment") {
      text = `I've invested ${formatNumber(formattedTotalDeposits)} 5PT with @5PTFinance! Join me in this amazing opportunity.`
    } else {
      text = `I've reached ${rankNames[userRank]} rank on @5PTFinance! Join me and start your investment journey today.`
    }

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://5pt.finance")}`,
      "_blank",
    )
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://5pt.finance")}`, "_blank")
  }

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-purple-950/10 border border-purple-500/30 p-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Share Your Success</h2>
          <p className="text-purple-300/70 text-sm">Show off your investment achievements</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-purple-400" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setShareType("earnings")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                shareType === "earnings"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setShareType("investment")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                shareType === "investment"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              Investment
            </button>
            <button
              onClick={() => setShareType("rank")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                shareType === "rank"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              Rank
            </button>
          </div>

          <div
            ref={cardRef}
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-xl p-6 border border-purple-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="flex items-center justify-between mb-6">
              <Logo size={36} />
              <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs">
                5PT Finance
              </div>
            </div>

            {shareType === "earnings" && (
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">My Yearly Earnings</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {isLoading ? "..." : formatNumber(projectedYearlyEarnings)}{" "}
                  <span className="text-purple-300">5PT</span>
                </div>
                <p className="text-sm text-purple-300/70">Earning passive income with 5PT Finance</p>
              </div>
            )}

            {shareType === "investment" && (
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">My Investment</h3>
                <div className="text-3xl font-bold text-white mb-2">
                  {isLoading ? "..." : formatNumber(formattedTotalDeposits)}{" "}
                  <span className="text-purple-300">5PT</span>
                </div>
                <p className="text-sm text-purple-300/70">Growing my wealth with 5PT Finance</p>
              </div>
            )}

            {shareType === "rank" && (
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">My Investor Rank</h3>
                <div className="text-3xl font-bold text-white mb-2">{isLoading ? "..." : rankNames[userRank]}</div>
                <p className="text-sm text-purple-300/70">Climbing the ranks with 5PT Finance</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-purple-300/70">Join me at 5PT.finance and start earning today!</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={shareCard}
              className="flex-1 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={downloadCard}
              className="flex-1 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-4">
          <h3 className="text-lg font-bold text-white">Share on Social Media</h3>

          <div className="space-y-3">
            <button
              onClick={shareToTwitter}
              className="w-full px-4 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors flex items-center gap-3"
            >
              <Twitter className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Share on Twitter</span>
            </button>

            <button
              onClick={shareToFacebook}
              className="w-full px-4 py-3 rounded-lg bg-blue-700/10 hover:bg-blue-700/20 border border-blue-700/30 transition-colors flex items-center gap-3"
            >
              <Facebook className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Share on Facebook</span>
            </button>

            <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-500/20">
              <h4 className="text-sm font-medium text-white mb-2">Why Share?</h4>
              <ul className="space-y-2 text-sm text-purple-300/70">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-400">1</span>
                  </div>
                  <span>Inspire others to join 5PT Finance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-400">2</span>
                  </div>
                  <span>Grow your referral network</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-400">3</span>
                  </div>
                  <span>Earn 5% commission on referral investments</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
