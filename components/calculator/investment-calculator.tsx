"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientBorder } from "@/components/ui/gradient-border"
import { TrendingUp, Info, Calculator, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 5PT token price in USD
const TOKEN_PRICE = 0.2

// Pool tiers with their respective requirements
const POOL_TIERS = [
  {
    id: 1,
    name: "Pool 1",
    personalInvestment: 550, // in 5PT
    directRefsRequired: 1,
    directRefsDeposit: 550, // in 5PT
    share: 3.5,
  },
  {
    id: 2,
    name: "Pool 2",
    personalInvestment: 1450, // in 5PT
    directRefsRequired: 3,
    directRefsDeposit: 1450, // in 5PT
    share: 3.5,
  },
  {
    id: 3,
    name: "Pool 3",
    personalInvestment: 3000, // in 5PT
    directRefsRequired: 5,
    directRefsDeposit: 6000, // in 5PT
    share: 3.5,
  },
  {
    id: 4,
    name: "Pool 4",
    personalInvestment: 5500, // in 5PT
    directRefsRequired: 10,
    directRefsDeposit: 11000, // in 5PT
    share: 3.5,
  },
  {
    id: 5,
    name: "Pool 5",
    personalInvestment: 14250, // in 5PT
    directRefsRequired: 15,
    directRefsDeposit: 28500, // in 5PT
    share: 3.5,
  },
  {
    id: 6,
    name: "Pool 6",
    personalInvestment: 28500, // in 5PT
    directRefsRequired: 20,
    directRefsDeposit: 85500, // in 5PT
    share: 2.0,
  },
  {
    id: 7,
    name: "Pool 7",
    personalInvestment: 57000, // in 5PT
    directRefsRequired: 20,
    directRefsDeposit: 171000, // in 5PT
    share: 2.0,
  },
]

// Estimated platform volume for pool rewards calculation (in 5PT)
const ESTIMATED_PLATFORM_VOLUME = 1000000 // 1 million 5PT

export function InvestmentCalculator() {
  // Investment parameters
  const [investmentValue, setInvestmentValue] = useState(550) // in 5PT
  const [selectedPoolId, setSelectedPoolId] = useState(1)
  const [timeframe, setTimeframe] = useState(30) // days
  const [depositTax, setDepositTax] = useState(10) // percentage
  const [claimTax, setClaimTax] = useState(10) // percentage
  const [directReferrals, setDirectReferrals] = useState(1) // count
  const [directRefsDeposit, setDirectRefsDeposit] = useState(550) // in 5PT
  const [downlineSize, setDownlineSize] = useState(0) // count
  const [downlineDeposit, setDownlineDeposit] = useState(0) // in 5PT
  const [reinvestmentCycles, setReinvestmentCycles] = useState(1) // number of cycles
  const [showRewards, setShowRewards] = useState(false)
  const [activeTab, setActiveTab] = useState("parameters")

  // Get the selected pool
  const selectedPool = POOL_TIERS.find((pool) => pool.id === selectedPoolId) || POOL_TIERS[0]

  // Calculate rewards based on smart contract logic
  const calculateRewards = () => {
    // Initial investment in 5PT
    const initialInvestment = investmentValue
    const initialInvestmentUSD = initialInvestment * TOKEN_PRICE

    // Apply deposit tax
    const depositTaxAmount = initialInvestment * (depositTax / 100)
    const depositAfterTax = initialInvestment - depositTaxAmount

    // Daily base reward (0.35% of deposit)
    const dailyBaseReward = depositAfterTax * 0.0035

    // Estimate pool rewards based on platform volume and pool share
    const dailyPlatformRewards = ESTIMATED_PLATFORM_VOLUME * 0.0035 // 0.35% of platform volume
    const poolShareReward = (dailyPlatformRewards * (selectedPool.share / 100)) / 100 // Assuming 100 participants in the pool

    // Referral rewards
    const directRefReward = (directRefsDeposit * 0.05) / 30 // 5% of direct referrals' deposits, averaged per day

    // Downline rewards (only if in Pool 3 or higher)
    const downlineReward = selectedPool.id >= 3 ? (downlineDeposit * 0.0135) / 30 : 0 // 1.35% of downline deposits

    // Total daily rewards before tax
    const grossDailyReward = dailyBaseReward + poolShareReward + directRefReward + downlineReward

    // Apply claim tax
    const claimTaxAmount = grossDailyReward * (claimTax / 100)
    const netDailyReward = grossDailyReward - claimTaxAmount

    // Split rewards (50% to wallet, 50% reinvested)
    const toWallet = netDailyReward * 0.5
    const toReinvest = netDailyReward * 0.5

    // Calculate compounding over time with reinvestment cycles
    const daysPerCycle = timeframe / reinvestmentCycles

    let currentDeposit = depositAfterTax
    let totalClaimed = 0
    let totalReinvested = 0

    for (let cycle = 0; cycle < reinvestmentCycles; cycle++) {
      // Calculate rewards for this cycle
      const cycleBaseReward = currentDeposit * 0.0035 * daysPerCycle
      const cyclePoolReward = poolShareReward * daysPerCycle
      const cycleDirectRefReward = directRefReward * daysPerCycle
      const cycleDownlineReward = downlineReward * daysPerCycle

      const cycleGrossReward = cycleBaseReward + cyclePoolReward + cycleDirectRefReward + cycleDownlineReward
      const cycleClaimTax = cycleGrossReward * (claimTax / 100)
      const cycleNetReward = cycleGrossReward - cycleClaimTax

      const cycleToClaim = cycleNetReward * 0.5
      const cycleToReinvest = cycleNetReward * 0.5

      // Update totals
      totalClaimed += cycleToClaim
      totalReinvested += cycleToReinvest
      currentDeposit += cycleToReinvest
    }

    // Final values
    const finalDepositValue = currentDeposit
    const totalRewards = totalClaimed + totalReinvested
    const roi = (totalRewards / depositAfterTax) * 100

    // Calculate effective APR with reinvestment
    const daysInYear = 365
    const effectiveAPR = (Math.pow((finalDepositValue + totalClaimed) / depositAfterTax, 365 / timeframe) - 1) * 100

    // Tax distributions
    const depositTaxToTreasury1 = depositTaxAmount * 0.7
    const depositTaxToTreasury2 = depositTaxAmount * 0.3
    const claimTaxToTreasury1 = claimTaxAmount * daysPerCycle * reinvestmentCycles * 0.7
    const claimTaxToTreasury2 = claimTaxAmount * daysPerCycle * reinvestmentCycles * 0.3

    return {
      // Initial values
      initialInvestment,
      initialInvestmentUSD,
      depositTaxAmount,
      depositAfterTax,

      // Daily rewards
      dailyBaseReward,
      poolShareReward,
      directRefReward,
      downlineReward,
      grossDailyReward,

      // Tax and distribution
      claimTaxAmount,
      netDailyReward,
      toWallet,
      toReinvest,

      // Tax distribution
      depositTaxToTreasury1,
      depositTaxToTreasury2,
      claimTaxToTreasury1,
      claimTaxToTreasury2,

      // Final results
      totalClaimed,
      totalReinvested,
      finalDepositValue,
      totalRewards,
      roi,
      effectiveAPR,

      // Time values
      timeframe,
      reinvestmentCycles,
      daysPerCycle,
    }
  }

  const results = calculateRewards()

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-gradient-text">5PT Investment Calculator</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Explore the potential of our smart contract reward system with this interactive calculator.
          <span className="block mt-2 text-sm text-gold/70">
            Note: This is a projection based on our smart contract reward structure. Actual returns may vary based on
            platform activity.
          </span>
        </p>
      </div>

      <GradientBorder className="w-full" gradientFrom="from-gold-light" gradientTo="to-gold-dark">
        <div className="bg-black/80 p-6 md:p-8 rounded-xl">
          <Tabs defaultValue="parameters" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="parameters" className="text-lg">
                <Calculator className="w-4 h-4 mr-2" />
                Investment Parameters
              </TabsTrigger>
              <TabsTrigger value="results" className="text-lg" disabled={!showRewards}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Projection Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Pool Selection */}
                  <div>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Investment Pool</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Different pools have different requirements and reward shares.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select
                      value={selectedPoolId.toString()}
                      onValueChange={(value) => {
                        const poolId = Number(value)
                        setSelectedPoolId(poolId)
                        const pool = POOL_TIERS.find((p) => p.id === poolId)
                        if (pool) {
                          setInvestmentValue(pool.personalInvestment)
                          setDirectReferrals(pool.directRefsRequired)
                          setDirectRefsDeposit(pool.directRefsDeposit)
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select a pool" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {POOL_TIERS.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id.toString()}>
                            Pool {pool.id} - {pool.personalInvestment} 5PT ($
                            {(pool.personalInvestment * TOKEN_PRICE).toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 text-xs text-gray-400 space-y-1">
                      <div>
                        Min Personal: {selectedPool.personalInvestment} 5PT ($
                        {(selectedPool.personalInvestment * TOKEN_PRICE).toFixed(2)})
                      </div>
                      <div>Direct Refs: {selectedPool.directRefsRequired}</div>
                      <div>
                        Direct Refs Deposit: {selectedPool.directRefsDeposit} 5PT ($
                        {(selectedPool.directRefsDeposit * TOKEN_PRICE).toFixed(2)})
                      </div>
                      <div>Pool Share: {selectedPool.share}%</div>
                    </div>
                  </div>

                  {/* Investment Amount */}
                  <div>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Investment Amount (5PT)</span>
                      <div>
                        <span className="text-gold font-bold">{investmentValue} 5PT</span>
                        <span className="text-gray-400 ml-1">(${(investmentValue * TOKEN_PRICE).toFixed(2)})</span>
                      </div>
                    </label>
                    <input
                      type="range"
                      min={selectedPool.personalInvestment}
                      max={selectedPool.personalInvestment * 10}
                      step={selectedPool.personalInvestment < 1000 ? 100 : 1000}
                      value={investmentValue}
                      onChange={(e) => setInvestmentValue(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>{selectedPool.personalInvestment} 5PT</span>
                      <span>{selectedPool.personalInvestment * 10} 5PT</span>
                    </div>
                  </div>

                  {/* Time Period */}
                  <div>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Time Period (Days)</span>
                    </label>
                    <div className="flex gap-2">
                      {[30, 90, 180, 365].map((days) => (
                        <button
                          key={days}
                          onClick={() => setTimeframe(days)}
                          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                            timeframe === days
                              ? "bg-gold text-black font-bold"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reinvestment Cycles */}
                  <div>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Reinvestment Cycles</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Number of times rewards are claimed and reinvested during the selected time period.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={Math.min(12, timeframe)}
                        step={1}
                        value={reinvestmentCycles}
                        onChange={(e) => setReinvestmentCycles(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-gold font-bold min-w-[80px] text-center">
                        {reinvestmentCycles} {reinvestmentCycles === 1 ? "cycle" : "cycles"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">{results.daysPerCycle.toFixed(0)} days per cycle</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Tax Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center justify-between text-gray-300 mb-2">
                        <span className="text-lg font-medium">Deposit Tax</span>
                        <span className="text-gold font-bold">{depositTax}%</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={depositTax}
                        onChange={(e) => setDepositTax(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-gray-300 mb-2">
                        <span className="text-lg font-medium">Claim Tax</span>
                        <span className="text-gold font-bold">{claimTax}%</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={claimTax}
                        onChange={(e) => setClaimTax(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Direct Referrals */}
                  <div>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Direct Referrals</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Number of direct referrals and their total deposits.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Count</span>
                          <span className="text-gold font-bold">{directReferrals}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={20}
                          step={1}
                          value={directReferrals}
                          onChange={(e) => setDirectReferrals(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Total Deposits (5PT)</span>
                          <span className="text-gold font-bold">{directRefsDeposit}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={selectedPool.directRefsDeposit * 5}
                          step={selectedPool.directRefsDeposit < 1000 ? 100 : 1000}
                          value={directRefsDeposit}
                          onChange={(e) => setDirectRefsDeposit(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Downline Network (only if Pool 3+) */}
                  <div className={selectedPool.id >= 3 ? "" : "opacity-50 pointer-events-none"}>
                    <label className="flex items-center justify-between text-gray-300 mb-2">
                      <span className="text-lg font-medium">Downline Network</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              {selectedPool.id >= 3
                                ? "Your extended network beyond direct referrals (only available for Pool 3+)."
                                : "Downline rewards are only available for Pool 3 and higher."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Size</span>
                          <span className="text-gold font-bold">{downlineSize}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={downlineSize}
                          onChange={(e) => setDownlineSize(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          disabled={selectedPool.id < 3}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Total Deposits (5PT)</span>
                          <span className="text-gold font-bold">{downlineDeposit}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={500000}
                          step={1000}
                          value={downlineDeposit}
                          onChange={(e) => setDownlineDeposit(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          disabled={selectedPool.id < 3}
                        />
                      </div>
                    </div>
                    {selectedPool.id < 3 && (
                      <div className="mt-1 text-xs text-amber-500">
                        Downline rewards are only available for Pool 3 and higher.
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setShowRewards(true)
                      setActiveTab("results")
                    }}
                    className="w-full bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold py-3 mt-4"
                  >
                    Calculate Rewards
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <motion.div
                className="bg-black/50 rounded-xl p-6 border border-gold/30"
                animate={
                  showRewards
                    ? {
                        scale: [1, 1.02, 1],
                        borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,0.8)", "rgba(212,175,55,0.3)"],
                      }
                    : {}
                }
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Initial Investment & Daily Rewards */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">Initial Investment</h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Investment Amount:</span>
                          <div>
                            <span className="text-white font-medium">
                              {results.initialInvestment.toLocaleString()} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              (${results.initialInvestmentUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deposit Tax ({depositTax}%):</span>
                          <div>
                            <span className="text-red-400">
                              -{results.depositTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.depositTaxAmount * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800">
                          <span className="text-gray-400">After-Tax Investment:</span>
                          <div>
                            <span className="text-gold font-bold">
                              {results.depositAfterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.depositAfterTax * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">Daily Rewards Breakdown</h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base Rewards (0.35%):</span>
                          <div>
                            <span className="text-green-400">
                              {results.dailyBaseReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.dailyBaseReward * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pool Rewards ({selectedPool.share}%):</span>
                          <div>
                            <span className="text-green-400">
                              {results.poolShareReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.poolShareReward * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Direct Referral Rewards:</span>
                          <div>
                            <span className="text-green-400">
                              {results.directRefReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.directRefReward * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        {selectedPool.id >= 3 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Downline Rewards:</span>
                            <div>
                              <span className="text-green-400">
                                {results.downlineReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                              </span>
                              <span className="text-gray-400 ml-1">
                                ($
                                {(results.downlineReward * TOKEN_PRICE).toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                                )
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-800">
                          <span className="text-gray-400">Total Daily Rewards:</span>
                          <div>
                            <span className="text-gold font-bold">
                              {results.grossDailyReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.grossDailyReward * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">Tax & Distribution</h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Claim Tax ({claimTax}%):</span>
                          <div>
                            <span className="text-red-400">
                              -{results.claimTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.claimTaxAmount * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800">
                          <span className="text-gray-400">Net Daily Rewards:</span>
                          <div>
                            <span className="text-gold font-bold">
                              {results.netDailyReward.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.netDailyReward * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">To Wallet (50%):</span>
                          <div>
                            <span className="text-green-400">
                              {results.toWallet.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.toWallet * TOKEN_PRICE).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Auto-Reinvested (50%):</span>
                          <div>
                            <span className="text-blue-400">
                              {results.toReinvest.toLocaleString(undefined, { maximumFractionDigits: 4 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.toReinvest * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Projection Results */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">
                        {timeframe}-Day Projection with {reinvestmentCycles}{" "}
                        {reinvestmentCycles === 1 ? "Cycle" : "Cycles"}
                      </h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Initial Deposit (After Tax):</span>
                          <div>
                            <span className="text-white">
                              {results.depositAfterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.depositAfterTax * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Claimed to Wallet:</span>
                          <div>
                            <span className="text-green-400">
                              {results.totalClaimed.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.totalClaimed * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Reinvested:</span>
                          <div>
                            <span className="text-blue-400">
                              {results.totalReinvested.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.totalReinvested * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800">
                          <span className="text-gray-400">Final Deposit Value:</span>
                          <div>
                            <span className="text-gold font-bold">
                              {results.finalDepositValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.finalDepositValue * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">Performance Metrics</h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Rewards Earned:</span>
                          <div>
                            <span className="text-green-400">
                              {results.totalRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.totalRewards * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Return on Investment:</span>
                          <span className="text-green-400">{results.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Effective APR:</span>
                          <span className="text-green-400">{results.effectiveAPR.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Daily Base Rate:</span>
                          <span className="text-white">0.35%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gold mb-4">Tax Distribution</h3>
                      <div className="bg-black/30 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deposit Tax to Treasury 1 (70%):</span>
                          <div>
                            <span className="text-amber-400">
                              {results.depositTaxToTreasury1.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                              5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.depositTaxToTreasury1 * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Deposit Tax to Treasury 2 (30%):</span>
                          <div>
                            <span className="text-amber-400">
                              {results.depositTaxToTreasury2.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                              5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.depositTaxToTreasury2 * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Claim Tax to Treasury 1 (70%):</span>
                          <div>
                            <span className="text-amber-400">
                              {results.claimTaxToTreasury1.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.claimTaxToTreasury1 * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Claim Tax to Treasury 2 (30%):</span>
                          <div>
                            <span className="text-amber-400">
                              {results.claimTaxToTreasury2.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT
                            </span>
                            <span className="text-gray-400 ml-1">
                              ($
                              {(results.claimTaxToTreasury2 * TOKEN_PRICE).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gold/20 text-sm text-gray-400">
                      <div className="flex items-start mb-2">
                        <Info className="w-4 h-4 text-gold mr-2 mt-0.5" />
                        <p>Pool rewards are estimates based on platform activity and may vary.</p>
                      </div>
                      <div className="flex items-start mb-2">
                        <Info className="w-4 h-4 text-gold mr-2 mt-0.5" />
                        <p>50% auto-reinvestment is mandatory for all claimed rewards.</p>
                      </div>
                      <div className="flex items-start">
                        <Info className="w-4 h-4 text-gold mr-2 mt-0.5" />
                        <p>Taxes support platform sustainability and development.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => setActiveTab("parameters")}
                    variant="outline"
                    className="border-gold/30 hover:bg-gold/10 text-gold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Adjust Parameters
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </GradientBorder>
    </div>
  )
}
