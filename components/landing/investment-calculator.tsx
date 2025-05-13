"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CyberButton } from "@/components/ui/cyber-button"
import { TiltCard } from "@/components/parallax/tilt-card"
import { Calculator, TrendingUp, BarChart3, Calendar, Info } from "lucide-react"
import { formatCrypto, formatPercent } from "@/lib/utils"
import Link from "next/link"
import { ContentCard } from "@/components/ui/content-card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Updated pool data from the latest contract documentation
const INVESTMENT_POOLS = [
  {
    id: "starter",
    name: "Starter Pool",
    dailyRate: 0.3, // Base daily rate (not pool rate)
    minDeposit: 550, // ~$1,000 at $0.00175 per token
    lockPeriod: 0,
    rankRequired: 0,
    description: "Perfect for beginners. Low risk with steady returns.",
  },
  {
    id: "growth",
    name: "Growth Pool",
    dailyRate: 0.3, // Base daily rate (not pool rate)
    minDeposit: 1450, // ~$2,500 at $0.00175 per token
    lockPeriod: 0,
    rankRequired: 2,
    description: "Balanced risk-reward ratio for experienced investors.",
  },
  {
    id: "premium",
    name: "Premium Pool",
    dailyRate: 0.3, // Base daily rate (not pool rate)
    minDeposit: 3000, // ~$5,000 at $0.00175 per token
    lockPeriod: 0,
    rankRequired: 5,
    description: "Higher returns for committed investors.",
  },
]

