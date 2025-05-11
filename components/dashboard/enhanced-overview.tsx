"use client"

import { useState, useEffect, useRef } from "react"
import { useAccount } from "wagmi"
import * as motion from "framer-motion" // Import all exports from framer-motion
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { InvestmentPerformanceCard } from "@/components/dashboard/investment-performance-card"
import { ContractStatisticsCard } from "@/components/dashboard/contract-statistics-card"
import { ShareCard } from "@/components/dashboard/share-card"
import {
  ArrowUpRight,
  Award,
  Clock,
  Coins,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { captureScreenshot, isScreenshotSupported, downloadDataUrl } from "@/lib/html2canvas-util"

// Create a wrapper for motion components to avoid direct imports
const Motion = {
  div: motion.motion.div,
  h1: motion.motion.h1,
  p: motion.motion.p,
}

export function EnhancedOverview() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [rewardCounter, setRewardCounter] = useState(0)
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false)
  const lastUpdateRef = useRef(Date.now()) // Use ref instead of state to avoid re-renders
  const earningsPerSecond = 0.000042 // Mock value
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Particle animation for the background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
    }[] = []

    const createParticle = () => {
      const colors = ["#9333ea", "#c026d3", "#7c3aed", "#8b5cf6"]
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      }
    }

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Update reward counter every second - fixed to avoid infinite loop
  useEffect(() => {
    if (!isConnected) return

    // Initial update based on time elapsed since last render
    const updateRewards = () => {
      const now = Date.now()
      const secondsElapsed = (now - lastUpdateRef.current) / 1000
      setRewardCounter((prev) => prev + earningsPerSecond * secondsElapsed)
      lastUpdateRef.current = now // Update the ref, not state
    }

    // Update immediately
    updateRewards()

    // Set up interval for future updates
    const interval = setInterval(() => {
      updateRewards()

      // Pulse animation every 5 seconds (only visual, doesn't affect the loop)
      setShowPulse(true)
      const pulseTimeout = setTimeout(() => setShowPulse(false), 1000)

      return () => clearTimeout(pulseTimeout)
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected, earningsPerSecond]) // Remove lastUpdate from dependencies

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated to the latest values.",
      })
    }, 1500)
  }

  // Handle screenshot - completely rewritten to use our new utility
  const captureScreenshotHandler = () => {
    // Check if screenshot functionality is supported
    if (!isScreenshotSupported()) {
      toast({
        title: "Screenshot Feature Unavailable",
        description: "This feature is not available in your current environment.",
        variant: "destructive",
      })
      return
    }

    setIsCapturingScreenshot(true)
    toast({
      title: "Preparing Screenshot",
      description: "Creating your dashboard image...",
    })

    captureScreenshot(
      "dashboard-capture",
      (dataUrl) => {
        // Success handler
        downloadDataUrl(dataUrl, "5PT-Dashboard-Showcase.png")
        setIsCapturingScreenshot(false)
        toast({
          title: "Screenshot Captured!",
          description: "Your dashboard image has been downloaded.",
        })
      },
      (error) => {
        // Error handler
        setIsCapturingScreenshot(false)
        toast({
          title: "Screenshot Failed",
          description: error.message || "There was an error creating your dashboard image.",
          variant: "destructive",
        })
      },
    )
  }

  // Handle share
  const handleShare = () => {
    const text =
      "Check out my 5PT investment performance! Join the Five Pillars Token ecosystem and start earning today. #5PT #CryptoInvesting"
    const url = "https://5pt.finance"

    if (navigator.share) {
      navigator
        .share({
          title: "My 5PT Dashboard",
          text: text,
          url: url,
        })
        .catch((error) => console.error("Share error:", error))
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    }
  }

  return (
    <div className="relative p-4 md:p-6 lg:p-8 space-y-6 overflow-hidden">
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20" />

      <div id="dashboard-capture" className="relative z-10">
        {/* Header with animated gradient text */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-gradient">
                5PT Investment Dashboard
              </span>
            </Motion.h1>
            <Motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Complete overview of your Five Pillars Token investment performance
            </Motion.p>
          </div>
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
              onClick={captureScreenshotHandler}
              disabled={isCapturingScreenshot}
            >
              <Download className="h-4 w-4 mr-2" />
              {isCapturingScreenshot ? "Capturing..." : "Screenshot"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </Motion.div>
        </div>

        {/* Animated tabs */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6 bg-background/50 backdrop-blur-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="investments"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white transition-all duration-300"
              >
                Investments
              </TabsTrigger>
              <TabsTrigger
                value="pools"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white transition-all duration-300"
              >
                Pools
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white transition-all duration-300"
              >
                Referrals
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white transition-all duration-300"
              >
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <EnhancedTokenMetricsCard />
                </Motion.div>

                <Motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <EnhancedInvestmentCard rewardCounter={rewardCounter} showPulse={showPulse} />
                </Motion.div>
              </div>

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <EnhancedContractStatisticsCard />
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <ShareCard />
              </Motion.div>
            </TabsContent>

            <TabsContent value="investments" className="space-y-6 mt-0">
              <InvestmentPerformanceCard expanded={true} />
            </TabsContent>

            <TabsContent value="pools" className="mt-0">
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Pools content will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="mt-0">
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Referrals content will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6 mt-0">
              <ContractStatisticsCard expanded={true} />
            </TabsContent>
          </Tabs>
        </Motion.div>
      </div>
    </div>
  )
}

// Enhanced Token Metrics Card with animations
function EnhancedTokenMetricsCard() {
  const [priceChange, setPriceChange] = useState(5.42)
  const [isPositive, setIsPositive] = useState(true)

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newChange = (Math.random() * 10 - 3).toFixed(2)
      setPriceChange(Number.parseFloat(newChange))
      setIsPositive(Number.parseFloat(newChange) >= 0)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-sm h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Token Metrics</h2>
            <Badge
              variant="outline"
              className={cn(
                "animate-pulse-slow border-none",
                isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
              )}
              {Math.abs(priceChange).toFixed(2)}% (24h)
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  $0.00
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-2xl font-bold text-purple-300">$0</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Supply</div>
                <div className="text-2xl font-bold text-purple-300">0</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Circulating Supply</div>
                <div className="text-2xl font-bold text-purple-300">0</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Token Holders</div>
                <div className="text-2xl font-bold text-purple-300">0</div>
              </div>

              <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center">
                <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-sm">Price chart coming soon</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.motion.div>
  )
}

// Enhanced Investment Card with animations
function EnhancedInvestmentCard({
  rewardCounter,
  showPulse,
}: {
  rewardCounter: number
  showPulse: boolean
}) {
  return (
    <motion.motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-sm h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Investment Performance</h2>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              109.53% APY
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Deposit</div>
              <div className="text-2xl font-bold text-purple-300">0 5PT</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Rewards</div>
              <div className="text-2xl font-bold text-purple-300">0 5PT</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">ROI</div>
              <div className="text-2xl font-bold text-purple-300">0.00%</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Next Claim</div>
              <div className="text-2xl font-bold text-purple-300">Now</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Current Rewards</span>
                <span className="text-sm font-medium text-purple-300">{rewardCounter.toFixed(6)} 5PT</span>
              </div>
              <Progress
                value={100}
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
              />
            </div>

            <motion.motion.div
              animate={showPulse ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20"
            >
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                Real-time Earnings
              </h4>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono tabular-nums mb-1">
                +{rewardCounter.toFixed(6)} 5PT
              </div>
              <div className="text-xs text-muted-foreground">Earning approximately 0.000 5PT per day</div>
            </motion.motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="col-span-2">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Claim Rewards
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
            >
              Deposit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.motion.div>
  )
}

// Enhanced Contract Statistics Card with animations
function EnhancedContractStatisticsCard() {
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 0,
    seconds: 0,
  })

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 4, minutes: 0, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contract Statistics</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Coins className="h-4 w-4 mr-1 text-purple-400" />
                Total Value Locked
              </div>
              <div className="text-2xl font-bold text-purple-300">0 5PT</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-1 text-purple-400" />
                Total Investors
              </div>
              <div className="text-2xl font-bold text-purple-300">0</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Award className="h-4 w-4 mr-1 text-purple-400" />
                Platform Fee
              </div>
              <div className="text-2xl font-bold text-purple-300">0%</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1 text-purple-400" />
                Contract Age
              </div>
              <div className="text-2xl font-bold text-purple-300">0 days</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-400" />
                Next Deposit Available In
              </h4>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                4h Delay
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <motion.motion.div
                animate={{ scale: [1, countdown.seconds === 0 ? 1.05 : 1, 1] }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-b from-purple-900/50 to-purple-900/30 rounded-lg"
              >
                <div className="text-2xl font-bold text-purple-300 font-mono">
                  {countdown.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </motion.motion.div>

              <motion.motion.div
                animate={{ scale: [1, countdown.seconds === 0 && countdown.minutes === 0 ? 1.05 : 1, 1] }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-b from-purple-900/50 to-purple-900/30 rounded-lg"
              >
                <div className="text-2xl font-bold text-purple-300 font-mono">
                  {countdown.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </motion.motion.div>

              <motion.motion.div
                animate={{ scale: [1, countdown.seconds === 0 ? 1.05 : 1, 1] }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-b from-purple-900/50 to-purple-900/30 rounded-lg"
              >
                <div className="text-2xl font-bold text-purple-300 font-mono">
                  {countdown.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </motion.motion.div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Time Elapsed</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(
                    (4 * 3600 - (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds)) / (4 * 36),
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(4 * 3600 - (countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds)) / (4 * 36)}
                className="h-1"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.motion.div>
  )
}
