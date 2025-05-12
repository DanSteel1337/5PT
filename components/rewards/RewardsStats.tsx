"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingUp, Users, Calendar } from "lucide-react"

export function RewardsStats() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Animate progress bar
    const timer = setTimeout(() => setProgress(65), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <Card className="glass border-border/40">
      <CardHeader>
        <CardTitle>Rewards Statistics</CardTitle>
        <CardDescription>Your rewards performance and metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium">Monthly Target</h4>
            <span className="text-sm text-muted-foreground">65% Complete</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-muted"
            indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Award className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Total Earned</p>
              <p className="text-lg font-bold">0.2354 5PT</p>
              <p className="text-xs text-muted-foreground">$0.29 USD</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Growth Rate</p>
              <p className="text-lg font-bold">+12.5%</p>
              <p className="text-xs text-muted-foreground">vs. last month</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Referral Bonus</p>
              <p className="text-lg font-bold">0.0125 5PT</p>
              <p className="text-xs text-muted-foreground">From 2 referrals</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Next Boost</p>
              <p className="text-lg font-bold">3 days</p>
              <p className="text-xs text-muted-foreground">+5% rewards</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
