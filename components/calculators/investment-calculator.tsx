"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Info, Settings, Flame, Percent } from "lucide-react"
import { ContentCard } from "@/components/ui/content-card"
import { useMounted } from "@/hooks/use-mounted"

/**
 * Investment calculator component for 5PT Finance
 * Allows users to simulate investment returns based on various parameters
 */
export function InvestmentCalculator() {
  // Use the mounting hook
  const mounted = useMounted()

  // State management
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [referrals, setReferrals] = useState(5)
  const [referralVolume, setReferralVolume] = useState(5000)
  const [simulationDays, setSimulationDays] = useState(30)
  const [showSettings, setShowSettings] = useState(false)
  const [depositTax, setDepositTax] = useState(10) // Fixed 10%
  const [claimTax, setClaimTax] = useState(10) // Fixed 10%
  const [reinvestPercentage, setReinvestPercentage] = useState(50) // Default 50%
  const [autoCompound, setAutoCompound] = useState(true)
  const [claimFrequency, setClaimFrequency] = useState(7) // Default claim every 7 days

  // Pool eligibility tracking
  const [eligiblePools, setEligiblePools] = useState([])

  // Memoize the pools array
  const pools = useMemo(
    () => [
      {
        id: 1,
        name: "Pool 1",
        personalInvestRequired: 550,
        totalDirectInvestRequired: 550,
        directRefsRequired: 1,
        share: 0.0175,
        usdValuePersonal: 962.5,
        usdValueDirect: 962.5,
      },
      {
        id: 2,
        name: "Pool 2",
        personalInvestRequired: 1450,
        totalDirectInvestRequired: 1450,
        directRefsRequired: 3,
        share: 0.0175,
        usdValuePersonal: 2537.5,
        usdValueDirect: 2537.5,
      },
      {
        id: 3,
        name: "Pool 3",
        personalInvestRequired: 3000,
        totalDirectInvestRequired: 6000,
        directRefsRequired: 5,
        share: 0.0175,
        usdValuePersonal: 5250,
        usdValueDirect: 10500,
      },
      {
        id: 4,
        name: "Pool 4",
        personalInvestRequired: 5500,
        totalDirectInvestRequired: 11000,
        directRefsRequired: 10,
        share: 0.0175,
        usdValuePersonal: 9625,
        usdValueDirect: 19250,
      },
      {
        id: 5,
        name: "Pool 5",
        personalInvestRequired: 14250,
        totalDirectInvestRequired: 28500,
        directRefsRequired: 15,
        share: 0.0175,
        usdValuePersonal: 24937.5,
        usdValueDirect: 49875,
      },
      {
        id: 6,
        name: "Pool 6",
        personalInvestRequired: 28500,
        totalDirectInvestRequired: 85500,
        directRefsRequired: 20,
        share: 0.01,
        usdValuePersonal: 49875,
        usdValueDirect: 149625,
      },
      {
        id: 7,
        name: "Pool 7",
        personalInvestRequired: 57000,
        totalDirectInvestRequired: 171000,
        directRefsRequired: 20,
        share: 0.01,
        usdValuePersonal: 99750,
        usdValueDirect: 299250,
      },
      {
        id: 8,
        name: "Pool 8",
        personalInvestRequired: 100000, // Whitelist only, using high value as placeholder
        totalDirectInvestRequired: 0,
        directRefsRequired: 0,
        share: 0.02,
        whitelistOnly: true,
        usdValuePersonal: 175000,
        usdValueDirect: 0,
      },
      {
        id: 9,
        name: "Pool 9",
        personalInvestRequired: 200000, // Whitelist only, using high value as placeholder
        totalDirectInvestRequired: 0,
        directRefsRequired: 0,
        share: 0.02,
        whitelistOnly: true,
        usdValuePersonal: 350000,
        usdValueDirect: 0,
      },
    ],
    [],
  )

  // Update eligible pools when investment amount, referrals, or referral volume changes
  useEffect(() => {
    const newEligiblePools = []

    // Check eligibility for each pool
    pools.forEach((pool) => {
      if (
        investmentAmount >= pool.personalInvestRequired &&
        referrals >= pool.directRefsRequired &&
        referralVolume >= pool.totalDirectInvestRequired
      ) {
        newEligiblePools.push(pool.id)
      }
    })

    setEligiblePools(newEligiblePools)
  }, [investmentAmount, referrals, referralVolume, pools])

  // Memoize the calculateReturns function
  const calculateReturns = useCallback(() => {
    // Apply deposit tax to get actual invested amount
    const depositTaxAmount = (investmentAmount * depositTax) / 100
    const actualInvestedAmount = investmentAmount - depositTaxAmount

    // Initialize variables for simulation
    let currentInvestment = actualInvestedAmount
    let totalEarnings = 0
    let totalReinvested = 0
    let totalClaimed = 0
    const dailyResults = []

    // Daily simulation
    for (let day = 1; day <= simulationDays; day++) {
      // Calculate daily base reward (0.3% of current investment) - Updated from 0.35%
      const dailyBaseReward = currentInvestment * 0.003

      // Calculate pool rewards (if eligible for any pools)
      let poolRewards = 0

      // Assume total burned tokens (all deposits) is 10x the user's investment for simulation
      // This is a simplification for the calculator
      const assumedTotalBurned = actualInvestedAmount * 10

      // Daily pool distribution calculation based on latest contract
      const dailyPoolDistribution = assumedTotalBurned * 0.00215

      // Calculate rewards from each eligible pool
      eligiblePools.forEach((poolId) => {
        const pool = pools.find((p) => p.id === poolId)
        if (pool && !pool.whitelistOnly) {
          // Assume 10 participants per pool for simulation
          const assumedParticipants = 10
          // User's share of the pool reward
          poolRewards += (dailyPoolDistribution * pool.share) / assumedParticipants
        }
      })

      // Calculate referral rewards (0.025% of referral volume) - Updated from 0.05%
      const referralReward = referralVolume * 0.00025 * referrals

      // Calculate downline rewards (0.06% of referral volume) - Updated from 0.0135%
      // Simplified calculation assuming each referral has 2 downline referrals
      const downlineReward = referrals > 0 ? referralVolume * 0.0006 * referrals * 2 : 0

      // Total daily rewards
      const dailyTotalReward = dailyBaseReward + poolRewards + referralReward + downlineReward

      // Handle claiming and reinvesting based on settings
      if (autoCompound) {
        // Auto-compound all rewards
        currentInvestment += dailyTotalReward
        totalReinvested += dailyTotalReward
      } else {
        // Manual claiming based on frequency
        if (day % claimFrequency === 0) {
          // Apply claim tax
          const claimTaxAmount = (dailyTotalReward * claimTax) / 100
          const afterTaxReward = dailyTotalReward - claimTaxAmount

          // Split between reinvest and claim based on reinvestPercentage
          const amountToReinvest = (afterTaxReward * reinvestPercentage) / 100
          const amountToClaim = afterTaxReward - amountToReinvest

          // Update totals
          currentInvestment += amountToReinvest
          totalReinvested += amountToReinvest
          totalClaimed += amountToClaim
        } else {
          // On non-claim days, rewards accumulate (simulated as reinvestment)
          currentInvestment += dailyTotalReward
          totalReinvested += dailyTotalReward
        }
      }

      // Track daily results
      dailyResults.push({
        day,
        investment: currentInvestment,
        dailyReward: dailyTotalReward,
        baseReward: dailyBaseReward,
        poolRewards: poolRewards,
        referralReward: referralReward,
        downlineReward: downlineReward,
      })

      // Update total earnings
      totalEarnings += dailyTotalReward
    }

    return {
      initialInvestment: investmentAmount,
      afterTaxInvestment: actualInvestedAmount,
      currentInvestment: currentInvestment,
      totalEarnings: totalEarnings,
      totalReinvested: totalReinvested,
      totalClaimed: totalClaimed,
      dailyResults: dailyResults,
      depositTaxPaid: depositTaxAmount,
      roi: (totalEarnings / actualInvestedAmount) * 100,
      eligiblePools: eligiblePools,
    }
  }, [
    investmentAmount,
    depositTax,
    simulationDays,
    eligiblePools,
    pools,
    referralVolume,
    referrals,
    autoCompound,
    claimFrequency,
    claimTax,
    reinvestPercentage,
  ])

  // IMPORTANT: Calculate results BEFORE any conditional returns
  // This ensures hooks are always called in the same order
  const results = useMemo(() => calculateReturns(), [calculateReturns])
  const lastDayResult = useMemo(() => results.dailyResults[results.dailyResults.length - 1], [results])

  // Format number with 3 decimal places
  const formatWithDecimals = useCallback((value) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  }, [])

  // Only return the rendered UI if mounted
  if (!mounted) return null

  return (
    <>
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <ContentCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Investment Parameters</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Settings className="h-4 w-4" />
                {showSettings ? "Hide Settings" : "Advanced Settings"}
              </button>
            </div>

            {/* Advanced Settings Panel */}
            {showSettings && (
              <div className="mb-8 bg-black/40 rounded-lg p-4 border border-blue-500/10">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Tax & Reinvestment Settings</h4>

                {/* Deposit Tax */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-gray-300 text-sm">Deposit Tax (%)</label>
                    <span className="text-blue-400 font-bold">{depositTax}%</span>
                  </div>
                  <Slider
                    value={[depositTax]}
                    min={10}
                    max={10}
                    step={1}
                    onValueChange={(value) => setDepositTax(value[0])}
                    className="mb-1"
                    disabled={true}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fixed at 10%</span>
                    <span className="text-xs bg-purple-900/50 px-2 py-0.5 rounded text-purple-200 border border-purple-500/30">
                      Fixed Rate
                    </span>
                  </div>
                </div>

                {/* Claim Tax */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-gray-300 text-sm">Claim Tax (%)</label>
                    <span className="text-blue-400 font-bold">{claimTax}%</span>
                  </div>
                  <Slider
                    value={[claimTax]}
                    min={10}
                    max={10}
                    step={1}
                    onValueChange={(value) => setClaimTax(value[0])}
                    className="mb-1"
                    disabled={true}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fixed at 10%</span>
                    <span className="text-xs bg-purple-900/50 px-2 py-0.5 rounded text-purple-200 border border-purple-500/30">
                      Fixed Rate
                    </span>
                  </div>
                </div>

                {/* Auto-Compound Toggle */}
                <div className="flex items-center justify-between mb-4 p-2 rounded bg-black/20">
                  <div>
                    <label className="text-gray-300 text-sm">Auto-Compound</label>
                    <p className="text-xs text-gray-500">Automatically reinvest all rewards</p>
                  </div>
                  <Switch checked={autoCompound} onCheckedChange={setAutoCompound} />
                </div>

                {/* Manual Reinvestment Settings (only shown if auto-compound is off) */}
                {!autoCompound && (
                  <>
                    {/* Reinvest Percentage */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300 text-sm">Reinvest Percentage (%)</label>
                        <span className="text-blue-400 font-bold">{reinvestPercentage}%</span>
                      </div>
                      <Slider
                        value={[reinvestPercentage]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => setReinvestPercentage(value[0])}
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0% (All Claimed)</span>
                        <span>100% (All Reinvested)</span>
                      </div>
                    </div>

                    {/* Claim Frequency */}
                    <div className="mb-2">
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300 text-sm">Claim Frequency (Days)</label>
                        <span className="text-blue-400 font-bold">Every {claimFrequency} days</span>
                      </div>
                      <Slider
                        value={[claimFrequency]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) => setClaimFrequency(value[0])}
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Daily</span>
                        <span>Monthly</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Investment Amount */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">Investment Amount (5PT)</label>
                <span className="text-blue-400 font-bold">{formatWithDecimals(investmentAmount)} 5PT</span>
              </div>
              <Slider
                value={[investmentAmount]}
                min={100}
                max={100000}
                step={100}
                onValueChange={(value) => setInvestmentAmount(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>100 5PT</span>
                <span>100,000 5PT</span>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Flame className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400">
                  Your tokens are permanently burned when invested, reducing the total supply
                </p>
              </div>
            </div>

            {/* Referrals */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">Number of Direct Referrals</label>
                <span className="text-blue-400 font-bold">{referrals}</span>
              </div>
              <Slider
                value={[referrals]}
                min={0}
                max={30}
                step={1}
                onValueChange={(value) => setReferrals(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>30</span>
              </div>
            </div>

            {/* Referral Volume */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">Total Referral Volume (5PT)</label>
                <span className="text-blue-400 font-bold">{formatWithDecimals(referralVolume)} 5PT</span>
              </div>
              <Slider
                value={[referralVolume]}
                min={0}
                max={200000}
                step={1000}
                onValueChange={(value) => setReferralVolume(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 5PT</span>
                <span>200,000 5PT</span>
              </div>
            </div>

            {/* Simulation Period */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300">Simulation Period (Days)</label>
                <span className="text-blue-400 font-bold">{simulationDays} days</span>
              </div>
              <Slider
                value={[simulationDays]}
                min={1}
                max={365}
                step={1}
                onValueChange={(value) => setSimulationDays(value[0])}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 day</span>
                <span>365 days</span>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400">This is for simulation only. Your actual investment runs indefinitely.</p>
              </div>
            </div>
          </ContentCard>

          {/* Calculator Results */}
          <ContentCard>
            <h3 className="text-2xl font-bold text-white mb-6">Projected Returns</h3>

            {/* Pool Eligibility */}
            <div className="mb-6 bg-black/40 rounded-lg p-4 border border-purple-500/10">
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Pool Eligibility</h4>
              <div className="grid grid-cols-3 gap-2">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className={`p-2 rounded-lg text-center text-sm ${
                      eligiblePools.includes(pool.id)
                        ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50"
                        : "bg-gray-800/30 text-gray-500"
                    } ${pool.whitelistOnly ? "opacity-50" : ""}`}
                  >
                    <div className="font-bold">{pool.name}</div>
                    {pool.whitelistOnly ? (
                      <div className="text-xs">Whitelist Only</div>
                    ) : (
                      <div className="text-xs">{eligiblePools.includes(pool.id) ? "Eligible" : "Not Eligible"}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-400">
                {eligiblePools.length > 0 ? (
                  <p>
                    You qualify for {eligiblePools.length} pool{eligiblePools.length !== 1 ? "s" : ""}, earning rewards
                    from each.
                  </p>
                ) : (
                  <p>Increase your investment or referrals to qualify for pools.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Daily Rewards */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-300">Daily Rewards (Day {simulationDays})</h4>
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{lastDayResult?.dailyReward.toFixed(3)} 5PT</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">
                    <span className="text-blue-400">•</span> Base (0.3%): {lastDayResult?.baseReward.toFixed(3)} 5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-purple-400">•</span> Pools: {lastDayResult?.poolRewards.toFixed(3)} 5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-green-400">•</span> Referrals: {lastDayResult?.referralReward.toFixed(3)} 5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-indigo-400">•</span> Downline: {lastDayResult?.downlineReward.toFixed(3)} 5PT
                  </div>
                </div>
              </div>

              {/* Investment Growth */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-300">Investment Growth</h4>
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{formatWithDecimals(results.currentInvestment)} 5PT</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">
                    <span className="text-blue-400">•</span> Initial: {formatWithDecimals(results.afterTaxInvestment)}{" "}
                    5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-green-400">•</span> Growth:{" "}
                    {formatWithDecimals(results.currentInvestment - results.afterTaxInvestment)} 5PT
                  </div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-gray-300">Earnings Breakdown ({simulationDays} days)</h4>
                  <Percent className="h-4 w-4 text-green-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Earnings:</span>
                    <span className="text-green-400 font-bold">{formatWithDecimals(results.totalEarnings)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Reinvested:</span>
                    <span className="text-blue-400">{formatWithDecimals(results.totalReinvested)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Claimed:</span>
                    <span className="text-purple-400">{formatWithDecimals(results.totalClaimed)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Deposit Tax Paid:</span>
                    <span className="text-red-400">{formatWithDecimals(results.depositTaxPaid)} 5PT</span>
                  </div>

                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-semibold">ROI:</span>
                      <span className="text-green-400 font-bold">{results.roi.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-gray-500 italic mt-4">
                Note: Projected returns are estimates and not guaranteed. Actual results may vary based on network
                growth, total deposits, and pool participation. Your investment is permanently burned, reducing token
                supply.
              </div>
            </div>
          </ContentCard>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ willChange: "transform, opacity" }}
      >
        <Link href="/dashboard">
          <CyberButton variant="primary" size="lg" className="animate-pulse">
            Start Your Investment Journey
          </CyberButton>
        </Link>
        <p className="text-gray-400 mt-4">Join now and be among the first investors</p>
      </motion.div>
    </>
  )
}

export default InvestmentCalculator
