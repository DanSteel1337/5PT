"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { getRankName, getRankColor, formatCrypto } from "@/lib/utils"

export function RankDisplay() {
  const { userRank, userTotalDeposits, tokenSymbol } = useInvestmentData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate progress to next rank
  const rankRequirements = [
    0, // Novice
    100, // Apprentice
    500, // Adept
    1000, // Expert
    5000, // Master
    10000, // Grandmaster
    25000, // Legend
    50000, // Mythic
    100000, // Divine
    250000, // Immortal
  ]

  const currentRankRequirement = rankRequirements[userRank]
  const nextRankRequirement = rankRequirements[userRank + 1] || rankRequirements[userRank] * 2
  const progressToNextRank = Math.min(
    ((userTotalDeposits - currentRankRequirement) / (nextRankRequirement - currentRankRequirement)) * 100,
    100,
  )

  return (
    <Card className="glass-card-purple p-6 animate-pulse-glow">
      <h3 className="text-xl font-bold mb-4 text-gradient">Your Rank</h3>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-24 h-24 rounded-full bg-black/50 flex items-center justify-center mb-4 border-4 border-purple-500/30">
          <span className={`text-4xl font-bold ${getRankColor(userRank)}`}>{userRank}</span>
        </div>

        <h4 className={`text-2xl font-bold mb-1 ${getRankColor(userRank)}`}>{getRankName(userRank)}</h4>

        <p className="text-gray-400 text-sm mb-4">Total Investment: {formatCrypto(userTotalDeposits, tokenSymbol)}</p>

        {userRank < 9 && (
          <>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: `${progressToNextRank}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-400">
              {formatCrypto(nextRankRequirement - userTotalDeposits, tokenSymbol)} more to reach{" "}
              {getRankName(userRank + 1)}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-purple-900/30">
        <h4 className="font-bold text-sm text-gray-300 mb-2">Rank Benefits</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span className="text-gray-300">Access to {userRank >= 2 ? "Growth" : "Starter"} Pool</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span className="text-gray-300">{userRank + 3}% Referral Commission</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-400 mr-2">•</span>
            <span className="text-gray-300">{userRank >= 5 ? "Priority" : "Standard"} Support</span>
          </li>
        </ul>
      </div>
    </Card>
  )
}
