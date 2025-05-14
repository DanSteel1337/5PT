"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { PremiumCard } from "@/components/ui/premium-card"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { CyberButton } from "@/components/ui/cyber-button"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Award, Share2, Trophy, Star, Users, TrendingUp } from "lucide-react"

export function AchievementCards() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Get user rank
  const { data: userRank } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserRank",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user total deposits
  const { data: userTotalDeposits } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserTotalDeposits",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get user referral count
  const { data: userReferralCount } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserReferralCount",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const rank = userRank ? Number(userRank) : 0
  const formattedDeposits = userTotalDeposits ? Number.parseFloat(formatUnits(userTotalDeposits, 18)) : 0
  const referralCount = userReferralCount ? Number(userReferralCount) : 0

  // Define achievements
  const achievements = [
    {
      title: "Investment Milestone",
      description: "You've invested over 1,000 5PT tokens",
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      unlocked: formattedDeposits >= 1000,
      progress: Math.min((formattedDeposits / 1000) * 100, 100),
      color: "from-purple-600 to-blue-600",
      textColor: "text-purple-400",
    },
    {
      title: "Referral Network Builder",
      description: "You've referred 5 or more investors",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      unlocked: referralCount >= 5,
      progress: Math.min((referralCount / 5) * 100, 100),
      color: "from-blue-600 to-cyan-600",
      textColor: "text-blue-400",
    },
    {
      title: "Rank Advancement",
      description: "You've reached Rank 3 or higher",
      icon: <Trophy className="h-6 w-6 text-amber-400" />,
      unlocked: rank >= 3,
      progress: Math.min((rank / 3) * 100, 100),
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-400",
    },
  ]

  // Share achievement
  const shareAchievement = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `I've unlocked the "${achievement.title}" achievement on 5PT!`,
        text: `I've unlocked the "${achievement.title}" achievement on the 5PT Investment Platform. Join me and start earning!`,
        url: "https://5pt.finance",
      })
    } else {
      navigator.clipboard.writeText(
        `I've unlocked the "${achievement.title}" achievement on the 5PT Investment Platform. Join me and start earning! https://5pt.finance`,
      )
      alert("Achievement copied to clipboard!")
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
      <CyberCard variant="panel" className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mr-3">
            <Award className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Your Achievements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <PremiumCard
                variant={achievement.unlocked ? "primary" : "dark"}
                borderGlow={achievement.unlocked}
                className="h-full p-5 relative overflow-hidden"
              >
                {achievement.unlocked && (
                  <ParticleEffect
                    count={5}
                    colors={["#8B5CF6", "#6366F1", "#3B82F6"]}
                    className="absolute inset-0"
                    trigger="auto"
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center`}
                    >
                      {achievement.icon}
                    </div>

                    {achievement.unlocked && (
                      <div className="w-8 h-8 rounded-full bg-green-900/30 border border-green-500/50 flex items-center justify-center">
                        <Star className="h-4 w-4 text-green-400" />
                      </div>
                    )}
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                    {achievement.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className={achievement.unlocked ? achievement.textColor : "text-gray-400"}>
                        {achievement.progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${achievement.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </div>

                  {achievement.unlocked && (
                    <CyberButton
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => shareAchievement(achievement)}
                    >
                      <div className="flex items-center justify-center">
                        <Share2 className="h-4 w-4 mr-2" />
                        <span>Share Achievement</span>
                      </div>
                    </CyberButton>
                  )}
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </CyberCard>
    </motion.div>
  )
}
