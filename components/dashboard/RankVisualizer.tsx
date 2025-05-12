"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Trophy, ChevronUp, Loader2 } from "lucide-react"
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

// Rank colors and names
const ranks = [
  { name: "Novice", color: "bg-zinc-500" },
  { name: "Apprentice", color: "bg-blue-500" },
  { name: "Adept", color: "bg-purple-500" },
  { name: "Expert", color: "bg-pink-500" },
  { name: "Master", color: "bg-amber-500" },
  { name: "Grandmaster", color: "bg-gradient-to-r from-purple-600 to-blue-600" },
  { name: "Legend", color: "bg-gradient-to-r from-amber-500 to-red-500" },
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

  return (
    <Card className="glass border-border/40 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Rank & Status</CardTitle>
        <CardDescription>Your current rank and progress</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", currentRankInfo.color)}>
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentRankInfo.name}</h3>
                  <p className="text-xs text-muted-foreground">Rank {rankData.currentRank + 1}</p>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">Level {rankData.currentRank + 1}</Badge>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress to {nextRankInfo.name}</span>
                <span className="text-sm font-medium">{rankData.progress}%</span>
              </div>
              <Progress
                value={progressValue}
                className="h-2 bg-muted"
                indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-600"
              />
            </div>

            <div className="space-y-4">
              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-border/40"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
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
                  indicatorClassName="bg-purple-600"
                />
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-border/40"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
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
                  indicatorClassName="bg-blue-600"
                />
              </motion.div>

              <motion.div
                className="p-3 rounded-lg bg-gradient-to-r from-background to-background/50 border border-border/40"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
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
                  indicatorClassName="bg-cyan-600"
                />
              </motion.div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
