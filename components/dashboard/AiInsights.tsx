"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Sparkles, Lightbulb, RefreshCw, Cpu, Zap } from "lucide-react"

// Mock AI insights
const insights = [
  {
    id: 1,
    type: "Opportunity",
    title: "Pool #3 Optimization",
    description:
      "Based on your investment pattern, increasing your stake in Pool #3 by 250 5PT could boost your monthly returns by approximately 15%.",
    action: "Optimize Investment",
  },
  {
    id: 2,
    type: "Strategy",
    title: "Referral Network Growth",
    description:
      "Your referral network has grown by 2 users this month. Sharing your referral link with 5 more potential investors could increase your referral rewards by up to 30%.",
    action: "Share Referral Link",
  },
  {
    id: 3,
    type: "Alert",
    title: "Unclaimed Rewards",
    description:
      "You have 0.0548 5PT in unclaimed rewards that have been pending for over 7 days. Consider claiming these rewards to maximize your compound growth.",
    action: "Claim Rewards",
  },
]

export function AiInsights() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentInsight, setCurrentInsight] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const insight = insights[currentInsight]

  const handleNextInsight = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentInsight((prev) => (prev + 1) % insights.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handlePrevInsight = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <Card className="glass-card overflow-hidden border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-xl">AI Insights</CardTitle>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Powered by AI
          </Badge>
        </div>
        <CardDescription>Personalized investment recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              }}
            >
              <Cpu className="h-8 w-8 text-purple-400" />
            </motion.div>
            <p className="text-sm text-muted-foreground">Analyzing your investment data...</p>
            <motion.div className="w-48 h-1 bg-muted rounded-full overflow-hidden" initial={{ width: "48px" }}>
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              />
            </motion.div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px]"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={
                    insight.type === "Opportunity"
                      ? "text-green-500"
                      : insight.type === "Strategy"
                        ? "text-blue-500"
                        : "text-amber-500"
                  }
                >
                  {insight.type === "Opportunity" ? (
                    <Sparkles className="h-5 w-5" />
                  ) : insight.type === "Strategy" ? (
                    <Lightbulb className="h-5 w-5" />
                  ) : (
                    <RefreshCw className="h-5 w-5" />
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={
                    insight.type === "Opportunity"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : insight.type === "Strategy"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }
                >
                  {insight.type}
                </Badge>
              </div>

              <h3 className="text-lg font-medium mb-2">{insight.title}</h3>
              <p className="text-muted-foreground mb-6">{insight.description}</p>

              <div className="flex justify-between items-center">
                <Button className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 border-none">
                  <Zap className="mr-2 h-4 w-4" /> {insight.action}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-purple-500/10 hover:text-purple-400"
                    onClick={handlePrevInsight}
                    disabled={insights.length <= 1 || isAnimating}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentInsight + 1}/{insights.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-purple-500/10 hover:text-purple-400"
                    onClick={handleNextInsight}
                    disabled={insights.length <= 1 || isAnimating}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
