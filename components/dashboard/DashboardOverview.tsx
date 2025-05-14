"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
  Info,
  CreditCard,
  LineChart,
  Landmark,
  Percent,
  Share2,
  Gem,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Progress } from "@/components/ui/progress"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { PremiumCard } from "@/components/ui/premium-card"
import { StatDisplay } from "@/components/ui/stat-display"
import { AnimatedValue } from "@/components/ui/animated-value"
import { GradientBorder } from "@/components/ui/gradient-border"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"

interface DashboardOverviewProps {
  isConnected?: boolean
  address?: string
  activePage?: string
}

export function DashboardOverview({ isConnected, address, activePage = "overview" }: DashboardOverviewProps) {
  const router = useRouter()
  const pathname = usePathname()

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
  const [activeTab, setActiveTab] = useState(activePage)

  useEffect(() => {
    setMounted(true)

    // Calculate earnings per second based on daily yield
    if (projectedDailyYield) {
      setEarningsPerSecond(projectedDailyYield / (24 * 60 * 60))
    }
  }, [projectedDailyYield])

  useEffect(() => {
    // Update active tab based on URL
    if (pathname === "/dashboard") {
      setActiveTab("overview")
    } else if (pathname === "/dashboard/analytics") {
      setActiveTab("analytics")
    } else if (pathname === "/dashboard/investments") {
      setActiveTab("investments")
    } else if (pathname === "/dashboard/referrals") {
      setActiveTab("referrals")
    }
  }, [pathname])

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update URL based on tab
    if (value === "overview") {
      router.push("/dashboard")
    } else {
      router.push(`/dashboard/${value}`)
    }
  }

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
    <div className="space-y-10 px-4 max-w-[1600px] mx-auto">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-size-200">
            Investment Dashboard
          </h1>
          <p className="text-gray-400 mt-2 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Connected as {formattedAddress} • Last update: just now
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20 h-11 px-6">
            <Clock className="mr-3 h-4 w-4" />
            Transaction History
          </Button>
          <CyberButton variant="primary" size="md" className="h-11 px-6">
            <Wallet className="mr-3 h-4 w-4" />
            Deposit Funds
          </CyberButton>
        </div>
      </motion.div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/30">
            Overview
          </TabsTrigger>
          <TabsTrigger value="investments" className="data-[state=active]:bg-purple-900/30">
            Investments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-900/30">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-purple-900/30">
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Main Stats Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <PremiumCard variant="primary" className="p-8" hoverEffect={true} borderGlow={true}>
              <StatDisplay
                title="Total Balance"
                value={
                  <AnimatedValue
                    value={userTokenBalance}
                    formatFn={(val) => formatCrypto(val, tokenSymbol)}
                    className="text-3xl font-bold text-white"
                  />
                }
                icon={<Wallet className="h-5 w-5 text-purple-400" />}
                iconClassName="bg-purple-900/30"
                trend={{ value: `$${formatNumber(userTokenBalance * 1.25)}`, positive: true }}
              />
              <div className="mt-6 pt-6 border-t border-purple-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Available to Withdraw</span>
                  <span className="font-medium text-white">{formatCrypto(userTokenBalance * 0.8, tokenSymbol)}</span>
                </div>
                <CyberButton variant="outline" size="sm" className="w-full mt-4">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </CyberButton>
              </div>
            </PremiumCard>

            <PremiumCard variant="secondary" className="p-8" hoverEffect={true} borderGlow={true}>
              <StatDisplay
                title="Total Investments"
                value={
                  <AnimatedValue
                    value={userTotalDeposits}
                    formatFn={(val) => formatCrypto(val, tokenSymbol)}
                    className="text-3xl font-bold text-white"
                  />
                }
                icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
                iconClassName="bg-blue-900/30"
                trend={{ value: "Across all pools", positive: true }}
              />
              <div className="mt-6 pt-6 border-t border-blue-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Daily Yield ({formatPercent(dailyRatePercent)})</span>
                  <div className="flex items-center text-green-400">
                    <span className="font-medium">+{formatCrypto(projectedDailyYield, tokenSymbol)}</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
                <CyberButton variant="primary" size="sm" className="w-full mt-4">
                  <Zap className="mr-2 h-4 w-4" />
                  Invest More
                </CyberButton>
              </div>
            </PremiumCard>

            <PremiumCard variant="accent" className="p-8" hoverEffect={true} borderGlow={true}>
              <StatDisplay
                title="Total Earnings"
                value={
                  <AnimatedValue
                    value={totalEarnings}
                    formatFn={(val) => formatCrypto(val, tokenSymbol)}
                    className="text-3xl font-bold text-white"
                  />
                }
                icon={<Award className="h-5 w-5 text-violet-400" />}
                iconClassName="bg-violet-900/30"
                trend={{ value: formatPercent(roi) + " ROI", positive: true }}
              />
              <div className="mt-6 pt-6 border-t border-violet-500/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Earnings Breakdown</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(roi, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mr-1"></div>
                    <span>Pool: {formatPercent((userPoolRewards / totalEarnings) * 100)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 mr-1"></div>
                    <span>Referral: {formatPercent((userReferralBonus / totalEarnings) * 100)}</span>
                  </div>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard variant="primary" className="p-8" hoverEffect={true} borderGlow={true}>
              <StatDisplay
                title="Investor Rank"
                value={
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">{userRank}</span>
                    <span className="ml-2 text-lg text-gray-400">/ 9</span>
                  </div>
                }
                icon={<Gem className="h-5 w-5 text-purple-400" />}
                iconClassName="bg-purple-900/30"
                trend={{ value: getRankTitle(userRank), positive: true }}
              />
              <div className="mt-6 pt-6 border-t border-purple-500/10">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Current Rank</span>
                  <span>Next Rank</span>
                </div>
                <Progress value={getRankProgress(userRank)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Level {userRank}</span>
                  <span>Level {userRank + 1}</span>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Earnings Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <GradientBorder className="p-8" containerClassName="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="mr-3 h-5 w-5 text-purple-400" />
                  Earnings Dashboard
                </h2>
                <Button variant="ghost" size="sm" className="h-9 px-4 text-sm text-purple-300 hover:bg-purple-900/20">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center text-center mb-12">
                <p className="text-gray-400 mb-3">Total Accumulated Earnings</p>
                <div className="relative">
                  <AnimatedValue
                    value={totalEarnings}
                    formatFn={(val) => formatCrypto(val, tokenSymbol)}
                    className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-size-200"
                  />
                  <div className="absolute -right-8 -top-6 text-green-400 font-medium text-sm bg-green-900/30 px-3 py-1 rounded-full flex items-center">
                    <ChevronUp className="h-3 w-3 mr-1" />
                    {formatPercent(roi)}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-gray-400">Return on Investment:</span>
                  <span className="text-green-400 font-medium">{formatPercent(roi)}</span>
                </div>

                <div className="w-full max-w-xl mt-12">
                  <div className="text-sm text-gray-400 mb-2 flex justify-between">
                    <span>Earnings Breakdown</span>
                    <span>Total: {formatCrypto(totalEarnings, tokenSymbol)}</span>
                  </div>
                  <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      style={{ width: `${(userPoolRewards / totalEarnings) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Pool Rewards: {formatCrypto(userPoolRewards, tokenSymbol)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Referral Bonuses: {formatCrypto(userReferralBonus, tokenSymbol)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <PremiumCard variant="dark" className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center mr-3">
                      <Activity className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Daily Yield</p>
                      <p className="text-xl font-bold text-green-400">
                        +{formatCrypto(projectedDailyYield, tokenSymbol)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Based on {formatPercent(dailyRatePercent)} daily rate</div>
                </PremiumCard>

                <PremiumCard variant="dark" className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-3">
                      <LineChart className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Monthly Projection</p>
                      <p className="text-xl font-bold text-blue-400">
                        +{formatCrypto(projectedMonthlyYield, tokenSymbol)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Estimated earnings over next 30 days</div>
                </PremiumCard>

                <PremiumCard variant="dark" className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3">
                      <Percent className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Annual APY</p>
                      <p className="text-xl font-bold text-purple-400">{formatPercent(apy)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Annualized percentage yield</div>
                </PremiumCard>
              </div>

              <div className="relative h-16 bg-black/30 rounded-xl overflow-hidden p-4 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-300">Real-time Earnings</p>
                      <p className="text-xs text-gray-500">
                        Accruing approximately {formatCrypto(earningsPerSecond * 60, tokenSymbol)} per minute
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      <AnimatedValue
                        value={earningsPerSecond}
                        formatFn={(val) => formatCrypto(val, tokenSymbol)}
                        className="text-lg font-bold text-white"
                      />
                      <span className="text-xs text-gray-400 ml-1">/sec</span>
                    </p>
                  </div>
                </div>
              </div>
            </GradientBorder>

            <PremiumCard variant="primary" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Landmark className="mr-3 h-5 w-5 text-purple-400" />
                  Investment Summary
                </h2>
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
                      <p className="text-xs max-w-xs">Summary of your investment portfolio and performance metrics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-6">
                <div className="bg-black/30 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <CreditCard className="h-5 w-5 text-purple-400 mr-2" />
                    <p className="text-sm font-medium text-gray-300">Portfolio Value</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCrypto(userTotalDeposits + totalEarnings, tokenSymbol)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ ${formatNumber((userTotalDeposits + totalEarnings) * 1.25)}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Initial Investment</span>
                      <span className="text-sm text-gray-300">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total Earnings</span>
                      <span className="text-sm text-green-400">+{formatCrypto(totalEarnings, tokenSymbol)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <PieChart className="h-5 w-5 text-purple-400 mr-2" />
                    <p className="text-sm font-medium text-gray-300">Performance Metrics</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ROI</p>
                      <p className="text-xl font-bold text-green-400">{formatPercent(roi)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">APY</p>
                      <p className="text-xl font-bold text-green-400">{formatPercent(apy)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Daily Rate</p>
                      <p className="text-xl font-bold text-white">{formatPercent(dailyRatePercent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pools</p>
                      <p className="text-xl font-bold text-white">{Math.min(userRank, 3)}/7</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <Share2 className="h-5 w-5 text-purple-400 mr-2" />
                    <p className="text-sm font-medium text-gray-300">Referral Program</p>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">Earn {4 + userRank * 0.5}% commission on referrals</p>

                  <CyberButton variant="outline" size="sm" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Friends
                  </CyberButton>
                </div>
              </div>
            </PremiumCard>
          </div>

          {/* Investment Pools */}
          <GradientBorder className="p-8 mt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Layers className="mr-3 h-5 w-5 text-purple-400" />
                Investment Pools
              </h2>
              <CyberButton variant="outline" size="sm" className="px-5" onClick={() => handleTabChange("investments")}>
                View All Pools
                <ChevronRight className="ml-2 h-4 w-4" />
              </CyberButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <PremiumCard
                    key={pool.id}
                    variant={poolId === 1 ? "secondary" : poolId === 2 ? "primary" : "accent"}
                    className={`p-6 ${!pool.qualified && "opacity-70"}`}
                    hoverEffect={pool.qualified}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-medium text-white">{pool.name}</h4>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          pool.qualified ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {pool.qualified ? "Eligible" : "Not Eligible"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">APY</div>
                        <div className={`text-2xl font-bold ${pool.qualified ? "text-white" : "text-gray-500"}`}>
                          {pool.apy}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-1">Lock Period</div>
                        <div className={`text-2xl font-bold ${pool.qualified ? "text-white" : "text-gray-500"}`}>
                          {pool.lockPeriod}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2">Requirement</div>
                      <div className="flex items-center">
                        <div
                          className={`h-2 flex-1 rounded-full ${pool.qualified ? "bg-gradient-to-r " + pool.color : "bg-gray-700"}`}
                        ></div>
                        <span className={`ml-3 text-sm ${pool.qualified ? "text-white" : "text-gray-500"}`}>
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
                  </PremiumCard>
                )
              })}
            </div>
          </GradientBorder>
        </TabsContent>

        <TabsContent value="investments">
          <div className="space-y-8">
            <PremiumCard variant="primary" className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Investment Pools</h2>
              <p className="text-gray-400 mb-6">
                Manage your investments across our various pools. Each pool offers different APY rates and lock periods.
              </p>

              {/* Investment pools detailed content */}
              {/* This would be the detailed investments view */}
            </PremiumCard>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-8">
            <PremiumCard variant="primary" className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h2>
              <p className="text-gray-400 mb-6">
                Track your investment performance with detailed analytics and charts.
              </p>

              {/* Analytics content */}
              {/* This would be the analytics view */}
            </PremiumCard>
          </div>
        </TabsContent>

        <TabsContent value="referrals">
          <div className="space-y-8">
            <PremiumCard variant="primary" className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Referral Program</h2>
              <p className="text-gray-400 mb-6">
                Invite friends and earn commission on their investments. Track your referral performance here.
              </p>

              {/* Referrals content */}
              {/* This would be the referrals view */}
            </PremiumCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Platform Stats & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Stats */}
        <PremiumCard className="p-8 lg:col-span-2" variant="primary">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="mr-3 h-5 w-5 text-purple-400" />
              Platform Statistics
            </h3>
            <Button variant="ghost" size="sm" className="h-9 px-4 text-sm text-purple-300 hover:bg-purple-900/20">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Value Locked</p>
              <AnimatedValue
                value={totalValueLocked * 1.25}
                formatFn={(val) => "$" + formatNumber(val)}
                className="text-2xl font-bold text-white"
              />
            </div>

            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Investors</p>
              <AnimatedValue
                value={totalInvestors}
                formatFn={(val) => formatNumber(val)}
                className="text-2xl font-bold text-white"
              />
            </div>

            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400 mb-2">Active Pools</p>
              <p className="text-2xl font-bold text-white">7</p>
            </div>

            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400 mb-2">Total Rewards Paid</p>
              <AnimatedValue
                value={totalValueLocked * 0.3}
                formatFn={(val) => "$" + formatNumber(val)}
                className="text-2xl font-bold text-white"
              />
            </div>
          </div>

          <div className="mt-6 p-5 bg-black/30 rounded-xl border border-purple-500/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">Platform Growth</p>
              <div className="flex items-center text-xs text-green-400">
                <ChevronUp className="h-3 w-3 mr-1" />
                +12.4% this month
              </div>
            </div>

            <div className="h-16 w-full bg-black/50 rounded-lg overflow-hidden relative">
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

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </PremiumCard>

        {/* Quick Actions */}
        <PremiumCard className="p-8" variant="primary">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Zap className="mr-3 h-5 w-5 text-purple-400" />
            Quick Actions
          </h3>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-14 px-5"
            >
              <Wallet className="mr-4 h-5 w-5 text-purple-400" />
              <div className="text-left">
                <div className="font-medium">Invest in Pools</div>
                <div className="text-xs text-gray-400">Explore investment options</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-14 px-5"
            >
              <Users className="mr-4 h-5 w-5 text-blue-400" />
              <div className="text-left">
                <div className="font-medium">Refer Friends</div>
                <div className="text-xs text-gray-400">Earn 5% commission</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-purple-500/30 hover:bg-purple-900/20 h-14 px-5"
            >
              <BarChart3 className="mr-4 h-5 w-5 text-green-400" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-gray-400">Track your performance</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
            <p className="text-sm text-center text-purple-300">Need help? Contact support or visit our documentation</p>
          </div>
        </PremiumCard>
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
      className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-lg border border-purple-500/30 p-12 text-center max-w-3xl mx-auto my-16"
    >
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
      <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

      <div className="relative z-10">
        <div className="w-24 h-24 rounded-full bg-purple-900/30 mx-auto flex items-center justify-center mb-8 border border-purple-500/50">
          <Wallet className="h-12 w-12 text-purple-400" />
        </div>

        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Connect Your Wallet
        </h2>

        <p className="text-gray-300 mb-10 max-w-lg mx-auto text-lg">
          Connect your wallet to view your investment dashboard, manage your pools, and track your earnings in
          real-time.
        </p>

        <div className="flex justify-center mb-12">
          <CustomConnectButton />
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          <div className="text-center p-5 bg-black/30 rounded-xl border border-purple-500/20">
            <p className="text-3xl font-bold text-gradient">7</p>
            <p className="text-sm text-gray-400 mt-2">Investment Pools</p>
          </div>
          <div className="text-center p-5 bg-black/30 rounded-xl border border-purple-500/20">
            <p className="text-3xl font-bold text-gradient">292%</p>
            <p className="text-sm text-gray-400 mt-2">Annual APY</p>
          </div>
          <div className="text-center p-5 bg-black/30 rounded-xl border border-purple-500/20">
            <p className="text-3xl font-bold text-gradient">12,847</p>
            <p className="text-sm text-gray-400 mt-2">Active Investors</p>
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
