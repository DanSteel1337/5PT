"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { formatDate } from "@/lib/format"
import { shortenAddress } from "@/lib/format"

// Mock data for rewards history
const mockRewardsHistory = [
  {
    id: "1",
    date: new Date().getTime() / 1000 - 86400, // Yesterday
    amount: "0.0532",
    txHash: "0x1234567890123456789012345678901234567890",
    status: "Completed",
  },
  {
    id: "2",
    date: new Date().getTime() / 1000 - 86400 * 3, // 3 days ago
    amount: "0.0721",
    txHash: "0x2345678901234567890123456789012345678901",
    status: "Completed",
  },
  {
    id: "3",
    date: new Date().getTime() / 1000 - 86400 * 7, // 7 days ago
    amount: "0.0489",
    txHash: "0x3456789012345678901234567890123456789012",
    status: "Completed",
  },
  {
    id: "4",
    date: new Date().getTime() / 1000 - 86400 * 14, // 14 days ago
    amount: "0.0612",
    txHash: "0x4567890123456789012345678901234567890123",
    status: "Completed",
  },
]

export function RewardsHistory() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return (
      <Card className="glass border-border/40">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass border-border/40">
      <CardHeader>
        <CardTitle>Rewards History</CardTitle>
        <CardDescription>Your recent rewards claims</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRewardsHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No rewards history available.</p>
          ) : (
            mockRewardsHistory.map((reward) => (
              <div
                key={reward.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-background to-background/50 border border-border/40"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">{formatDate(reward.date)}</p>
                  <a
                    href={`https://bscscan.com/tx/${reward.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {shortenAddress(reward.txHash)}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{reward.amount} 5PT</p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {reward.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
