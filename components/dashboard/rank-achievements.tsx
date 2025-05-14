"use client"

import { motion } from "framer-motion"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"
import { Award, Crown, Star, TrendingUp, Users } from "lucide-react"

export function RankAchievements() {
  const { userRank, formattedTotalDeposits, isLoading } = useInvestment()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const rankColors = [
    "from-gray-500/20 to-gray-600/10 border-gray-500/30",
    "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    "from-green-500/20 to-green-600/10 border-green-500/30",
    "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
    "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    "from-red-500/20 to-red-600/10 border-red-500/30",
    "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    "from-violet-500/20 to-violet-600/10 border-violet-500/30",
  ]

  const rankIcons = [
    <Star key="0" className="w-5 h-5 text-gray-400" />,
    <Star key="1" className="w-5 h-5 text-blue-400" />,
    <Star key="2" className="w-5 h-5 text-green-400" />,
    <Star key="3" className="w-5 h-5 text-yellow-400" />,
    <Star key="4" className="w-5 h-5 text-orange-400" />,
    <Star key="5" className="w-5 h-5 text-red-400" />,
    <Crown key="6" className="w-5 h-5 text-pink-400" />,
    <Crown key="7" className="w-5 h-5 text-purple-400" />,
    <Crown key="8" className="w-5 h-5 text-indigo-400" />,
    <Crown key="9" className="w-5 h-5 text-violet-400" />,
  ]

  // Calculate next rank requirements
  const nextRank = Math.min(userRank + 1, 9)
  const nextRankDeposit = 550 * Math.pow(10, nextRank)
  const currentDeposit = Number.parseFloat(formattedTotalDeposits)
  const progress = Math.min(100, (currentDeposit / nextRankDeposit) * 100)

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-black/80 to-purple-950/10 border border-purple-500/30 p-6"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Rank & Achievements</h2>
          <p className="text-purple-300/70 text-sm">Your investor status and milestones</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Award className="w-5 h-5 text-purple-400" />
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          variants={item}
          className={`bg-gradient-to-br ${rankColors[userRank]} rounded-xl p-5 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M12 1L9 9H2L7 14.5L5 22L12 17.5L19 22L17 14.5L22 9H15L12 1Z" />
            </svg>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              {rankIcons[userRank]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{rankNames[userRank]}</h3>
              <p className="text-xs text-white/70">Investor Rank {userRank + 1}/10</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/70">Rank Benefits</span>
              <span className="text-xs font-medium text-white/90">+{(userRank + 1) * 0.1}% Daily Bonus</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Pool Eligibility</span>
              <span className="text-xs font-medium text-white/90">Pools 1-{Math.min(userRank + 1, 5)}</span>
            </div>
          </div>
        </motion.div>

        {userRank < 9 && (
          <motion.div variants={item} className="bg-purple-900/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-300">Next Rank Progress</h3>
              <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {progress.toFixed(1)}% Complete
              </div>
            </div>

            <div className="mb-3">
              <div className="text-sm text-purple-300/70 flex items-center justify-between mb-1">
                <span>Current: {formatNumber(formattedTotalDeposits)} 5PT</span>
                <span>Required: {formatNumber(nextRankDeposit)} 5PT</span>
              </div>
              <div className="h-2 bg-purple-900/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                {rankIcons[nextRank]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{rankNames[nextRank]} Rank</p>
                <p className="text-xs text-purple-300/70">+{(nextRank + 1) * 0.1}% Daily Bonus</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-purple-300">Your Achievements</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-900/5 rounded-lg p-3 border border-purple-500/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">First Investment</p>
                <p className="text-xs text-purple-300/70">Completed</p>
              </div>
            </div>

            <div className="bg-blue-900/5 rounded-lg p-3 border border-blue-500/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Rank Up</p>
                <p className="text-xs text-blue-300/70">Achieved {rankNames[userRank]}</p>
              </div>
            </div>

            {userRank >= 2 && (
              <div className="bg-green-900/5 rounded-lg p-3 border border-green-500/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Pool Qualifier</p>
                  <p className="text-xs text-green-300/70">Joined Pool {userRank}</p>
                </div>
              </div>
            )}

            <div className="bg-indigo-900/5 rounded-lg p-3 border border-indigo-500/10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Community Member</p>
                <p className="text-xs text-indigo-300/70">Joined 5PT</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
