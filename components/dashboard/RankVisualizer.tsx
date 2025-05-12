"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Trophy, ChevronUp, Loader2, Crown, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for user rank
const rankData = {
  currentRank: 2,
  nextRank: 3,
  progress: 65,
  requirements: {
    investment: {
      current: 1450,
      required: 3000,
      unit: "5PT",
    },
    referrals: {
      current: 3,
      required: 5,
      unit: "users",
    },
    directVolume: {
      current: 6000,
      required: 10000,
      unit: "5PT",
    },
  },
}

// Rank colors and names with futuristic theme
const ranks = [
  { name: "Novice", color: "bg-gradient-to-r from-zinc-500 to-zinc-400", icon: Shield },
  { name: "Apprentice", color: "bg-gradient-to-r from-blue-600 to-blue-400", icon: Shield },
  { name: "Adept", color: "bg-gradient-to-r from-purple-600 to-purple-400", icon: Shield },
  { name: "Expert", color: "bg-gradient-to-r from-indigo-600 to-indigo-400", icon: Trophy },
  { name: "Master", color: "bg-gradient-to-r from-violet-600 to-violet-400", icon: Trophy },
  { name: "Grandmaster", color: "bg-gradient-to-r from-purple-600 to-blue-600", icon: Crown },
  { name: "Legend", color: "bg-gradient-to-r from-fuchsia-500 to-purple-600", icon: Crown },
]

export function RankVisualizer() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progressValue, setProgressValue] = useState(0)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Animate progress bar
      setProgressValue(rankData.progress)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const currentRankInfo = ranks[rankData.currentRank]
  const nextRankInfo = ranks[rankData.nextRank]
  const RankIcon = currentRankInfo.icon

  return (
    <Card className="glass-card overflow-hidden border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl">Rank & Status</CardTitle>
        </div>
        <CardDescription>Your current rank and progress</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <>
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className={cn("w-12 h-12 rounded-full flex items-center justify-center", currentRankInfo.color)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(139, 92, 246, 0.3)",
                      "0 0 15px rgba(139, 92, 246, 0.6)",
                      "0 0 0px rgba(139, 92, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <RankIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg neon-text">{currentRankInfo.name}</h3>
                  <p className="text-xs text-muted-foreground">Rank {rankData.currentRank + 1}</p>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                Level {rankData.currentRank + 1}
              </Badge>
            </motion.div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress to {nextRankInfo.name}</span>
                <span className="text-sm font-medium text-purple-400">{rankData.progress}%</span>
              </div>
              <Progress
                value={progressValue}
                className="h-2 bg-muted"
                indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-600"
              />
            </div>

            <div className="space-y-4">
              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-purple-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(139, 92, 246, 0.3)",
                  borderColor: "rgba(139, 92, 246, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">Personal Investment</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {rankData.requirements.investment.current}/{rankData.requirements.investment.required}{" "}
                      {rankData.requirements.investment.unit}
                    </span>
                    <ChevronUp
                      className={cn(
                        "h-4 w-4",
                        rankData.requirements.investment.current >= rankData.requirements.investment.required
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                </div>
                <Progress
                  value={(rankData.requirements.investment.current / rankData.requirements.investment.required) * 100}
                  className="h-1 mt-2 bg-muted"
                  indicatorClassName="bg-gradient-to-r from-purple-600 to-purple-400"
                />
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-blue-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">Direct Referrals</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {rankData.requirements.referrals.current}/{rankData.requirements.referrals.required}{" "}
                      {rankData.requirements.referrals.unit}
                    </span>
                    <ChevronUp
                      className={cn(
                        "h-4 w-4",
                        rankData.requirements.referrals.current >= rankData.requirements.referrals.required
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                </div>
                <Progress
                  value={(rankData.requirements.referrals.current / rankData.requirements.referrals.required) * 100}
                  className="h-1 mt-2 bg-muted"
                  indicatorClassName="bg-gradient-to-r from-blue-600 to-blue-400"
                />
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-indigo-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 20px -8px rgba(99, 102, 241, 0.3)",
                  borderColor: "rgba(99, 102, 241, 0.4)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">Direct Volume</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {rankData.requirements.directVolume.current}/{rankData.requirements.directVolume.required}{" "}
                      {rankData.requirements.directVolume.unit}
                    </span>
                    <ChevronUp
                      className={cn(
                        "h-4 w-4",
                        rankData.requirements.directVolume.current >= rankData.requirements.directVolume.required
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                </div>
                <Progress
                  value={
                    (rankData.requirements.directVolume.current / rankData.requirements.directVolume.required) * 100
                  }
                  className="h-1 mt-2 bg-muted"
                  indicatorClassName="bg-gradient-to-r from-indigo-600 to-indigo-400"
                />
              </motion.div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
