"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber, formatPercent } from "@/lib/utils"
import {
  TrendingUp,
  ArrowUpRight,
  Wallet,
  Users,
  Clock,
  Award,
  ChevronRight,
  Zap,
  BarChart3,
  ArrowRight,
  Sparkles,
  Activity,
  PieChart,
  Layers,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Progress } from "@/components/ui/progress"
import { useAccount } from "wagmi"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { GlowCard } from "@/components/ui/glow-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ParticleEffect } from "@/components/ui/particle-effect"
import { ValueStream } from "@/components/ui/value-stream"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardOverview() {
  const { address, isConnected } = useAccount()
  const {
    userTotalDeposits,
    userReferralBonus,
    userPoolRewards,
    tokenSymbol,
    userTokenBalance,
    projectedDailyYield,
    projectedMonthlyYield,
    projectedAnnualYield,
    dailyRatePercent,
    userRank,
    totalInvestors,
    totalValueLocked,
  } = useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [earningsPerSecond, setEarningsPerSecond] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Calculate earnings per second based on daily yield
    if (projectedDailyYield) {
      setEarningsPerSecond(projectedDailyYield / (24 * 60 * 60))
    }
  }, [projectedDailyYield])

  if (!mounted) return null

  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  // Calculate total earnings
  const totalEarnings = userPoolRewards + userReferralBonus

  // Calculate ROI
  const roi = userTotalDeposits > 0 ? (totalEarnings / userTotalDeposits) * 100 : 0

  // Calculate APY
  const apy = dailyRatePercent * 365

  // Format address for display
  const formattedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""

  // Toggle section visibility
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null)
    } else {
      setActiveSection(section)
    }
  }

  return (
    <div className="space-y-8">
      {/* Command Center Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-size-200">
            Investment Command Center
          </h1>
          <p className="text-gray-400 mt-1 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Connected as {formattedAddress} • Last update: just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20 h-10">
            <Clock className="mr-2 h-4 w-4" />
            Transaction History
          </Button>
          <CyberButton variant="primary" size="md">
            <Wallet className="mr-2 h-4 w-4" />
            Deposit Funds
          </CyberButton>
        </div>
      </motion.div>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Earnings Core */}
        <GlowCard className="lg:col-span-2 p-8 min-h-[400px]" intensity="high" glowColor="rgba(139, 92, 246, 0.6)">
          <div className="relative h-full">
            <ParticleEffect className="absolute inset-0 z-0" count={30} duration={3} spread={100} />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
                  Earnings Dashboard
                </h2>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-purple-300 hover:bg-purple-900/20">
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Refresh
                </Button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                <p className="text-gray-400 mb-2">Total Earnings</p>
                <div className="relative">
                  <AnimatedCounter
                    value={totalEarnings}
                    formatFn={(val) => formatCrypto(val, tokenSymbol)}
                    className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-size-200"
                  />
                  <div className="absolute -right-6 -top-6 text-green-400 font-medium text-sm bg-green-900/30 px-2 py-1 rounded-full flex items-center">
                    <ChevronUp className="h-3 w-3 mr-1" />
                    {formatPercent(roi)}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-400">ROI:</span>
                  <span className="text-green-400 font-medium">{formatPercent(roi)}</span>
                </div>

                <div className="w-full max-w-md mt-8">
                  <div className="text-sm text-gray-400 mb-1 flex justify-between">
                    <span>Earnings Breakdown</span>
                    <span>Total: {formatCrypto(totalEarnings, tokenSymbol)}</span>
                  </div>
                  <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      style={{ width: `${(userPoolRewards / totalEarnings) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                      <span>Pool Rewards: {formatCrypto(userPoolRewards, tokenSymbol)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      <span>Referral Bonuses: {formatCrypto(userReferralBonus, tokenSymbol)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="text-center text-sm text-gray-400 mb-2">Real-time Earnings Stream</div>
                <ValueStream rate={earningsPerSecond} symbol={tokenSymbol} className="w-full" />
                <div className="text-center text-xs text-gray-500">
                  Earning approximately {formatCrypto(earningsPerSecond * 60, tokenSymbol)} per minute
                </div>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Right Column - Wallet & Rank */}
        <div className="space-y-8">
          {/* Wallet Balance */}
          <GlowCard className="p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Wallet className="mr-2 h-4 w-4 text-purple-400" />
                  Wallet Balance
                </h3>
                <p className="text-sm text-gray-400">Available funds</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-purple-900/20"
                onClick={() => toggleSection("wallet")}
              >
                {activeSection === "wallet" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            <div className="mb-4">
              <AnimatedCounter
                value={userTokenBalance}
                formatFn={(val) => formatCrypto(val, tokenSymbol)}
                className="text-3xl font-bold text-white"
              />
              <p className="text-sm text-gray-400 mt-1">≈ ${formatNumber(userTokenBalance * 1.25)}</p>
            </div>

            <AnimatePresence>
              {activeSection === "wallet" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2 border-t border-purple-900/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Available to Withdraw</span>
                      <span className="text-sm font-medium text-white">
                        {formatCrypto(userTokenBalance * 0.8, tokenSymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Locked in Pools</span>
                      <span className="text-sm font-medium text-white">
                        {formatCrypto(userTotalDeposits, tokenSymbol)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Pending Rewards</span>
                      <span className="text-sm font-medium text-green-400">
                        +{formatCrypto(projectedDailyYield / 24, tokenSymbol)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <CyberButton variant="primary" size="sm">
                <Zap className="mr-1 h-3 w-3" />
                Deposit
              </CyberButton>
              <CyberButton variant="outline" size="sm">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                Withdraw
              </CyberButton>
            </div>
          </GlowCard>

          {/* Investor Rank */}
          <GlowCard className="p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Award className="mr-2 h-4 w-4 text-purple-400" />
                  Investor Rank
                </h3>
                <p className="text-sm text-gray-400">Level {userRank}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-purple-900/20"
                onClick={() => toggleSection("rank")}
              >
                {activeSection === "rank" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-purple-900/30 border-2 border-purple-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{userRank}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-900 border border-indigo-500 flex items-center justify-center">
                  <Award className="h-3 w-3 text-indigo-300" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {getRankTitle(userRank)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{getRankDescription(userRank)}</p>
            </div>

            <AnimatePresence>
              {activeSection === "rank" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2 border-t border-purple-900/30 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Pool Access</span>
                      <span className="text-xs font-medium text-white">Pools 1-{Math.min(userRank, 3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Bonus Multiplier</span>
                      <span className="text-xs font-medium text-green-400">+{userRank * 5}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Referral Commission</span>
                      <span className="text-xs font-medium text-blue-400">{4 + userRank * 0.5}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Current Rank</span>
                <span>Next Rank</span>
              </div>
              <Progress value={getRankProgress(userRank)} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Level {userRank}</span>
                <span>Level {userRank + 1}</span>
              </div>
            </div>
          </GlowCard>

          {/* Daily Stats */}
          <GlowCard className="p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-purple-400" />
                  Daily Projections
                </h3>
                <p className="text-sm text-gray-400">Based on current rates</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-purple-900/20"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Projections based on current APY of {formatPercent(apy)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3">
              <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-green-900/30 flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">Daily Yield</span>
                </div>
                <span className="text-green-400 font-medium">+{formatCrypto(projectedDailyYield, tokenSymbol)}</span>
              </div>

              <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/30 flex items-center justify-center mr-3">
                    <PieChart className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300">Weekly Projection</span>
                </div>
                <span className="text-blue-400 font-medium">+{formatCrypto(projectedDailyYield * 7, tokenSymbol)}</span>
              </div>

              <div className="bg-black/30 rounded-lg p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3">
                    <Layers className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-300">Monthly Projection</span>
                </div>
                <span className="text-purple-400 font-medium">+{formatCrypto(projectedMonthlyYield, tokenSymbol)}</span>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Investment Pools Section */}
      <GlowCard className="p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Layers className="mr-2 h-5 w-5 text-purple-400" />
              Investment Pools
            </h2>
            <p className="text-sm text-gray-400">Active investment opportunities</p>
          </div>
          <CyberButton variant="outline" size="sm">
            View All Pools
            <ChevronRight className="ml-2 h-4 w-4" />
          </CyberButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((poolId) => {
            const pool = {
              id: poolId,
              name: `Pool ${poolId}`,
              apy: poolId === 1 ? "12%" : poolId === 2 ? "18%" : "25%",
              lockPeriod: poolId === 1 ? "30 days" : poolId === 2 ? "60 days" : "90 days",
              requirement: poolId === 1 ? 550000 : poolId === 2 ? 1250000 : 3000000,
              qualified: userRank >= poolId,
              color:
                poolId === 1
                  ? "from-blue-600 to-blue-400"
                  : poolId === 2
                    ? "from-purple-600 to-purple-400"
                    : "from-indigo-600 to-indigo-400",
            }

            return (
              <motion.div
                key={pool.id}
                className={`relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ${
                  pool.qualified
                    ? "border-purple-500/50 bg-black/40 backdrop-blur-sm"
                    : "border-gray-700/50 bg-black/30 backdrop-blur-sm"
                }`}
                whileHover={pool.qualified ? { scale: 1.02, borderColor: "rgba(139, 92, 246, 0.8)" } : {}}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-80 rounded-t-lg"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      pool.qualified ? `var(--${pool.color.split(" ")[0].substring(5)})` : "gray"
                    }, 
                       ${pool.qualified ? `var(--${pool.color.split(" ")[1].substring(3)})` : "gray"})`,
                  }}
                />

                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-medium text-white">{pool.name}</h4>
                  <div
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      pool.qualified ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
                    }`}
                  >
                    {pool.qualified ? "Eligible" : "Not Eligible"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">APY</div>
                    <div className={`text-lg font-bold ${pool.qualified ? "text-white" : "text-gray-500"}`}>
                      {pool.apy}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400">Lock Period</div>
                    <div className={`text-lg font-bold ${pool.qualified ? "text-white" : "text-gray-500"}`}>
                      {pool.lockPeriod}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Requirement</div>
                  <div className="flex items-center">
                    <div
                      className={`h-1 flex-1 rounded-full ${pool.qualified ? "bg-gradient-to-r " + pool.color : "bg-gray-700"}`}
                    ></div>
                    <span className={`ml-2 text-xs ${pool.qualified ? "text-white" : "text-gray-500"}`}>
                      {formatNumber(pool.requirement)} 5PT
                    </span>
                  </div>
                </div>

                <CyberButton
                  variant={pool.qualified ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                  disabled={!pool.qualified}
                >
                  {pool.qualified ? "Invest Now" : "Not Eligible"}
                </CyberButton>
              </motion.div>
            )
          })}
        </div>
      </GlowCard>

      {/* Platform Stats & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Stats */}
        <GlowCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
              Platform Statistics
            </h3>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-purple-300 hover:bg-purple-900/20">
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Value Locked</p>
              <AnimatedCounter
                value={totalValueLocked * 1.25}
                formatFn={(val) => "$" + formatNumber(val)}
                className="text-xl font-bold text-white"
              />
            </div>

            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Investors</p>
              <AnimatedCounter
                value={totalInvestors}
                formatFn={(val) => formatNumber(val)}
                className="text-xl font-bold text-white"
              />
            </div>

            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Active Pools</p>
              <p className="text-xl font-bold text-white">7</p>
            </div>

            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Total Rewards Paid</p>
              <AnimatedCounter
                value={totalValueLocked * 0.3}
                formatFn={(val) => "$" + formatNumber(val)}
                className="text-xl font-bold text-white"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-purple-500/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Platform Growth</p>
              <div className="flex items-center text-xs text-green-400">
                <ChevronUp className="h-3 w-3 mr-1" />
                +12.4% this month
              </div>
            </div>

            <div className="h-12 w-full bg-black/50 rounded-md overflow-hidden relative">
              {/* Simplified chart visualization */}
              <div className="absolute inset-0 flex items-end">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = 20 + Math.random() * 60
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 opacity-80 mx-px rounded-t-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </GlowCard>

        {/* Quick Actions */}
        <GlowCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-purple-400" />
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-12">
              <Wallet className="mr-3 h-5 w-5 text-purple-400" />
              <div className="text-left">
                <div className="font-medium">Invest in Pools</div>
                <div className="text-xs text-gray-400">Explore investment options</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button variant="outline" className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-12">
              <Users className="mr-3 h-5 w-5 text-blue-400" />
              <div className="text-left">
                <div className="font-medium">Refer Friends</div>
                <div className="text-xs text-gray-400">Earn 5% commission</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button variant="outline" className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-12">
              <BarChart3 className="mr-3 h-5 w-5 text-green-400" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-gray-400">Track your performance</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <p className="text-sm text-center text-purple-300">Need help? Contact support or visit our documentation</p>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

function ConnectWalletPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-lg border border-purple-500/30 p-8 text-center max-w-2xl mx-auto my-12"
    >
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
      <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full bg-purple-900/30 mx-auto flex items-center justify-center mb-6 border border-purple-500/50">
          <Wallet className="h-10 w-10 text-purple-400" />
        </div>

        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Connect Your Wallet
        </h2>

        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Connect your wallet to view your investment dashboard, manage your pools, and track your earnings in
          real-time.
        </p>

        <div className="flex justify-center mb-8">
          <CustomConnectButton />
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <p className="text-2xl font-bold text-gradient">7</p>
            <p className="text-xs text-gray-400">Investment Pools</p>
          </div>
          <div className="text-center p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <p className="text-2xl font-bold text-gradient">292%</p>
            <p className="text-xs text-gray-400">Annual APY</p>
          </div>
          <div className="text-center p-3 bg-black/30 rounded-lg border border-purple-500/20">
            <p className="text-2xl font-bold text-gradient">12,847</p>
            <p className="text-xs text-gray-400">Active Investors</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Helper functions for rank information
function getRankTitle(rank: number): string {
  const titles = [
    "Novice Investor",
    "Bronze Investor",
    "Silver Investor",
    "Gold Investor",
    "Platinum Investor",
    "Diamond Investor",
    "Elite Investor",
    "Master Investor",
    "Legendary Investor",
  ]

  return titles[Math.min(rank, titles.length - 1)]
}

function getRankDescription(rank: number): string {
  const descriptions = [
    "Just getting started on your investment journey.",
    "Building your investment portfolio steadily.",
    "Growing your investments with strategic choices.",
    "Established investor with significant holdings.",
    "Advanced investor with premium pool access.",
    "Elite investor with exclusive benefits and rewards.",
    "Top-tier investor with maximum rewards access.",
    "Investment master with platform-wide recognition.",
    "Legendary status with maximum platform benefits.",
  ]

  return descriptions[Math.min(rank, descriptions.length - 1)]
}

function getRankProgress(rank: number): number {
  // Simulate progress to next rank based on current rank
  const progressMap = [30, 45, 60, 75, 85, 90, 95, 98, 100]
  return progressMap[Math.min(rank, progressMap.length - 1)]
}
