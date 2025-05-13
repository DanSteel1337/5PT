"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CyberButton } from "@/components/ui/cyber-button"
import { TiltCard } from "@/components/parallax/tilt-card"
import { Calculator, TrendingUp, BarChart3, Calendar } from "lucide-react"
import { formatCrypto, formatNumber, formatPercent } from "@/lib/utils"
import Link from "next/link"
import { ContentCard } from "@/components/ui/content-card"

// Pool data from the smart contract
const INVESTMENT_POOLS = [
  {
    id: "starter",
    name: "Starter Pool",
    dailyRate: 5,
    minDeposit: 100,
    lockPeriod: 7,
    rankRequired: 0,
    description: "Perfect for beginners. Low risk with steady returns.",
  },
  {
    id: "growth",
    name: "Growth Pool",
    dailyRate: 8,
    minDeposit: 500,
    lockPeriod: 14,
    rankRequired: 2,
    description: "Balanced risk-reward ratio for experienced investors.",
  },
  {
    id: "premium",
    name: "Premium Pool",
    dailyRate: 15,
    minDeposit: 1000,
    lockPeriod: 30,
    rankRequired: 5,
    description: "Highest returns for committed investors. VIP benefits included.",
  },
  {
    id: "exclusive",
    name: "Whitelist Pool",
    dailyRate: 0.02,
    minDeposit: 5000,
    lockPeriod: 90,
    rankRequired: 8,
    description: "Exclusive pool for whitelisted addresses with special benefits.",
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

// Referral tiers based on rank
const REFERRAL_RATES = [
  { rank: 0, rate: 5 }, // Novice: 5%
  { rank: 3, rate: 8 }, // Expert: 8%
  { rank: 5, rate: 10 }, // Master: 10%
  { rank: 8, rate: 15 }, // Divine: 15%
]

export function InvestmentCalculator() {
  // State for calculator inputs
  const [selectedPool, setSelectedPool] = useState(INVESTMENT_POOLS[1].id) // Default to Growth Pool
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [timeframe, setTimeframe] = useState(30)
  const [isCompounding, setIsCompounding] = useState(true)
  const [referralCount, setReferralCount] = useState(0)
  const [referralInvestment, setReferralInvestment] = useState(500)
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
    const dailyRate = pool.dailyRate / 100
    const days = timeframe
    let totalValue = investmentAmount
    const dailyValues = [{ day: 0, value: investmentAmount }]

    // Calculate compounding or simple interest
    if (isCompounding) {
      // Compound interest calculation (reinvest daily)
      for (let day = 1; day <= days; day++) {
        totalValue = totalValue * (1 + dailyRate)
        dailyValues.push({ day, value: totalValue })
      }
    } else {
      // Simple interest calculation (withdraw daily)
      const dailyEarning = investmentAmount * dailyRate
      const totalEarnings = dailyEarning * days
      totalValue = investmentAmount + totalEarnings

      // Generate daily values for chart
      for (let day = 1; day <= days; day++) {
        dailyValues.push({
          day,
          value: investmentAmount + dailyEarning * day,
        })
      }
    }

    // Calculate referral earnings (if any)
    let referralEarnings = 0
    if (referralCount > 0) {
      // Find appropriate referral rate based on estimated rank
      const estimatedRank = Math.min(8, Math.floor(investmentAmount / 1000))
      const referralRate = REFERRAL_RATES.reduce((prev, curr) => (estimatedRank >= curr.rank ? curr : prev)).rate / 100

      // Calculate total referral earnings
      referralEarnings = referralCount * referralInvestment * referralRate
    }

    // Calculate final results
    const initialInvestment = investmentAmount
    const poolEarnings = totalValue + referralEarnings - initialInvestment
    const totalEarnings = poolEarnings + referralEarnings
    const roi = (totalEarnings / initialInvestment) * 100
    const dailyAverage = totalEarnings / days

    return {
      initialInvestment,
      finalValue: totalValue + referralEarnings,
      poolEarnings,
      referralEarnings,
      totalEarnings,
      roi,
      dailyAverage,
      dailyValues,
      apr: pool.dailyRate * 365, // Annual percentage rate
    }
  }, [investmentAmount, pool.dailyRate, timeframe, isCompounding, referralCount, referralInvestment])

  if (!mounted) return null

  return (
    <TiltCard intensity={5} className="w-full">
      <ContentCard className="p-6">
        {" "}
        {/* Use consistent ContentCard with custom padding */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="card-title flex items-center">
            {" "}
            {/* Use consistent card-title class */}
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
                <span className="text-purple-400">Daily Rate: {pool.dailyRate}%</span>
                <span className="text-purple-400">Min Deposit: {pool.minDeposit} 5PT</span>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Investment Amount (5PT)</label>
                <span className="text-sm font-medium">{investmentAmount} 5PT</span>
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
                <p className="text-xs text-gray-400">Reinvest earnings daily for exponential growth</p>
              </div>
              <Switch
                checked={isCompounding}
                onCheckedChange={setIsCompounding}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {/* Referral Settings */}
            <div className="space-y-3 bg-black/30 p-3 rounded-lg">
              <label className="text-sm font-medium">Referral Earnings</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Number of Referrals</Label>
                  <Slider
                    value={[referralCount]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => setReferralCount(value[0])}
                  />
                  <div className="flex justify-between text-xs">
                    <span>0</span>
                    <span className="text-purple-400">{referralCount}</span>
                    <span>20</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Avg. Referral Investment</Label>
                  <Slider
                    value={[referralInvestment]}
                    min={100}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setReferralInvestment(value[0])}
                  />
                  <div className="flex justify-between text-xs">
                    <span>100</span>
                    <span className="text-purple-400">{referralInvestment}</span>
                    <span>5000</span>
                  </div>
                </div>
              </div>
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
                <p className="text-2xl font-bold text-gradient">{formatCrypto(calculationResults.finalValue, "5PT")}</p>
                <p className="text-xs text-green-400">
                  +{formatCrypto(calculationResults.totalEarnings, "5PT")} profit
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <p className="text-sm text-gray-400">ROI</p>
                </div>
                <p className="text-2xl font-bold text-gradient">{formatPercent(calculationResults.roi)}</p>
                <p className="text-xs text-green-400">APR: {formatPercent(calculationResults.apr)}</p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Earnings Breakdown</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <p className="text-sm">Pool Earnings</p>
                  </div>
                  <p className="font-medium text-purple-400">{formatCrypto(calculationResults.poolEarnings, "5PT")}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <p className="text-sm">Referral Earnings</p>
                  </div>
                  <p className="font-medium text-indigo-400">
                    {formatCrypto(calculationResults.referralEarnings, "5PT")}
                  </p>
                </div>

                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total Profit</p>
                    <p className="font-bold text-green-400">{formatCrypto(calculationResults.totalEarnings, "5PT")}</p>
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
              <p className="text-xl font-bold text-gradient">{formatCrypto(calculationResults.dailyAverage, "5PT")}</p>
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
                    {formatNumber(calculationResults.initialInvestment)}
                  </div>
                  <div className="absolute top-0 right-0 text-xs text-purple-400">
                    {formatNumber(calculationResults.finalValue)}
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
