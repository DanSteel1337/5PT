"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Clock, TrendingUp, ArrowRight } from "lucide-react"
import type { PoolInfo } from "@/types/contracts"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { formatCurrency, formatPercentage, formatDuration } from "@/lib/format"

interface PoolCardProps {
  pool: PoolInfo
}

export function PoolCard({ pool }: PoolCardProps) {
  const [mounted, setMounted] = useState(false)
  const { formatPoolData } = useInvestmentManager()

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const formattedPool = formatPoolData(pool)

  return (
    <Card className="glass overflow-hidden border-border/40 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{pool.name}</CardTitle>
            <CardDescription className="mt-1">{pool.description}</CardDescription>
          </div>
          {pool.isActive ? (
            <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
          ) : (
            <Badge variant="outline">Closed</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Droplets className="h-3 w-3" /> Total Value Locked
            </span>
            <span className="font-medium">{formatCurrency(formattedPool.totalValueLockedFormatted)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> APY
            </span>
            <span className="font-medium text-green-500">{formatPercentage(formattedPool.apyFormatted)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Lock Period
            </span>
            <span className="font-medium">{formatDuration(formattedPool.lockPeriodDays)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Min Investment</span>
            <span className="font-medium">{formatCurrency(formattedPool.minInvestmentFormatted)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Link href={`/pools/${pool.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