// Timeframe options
const TIMEFRAME_OPTIONS = [
  { value: 7, label: "7 Days" },
  { value: 14, label: "14 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
  { value: 180, label: "180 Days" },
  { value: 365, label: "1 Year" },
]

// Updated reward rates based on latest contract
const REWARD_RATES = {
  dailyBase: 0.3, // 0.3% daily on invested capital
  directReferral: 0.025, // 0.025% daily on direct referrals' deposits
  downlineBonus: 0.06, // 0.06% per level (levels 2-10)
  poolBonuses: {
    pools1to5: 0.0175, // 0.0175% each for pools 1-5
    pools6to7: 0.01, // 0.01% each for pools 6-7
    pools8to9: 0.02, // 0.02% each for pools 8-9
  },
}

// Tax rates (fixed at 10%)
const TAX_RATES = {
  deposit: 10,
  claim: 10,
}

// Helper function to format with specific decimals
function formatWithDecimals(value: number, decimals = 3): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function InvestmentCalculator() {
  // State for calculator inputs
  const [selectedPool, setSelectedPool] = useState(INVESTMENT_POOLS[1].id) // Default to Growth Pool
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [timeframe, setTimeframe] = useState(30)
  const [isCompounding, setIsCompounding] = useState(true)
  const [referralCount, setReferralCount] = useState(0)
  const [referralInvestment, setReferralInvestment] = useState(500)
  const [downlineCount, setDownlineCount] = useState(0)
  const [downlineInvestment, setDownlineInvestment] = useState(300)
  const [mounted, setMounted] = useState(false)

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the selected pool data
  const pool = useMemo(() => INVESTMENT_POOLS.find((p) => p.id === selectedPool) || INVESTMENT_POOLS[0], [selectedPool])

  // Calculate investment returns
  const calculationResults = useMemo(() => {
    // Base calculation variables
    const dailyRate = REWARD_RATES.dailyBase / 100
    const days = timeframe
    let totalValue = investmentAmount
    const dailyValues = [{ day: 0, value: investmentAmount }]

    // Apply deposit tax (10%)
    const afterTaxInvestment = investmentAmount * 0.9 // 10% tax
    let workingCapital = afterTaxInvestment

    // Calculate daily rewards
    const dailyRewards = []
    let totalPoolEarnings = 0
    let totalReferralEarnings = 0
    let totalDownlineEarnings = 0

    for (let day = 1; day <= days; day++) {
      // Base daily reward (0.3%)
      const baseReward = workingCapital * dailyRate

      // Pool rewards (varies by pool type)
      let poolReward = 0
      if (selectedPool === "starter") {
        poolReward = workingCapital * (REWARD_RATES.poolBonuses.pools1to5 / 100)
      } else if (selectedPool === "growth") {
        poolReward = workingCapital * ((REWARD_RATES.poolBonuses.pools1to5 * 3) / 100) // Assuming 3 pools
      } else if (selectedPool === "premium") {
        poolReward =
          workingCapital * ((REWARD_RATES.poolBonuses.pools1to5 * 5 + REWARD_RATES.poolBonuses.pools6to7 * 2) / 100) // All pools
      }

      // Referral rewards (0.025% on direct referrals)
      const referralReward =
        referralCount > 0 ? referralCount * referralInvestment * (REWARD_RATES.directReferral / 100) : 0

      // Downline rewards (0.06% on downline)
      const downlineReward =
        downlineCount > 0 ? downlineCount * downlineInvestment * (REWARD_RATES.downlineBonus / 100) : 0

      // Total daily reward
      const dailyReward = baseReward + poolReward + referralReward + downlineReward

      // Apply claim tax (10%)
      const afterTaxReward = dailyReward * 0.9 // 10% tax

      // Track earnings by type
      totalPoolEarnings += baseReward + poolReward
      totalReferralEarnings += referralReward
      totalDownlineEarnings += downlineReward

      // Store daily reward details
      dailyRewards.push({
        day,
        baseReward,
        poolReward,
        referralReward,
        downlineReward,
        totalReward: dailyReward,
        afterTaxReward,
      })

      // Update working capital based on compounding setting
      if (isCompounding) {
        // For compounding, 50% of after-tax rewards are auto-reinvested
        const reinvestedAmount = afterTaxReward * 0.5
        workingCapital += reinvestedAmount
        totalValue = workingCapital + afterTaxReward * 0.5 * day // Add accumulated withdrawable rewards
      } else {
        // For non-compounding, all rewards are withdrawn
        totalValue = workingCapital + afterTaxReward * day
      }

      // Store daily value for chart
      dailyValues.push({ day, value: totalValue })
    }

    // Calculate final results
    const initialInvestment = investmentAmount
    const afterTaxInitial = afterTaxInvestment
    const totalTaxPaid =
      investmentAmount * 0.1 + (totalPoolEarnings + totalReferralEarnings + totalDownlineEarnings) * 0.1
    const totalEarnings = totalPoolEarnings + totalReferralEarnings + totalDownlineEarnings
    const afterTaxEarnings = totalEarnings * 0.9
    const roi = (afterTaxEarnings / initialInvestment) * 100
    const dailyAverage = afterTaxEarnings / days
    const effectiveApr = (afterTaxEarnings / initialInvestment) * (365 / days) * 100

    return {
      initialInvestment,
      afterTaxInitial,
      finalValue: totalValue,
      totalPoolEarnings,
      totalReferralEarnings,
      totalDownlineEarnings,
      totalEarnings,
      afterTaxEarnings,
      totalTaxPaid,
      roi,
      dailyAverage,
      dailyValues,
      dailyRewards,
      apr: REWARD_RATES.dailyBase * 365, // Annual percentage rate (base)
      effectiveApr, // Effective APR including all rewards
    }
  }, [
    investmentAmount,
    selectedPool,
    timeframe,
    isCompounding,
    referralCount,
    referralInvestment,
    downlineCount,
    downlineInvestment,
  ])

  if (!mounted) return null

  return (
    <TiltCard intensity={5} className="w-full">
      <ContentCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-purple-400" />
            Investment Calculator
          </h3>
          <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
            <motion.div
              className="w-1 h-1 bg-purple-500 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 5px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.8)",
                  "0 0 5px rgba(139, 92, 246, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Inputs */}
          <div className="space-y-6">
            {/* Pool Selection */}
            <div className="space-y-3">
              <label className="text-sm text-gray-400">Select Investment Pool</label>
              <Tabs defaultValue={selectedPool} onValueChange={(value) => setSelectedPool(value)}>
                <TabsList className="grid grid-cols-3 w-full">
                  {INVESTMENT_POOLS.map((p) => (
                    <TabsTrigger key={p.id} value={p.id}>
                      {p.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-gray-400">{pool.description}</p>
              <div className="flex justify-between text-xs">
                <span className="text-purple-400">Daily Base Rate: {REWARD_RATES.dailyBase}%</span>
                <span className="text-purple-400">
                  Min Deposit: {pool.minDeposit} 5PT (~${(pool.minDeposit * 0.00175).toFixed(2)})
                </span>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Investment Amount (5PT)</label>
                <span className="text-sm font-medium">
                  {investmentAmount} 5PT (~${(investmentAmount * 0.00175).toFixed(2)})
                </span>
              </div>
              <Slider
                value={[investmentAmount]}
                min={pool.minDeposit}
                max={10000}
                step={100}
                onValueChange={(value) => setInvestmentAmount(value[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{pool.minDeposit} 5PT</span>
                <span>10,000 5PT</span>
              </div>
            </div>

            {/* Timeframe */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Investment Period</label>
                <span className="text-sm font-medium">{timeframe} Days</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIMEFRAME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`text-xs py-2 px-3 rounded-md transition-colors ${
                      timeframe === option.value
                        ? "bg-purple-900/50 border border-purple-500/50"
                        : "bg-black/30 hover:bg-black/50"
                    }`}
                    onClick={() => setTimeframe(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compounding Toggle */}
            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
              <div>
                <label className="text-sm font-medium">Compound Returns</label>
                <p className="text-xs text-gray-400">Auto-reinvest 50% of daily rewards</p>
              </div>
              <Switch
                checked={isCompounding}
                onCheckedChange={setIsCompounding}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {/* Referral Settings */}
            <div className="space-y-3 bg-black/30 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Referral Network</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Direct referrals earn you {REWARD_RATES.directReferral}% daily on their deposits. Downline
                        referrals (levels 2-10) earn you {REWARD_RATES.downlineBonus}% daily on their deposits.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* Direct Referrals */}
                <div className="bg-black/20 p-2 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs text-gray-400">
                      Direct Referrals ({REWARD_RATES.directReferral}% daily)
                    </Label>
                    <span className="text-xs font-medium text-purple-400">{referralCount}</span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[referralCount]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => setReferralCount(value[0])}
                    />
                    <div className="flex justify-between text-xs">
                      <span>0</span>
                      <span className="text-purple-400">
                        {formatWithDecimals(referralCount * referralInvestment * (REWARD_RATES.directReferral / 100))}{" "}
                        5PT/day
                      </span>
                      <span>20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-gray-400">Avg. Investment</Label>
                      <span className="text-xs font-medium text-purple-400">{referralInvestment} 5PT</span>
                    </div>
                    <Slider
                      value={[referralInvestment]}
                      min={100}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setReferralInvestment(value[0])}
                    />
                  </div>
                </div>

                {/* Downline Referrals */}
                <div className="bg-black/20 p-2 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs text-gray-400">
                      Downline Referrals ({REWARD_RATES.downlineBonus}% daily)
                    </Label>
                    <span className="text-xs font-medium text-purple-400">{downlineCount}</span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[downlineCount]}
                      min={0}
                      max={50}
                      step={5}
                      onValueChange={(value) => setDownlineCount(value[0])}
                    />
                    <div className="flex justify-between text-xs">
                      <span>0</span>
                      <span className="text-purple-400">
                        {formatWithDecimals(downlineCount * downlineInvestment * (REWARD_RATES.downlineBonus / 100))}{" "}
                        5PT/day
                      </span>
                      <span>50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-gray-400">Avg. Investment</Label>
                      <span className="text-xs font-medium text-purple-400">{downlineInvestment} 5PT</span>
                    </div>
                    <Slider
                      value={[downlineInvestment]}
                      min={100}
                      max={2000}
                      step={100}
                      onValueChange={(value) => setDownlineInvestment(value[0])}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Tax Information</label>
                <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-500/50">
                  Fixed Rates
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Deposit Tax:</span>
                    <span className="text-xs font-medium text-purple-400">{TAX_RATES.deposit}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-black/30 rounded overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${TAX_RATES.deposit}%` }}></div>
                  </div>
                </div>
                <div className="bg-black/20 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Claim Tax:</span>
                    <span className="text-xs font-medium text-purple-400">{TAX_RATES.claim}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-black/30 rounded overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${TAX_RATES.claim}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Taxes are applied to deposits and claims. 50% of post-tax rewards are auto-reinvested when compounding
                is enabled.
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <p className="text-sm text-gray-400">Total Return</p>
                </div>
                <p className="text-2xl font-bold text-gradient">
                  {formatCrypto(calculationResults.finalValue, "5PT", 3)}
                </p>
                <div className="flex flex-col">
                  <p className="text-xs text-green-400">
                    +{formatCrypto(calculationResults.afterTaxEarnings, "5PT", 3)} profit
                  </p>
                  <p className="text-xs text-gray-400">
                    After {TAX_RATES.deposit}% deposit & {TAX_RATES.claim}% claim taxes
                  </p>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <p className="text-sm text-gray-400">ROI</p>
                </div>
                <p className="text-2xl font-bold text-gradient">{formatPercent(calculationResults.roi)}</p>
                <div className="flex flex-col">
                  <p className="text-xs text-green-400">
                    Effective APR: {formatPercent(calculationResults.effectiveApr)}
                  </p>
                  <p className="text-xs text-gray-400">Base APR: {formatPercent(calculationResults.apr)}</p>
                </div>
              </div>
            </div>

            {/* Daily Rewards Breakdown */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Daily Rewards Breakdown</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <p className="text-sm">Base Rewards ({REWARD_RATES.dailyBase}%)</p>
                  </div>
                  <p className="font-medium text-purple-400">
                    {formatWithDecimals(calculationResults.afterTaxInitial * (REWARD_RATES.dailyBase / 100))} 5PT/day
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm">Pool Rewards</p>
                  </div>
                  <p className="font-medium text-blue-400">
                    {formatWithDecimals(
                      selectedPool === "starter"
                        ? calculationResults.afterTaxInitial * (REWARD_RATES.poolBonuses.pools1to5 / 100)
                        : selectedPool === "growth"
                          ? calculationResults.afterTaxInitial * ((REWARD_RATES.poolBonuses.pools1to5 * 3) / 100)
                          : calculationResults.afterTaxInitial *
                            ((REWARD_RATES.poolBonuses.pools1to5 * 5 + REWARD_RATES.poolBonuses.pools6to7 * 2) / 100),
                    )}{" "}
                    5PT/day
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <p className="text-sm">Referral Rewards ({REWARD_RATES.directReferral}%)</p>
                  </div>
                  <p className="font-medium text-indigo-400">
                    {formatWithDecimals(referralCount * referralInvestment * (REWARD_RATES.directReferral / 100))}{" "}
                    5PT/day
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                    <p className="text-sm">Downline Rewards ({REWARD_RATES.downlineBonus}%)</p>
                  </div>
                  <p className="font-medium text-violet-400">
                    {formatWithDecimals(downlineCount * downlineInvestment * (REWARD_RATES.downlineBonus / 100))}{" "}
                    5PT/day
                  </p>
                </div>

                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total Daily (Pre-Tax)</p>
                    <p className="font-bold text-green-400">
                      {formatWithDecimals(
                        calculationResults.afterTaxInitial * (REWARD_RATES.dailyBase / 100) +
                          (selectedPool === "starter"
                            ? calculationResults.afterTaxInitial * (REWARD_RATES.poolBonuses.pools1to5 / 100)
                            : selectedPool === "growth"
                              ? calculationResults.afterTaxInitial * ((REWARD_RATES.poolBonuses.pools1to5 * 3) / 100)
                              : calculationResults.afterTaxInitial *
                                ((REWARD_RATES.poolBonuses.pools1to5 * 5 + REWARD_RATES.poolBonuses.pools6to7 * 2) /
                                  100)) +
                          referralCount * referralInvestment * (REWARD_RATES.directReferral / 100) +
                          downlineCount * downlineInvestment * (REWARD_RATES.downlineBonus / 100),
                      )}{" "}
                      5PT/day
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-medium">After {TAX_RATES.claim}% Tax</p>
                    <p className="font-bold text-green-400">
                      {formatWithDecimals(
                        (calculationResults.afterTaxInitial * (REWARD_RATES.dailyBase / 100) +
                          (selectedPool === "starter"
                            ? calculationResults.afterTaxInitial * (REWARD_RATES.poolBonuses.pools1to5 / 100)
                            : selectedPool === "growth"
                              ? calculationResults.afterTaxInitial * ((REWARD_RATES.poolBonuses.pools1to5 * 3) / 100)
                              : calculationResults.afterTaxInitial *
                                ((REWARD_RATES.poolBonuses.pools1to5 * 5 + REWARD_RATES.poolBonuses.pools6to7 * 2) /
                                  100)) +
                          referralCount * referralInvestment * (REWARD_RATES.directReferral / 100) +
                          downlineCount * downlineInvestment * (REWARD_RATES.downlineBonus / 100)) *
                          0.9,
                      )}{" "}
                      5PT/day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Total Earnings Breakdown</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <p className="text-sm">Pool Earnings</p>
                  </div>
                  <p className="font-medium text-purple-400">
                    {formatCrypto(calculationResults.totalPoolEarnings, "5PT", 3)}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <p className="text-sm">Referral Earnings</p>
                  </div>
                  <p className="font-medium text-indigo-400">
                    {formatCrypto(
                      calculationResults.totalReferralEarnings + calculationResults.totalDownlineEarnings,
                      "5PT",
                      3,
                    )}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <p className="text-sm">Total Tax Paid</p>
                  </div>
                  <p className="font-medium text-red-400">{formatCrypto(calculationResults.totalTaxPaid, "5PT", 3)}</p>
                </div>

                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total Profit (After Tax)</p>
                    <p className="font-bold text-green-400">
                      {formatCrypto(calculationResults.afterTaxEarnings, "5PT", 3)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Average */}
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <p className="text-sm text-gray-400">Daily Average Earnings</p>
              </div>
              <p className="text-xl font-bold text-gradient">
                {formatCrypto(calculationResults.dailyAverage, "5PT", 3)}
              </p>
              <p className="text-xs text-gray-400">Based on {timeframe} days investment period</p>
            </div>

            {/* Growth Chart (simplified) */}
            <div className="bg-black/30 rounded-lg p-4 h-40 relative">
              <h4 className="text-sm font-medium mb-2">Investment Growth</h4>

              {/* Simplified chart visualization */}
              <div className="absolute inset-x-4 bottom-4 top-10">
                <div className="h-full w-full relative">
                  {/* Chart line */}
                  <div className="absolute inset-0 overflow-hidden">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
                          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                        </linearGradient>
                      </defs>
                      <path
                        d={generateChartPath(calculationResults.dailyValues, timeframe)}
                        fill="url(#chartGradient)"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Start and end markers */}
                  <div className="absolute bottom-0 left-0 text-xs text-gray-400">Day 0</div>
                  <div className="absolute bottom-0 right-0 text-xs text-gray-400">Day {timeframe}</div>

                  {/* Start and end values */}
                  <div className="absolute top-0 left-0 text-xs text-purple-400">
                    {formatWithDecimals(calculationResults.afterTaxInitial)} 5PT
                  </div>
                  <div className="absolute top-0 right-0 text-xs text-purple-400">
                    {formatWithDecimals(calculationResults.finalValue)} 5PT
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <CyberButton variant="primary" className="w-full">
                Start Investing Now
              </CyberButton>
            </Link>
          </div>
        </div>
      </ContentCard>
    </TiltCard>
  )
}

// Helper function to generate SVG path for the chart
function generateChartPath(dailyValues: { day: number; value: number }[], timeframe: number): string {
  if (dailyValues.length === 0) return ""

  const maxValue = Math.max(...dailyValues.map((d) => d.value))
  const minValue = Math.min(...dailyValues.map((d) => d.value))
  const range = maxValue - minValue

  // Normalize values to fit in the chart (0-100%)
  const normalizedValues = dailyValues.map((d) => ({
    x: (d.day / timeframe) * 100,
    y: 100 - ((d.value - minValue) / (range || 1)) * 100,
  }))

  // Generate SVG path
  let path = `M${normalizedValues[0].x},${normalizedValues[0].y}`

  for (let i = 1; i < normalizedValues.length; i++) {
    path += ` L${normalizedValues[i].x},${normalizedValues[i].y}`
  }

  // Complete the path to create a filled area
  path += ` L100,100 L0,100 Z`

  return path
}

export default InvestmentCalculator
