"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Droplets, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatPercentage, formatDuration } from "@/lib/format"

// Mock data for active pools
const activePools = [
  {
    id: 1,
    name: "Starter Pool",
    invested: 550,
    apy: 12.5,
    lockPeriod: 30,
    pendingRewards: 0.0125,
  },
  {
    id: 2,
    name: "Growth Pool",
    invested: 900,
    apy: 15.0,
    lockPeriod: 60,
    pendingRewards: 0.0345,
  },
]

export function ActivePools() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <Card className="glass border-border/40 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Active Investments</CardTitle>
            <CardDescription>Your current pool investments</CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">{activePools.length} Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {activePools.map((pool, index) => (
              <motion.div
                key={pool.id}
                className="p-4 rounded-lg bg-gradient-to-r from-background to-background/50 border border-border/40"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1)" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">{pool.name}</h3>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Invested:</span>
                    <span className="text-xs font-medium ml-auto">{pool.invested} 5PT</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">APY:</span>
                    <span className="text-xs font-medium text-green-500 ml-auto">{formatPercentage(pool.apy)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Lock Period:</span>
                    <span className="text-xs font-medium ml-auto">{formatDuration(pool.lockPeriod * 86400)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-muted-foreground">Pending:</span>
                    <span className="text-xs font-medium text-purple-400 ml-auto">
                      {pool.pendingRewards.toFixed(4)} 5PT
                    </span>
                  </div>
                </div>

                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href={`/pools/${pool.id}`}>
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </motion.div>
            ))}

            <Button
              asChild
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Link href="/pools">
                Explore More Pools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
