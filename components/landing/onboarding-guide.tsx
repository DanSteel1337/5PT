"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Wallet,
  Coins,
  LayoutGrid,
  TrendingUp,
  Users,
  ChevronRight,
  Calculator,
  ArrowRight,
  Info,
  Settings,
  Flame,
  Percent,
} from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"

// Pool data based on 5PT Investment Contract - moved to the top level
const pools = [
  {
    id: 1,
    name: "Pool 1",
    personalInvestRequired: 550,
    totalDirectInvestRequired: 550,
    directRefsRequired: 1,
    share: 0.035,
  },
  {
    id: 2,
    name: "Pool 2",
    personalInvestRequired: 1450,
    totalDirectInvestRequired: 1450,
    directRefsRequired: 3,
    share: 0.035,
  },
  {
    id: 3,
    name: "Pool 3",
    personalInvestRequired: 3000,
    totalDirectInvestRequired: 6000,
    directRefsRequired: 5,
    share: 0.035,
  },
  {
    id: 4,
    name: "Pool 4",
    personalInvestRequired: 5500,
    totalDirectInvestRequired: 11000,
    directRefsRequired: 10,
    share: 0.035,
  },
  {
    id: 5,
    name: "Pool 5",
    personalInvestRequired: 14250,
    totalDirectInvestRequired: 28500,
    directRefsRequired: 15,
    share: 0.035,
  },
  {
    id: 6,
    name: "Pool 6",
    personalInvestRequired: 28500,
    totalDirectInvestRequired: 85500,
    directRefsRequired: 20,
    share: 0.02,
  },
  {
    id: 7,
    name: "Pool 7",
    personalInvestRequired: 57000,
    totalDirectInvestRequired: 171000,
    directRefsRequired: 20,
    share: 0.02,
  },
  {
    id: 8,
    name: "Pool 8",
    personalInvestRequired: 100000, // Whitelist only, using high value as placeholder
    totalDirectInvestRequired: 0,
    directRefsRequired: 0,
    share: 0.02,
    whitelistOnly: true,
  },
  {
    id: 9,
    name: "Pool 9",
    personalInvestRequired: 200000, // Whitelist only, using high value as placeholder
    totalDirectInvestRequired: 0,
    directRefsRequired: 0,
    share: 0.02,
    whitelistOnly: true,
  },
]

export function OnboardingGuide() {
  const [mounted, setMounted] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [referrals, setReferrals] = useState(5)
  const [referralVolume, setReferralVolume] = useState(5000)
  const [simulationDays, setSimulationDays] = useState(30)
  const [showSettings, setShowSettings] = useState(false)
  const [depositTax, setDepositTax] = useState(10) // Default 10%
  const [claimTax, setClaimTax] = useState(10) // Default 10%
  const [reinvestPercentage, setReinvestPercentage] = useState(50) // Default 50%
  const [autoCompound, setAutoCompound] = useState(true)
  const [claimFrequency, setClaimFrequency] = useState(7) // Default claim every 7 days

  // Pool eligibility tracking
  const [eligiblePools, setEligiblePools] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)

    // Auto-cycle through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 5) + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update eligible pools when investment amount, referrals, or referral volume changes
  useEffect(() => {
    const newEligiblePools: number[] = []

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
  }, [investmentAmount, referrals, referralVolume])

  if (!mounted) return null

  const steps = [
    {
      number: 1,
      title: "Create Wallet",
      description: "Set up a BSC-compatible wallet like MetaMask or Trust Wallet",
      icon: <Wallet className="h-6 w-6" />,
      details: [
        "Download MetaMask or Trust Wallet from official sources",
        "Create a new wallet and securely store your recovery phrase",
        "Never share your private keys or recovery phrase with anyone",
      ],
      color: "from-purple-500 to-blue-500",
    },
    {
      number: 2,
      title: "Add BSC Network",
      description: "Configure your wallet to connect to Binance Smart Chain",
      icon: <Coins className="h-6 w-6" />,
      details: [
        "Open your wallet settings and add a new network",
        "Enter Binance Smart Chain details (RPC URL, Chain ID: 56)",
        "Ensure you're connected to BSC Mainnet, not Testnet",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: 3,
      title: "Get 5PT Tokens",
      description: "Purchase 5PT tokens on PancakeSwap or other exchanges",
      icon: <LayoutGrid className="h-6 w-6" />,
      details: [
        "Buy BNB from an exchange and transfer to your wallet",
        "Visit PancakeSwap and connect your wallet",
        "Swap BNB for 5PT tokens using our contract address",
      ],
      color: "from-cyan-500 to-teal-500",
    },
    {
      number: 4,
      title: "Choose Investment Pool",
      description: "Select the investment pool that matches your goals",
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        "Connect your wallet to our dApp",
        "Review the different pool options and their returns",
        "Choose a pool based on your investment amount and referral network",
      ],
      color: "from-teal-500 to-green-500",
    },
    {
      number: 5,
      title: "Grow Your Network",
      description: "Refer friends to earn additional commission rewards",
      icon: <Users className="h-6 w-6" />,
      details: [
        "Get your unique referral link from the dashboard",
        "Share with friends and on social media",
        "Build your network to qualify for higher pools",
      ],
      color: "from-green-500 to-purple-500",
    },
  ]

  // Calculate returns based on investment amount, eligible pools, and simulation days
  const calculateReturns = () => {
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
      // Calculate daily base reward (0.35% of current investment)
      const dailyBaseReward = currentInvestment * 0.0035

      // Calculate pool rewards (if eligible for any pools)
      let poolRewards = 0

      // Assume total burned tokens (all deposits) is 10x the user's investment for simulation
      // This is a simplification for the calculator
      const assumedTotalBurned = actualInvestedAmount * 10

      // Daily pool distribution is 0.215% of total burned tokens
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

      // Total daily rewards
      const dailyTotalReward = dailyBaseReward + poolRewards

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
  }

  const results = calculateReturns()
  const lastDayResult = results.dailyResults[results.dailyResults.length - 1]

  return (
    <SectionContainer
      id="getting-started"
      title="HOW TO GET STARTED"
      subtitle="Follow these simple steps to start earning with 5PT Finance"
    >
      {/* Steps */}
      <div className="relative mb-24">
        {/* Progress Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-900/50 via-blue-900/50 to-purple-900/50 hidden md:block"></div>

        {/* Steps */}
        <div className="space-y-16 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`relative ${index % 2 === 0 ? "md:pr-12 md:text-right md:ml-auto md:mr-0" : "md:pl-12"} md:w-1/2 w-full`}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Step Number Circle - Desktop */}
              <div
                className={`absolute top-0 hidden md:flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-300 ${
                  activeStep === step.number
                    ? `border-gradient-to-r ${step.color} bg-black text-white shadow-lg shadow-purple-500/20`
                    : "border-gray-700 bg-black text-gray-400"
                } ${index % 2 === 0 ? "-right-18" : "-left-18"}`}
                style={{
                  [index % 2 === 0 ? "right" : "left"]: "-3.5rem",
                  background: activeStep === step.number ? `linear-gradient(to right, var(--tw-gradient-stops))` : "",
                  "--tw-gradient-from": activeStep === step.number ? step.color.split(" ")[0].replace("from-", "") : "",
                  "--tw-gradient-to": activeStep === step.number ? step.color.split(" ")[1].replace("to-", "") : "",
                }}
              >
                <span className="text-lg font-bold">{step.number}</span>
              </div>

              {/* Content Card */}
              <ContentCard
                className={`transition-all duration-500 ${
                  activeStep === step.number
                    ? "border-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.3)] scale-105"
                    : "border-purple-500/20"
                }`}
                onClick={() => setActiveStep(step.number)}
              >
                {/* Mobile Step Number */}
                <div className="flex items-center gap-3 md:hidden mb-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      activeStep === step.number
                        ? "border-purple-500 bg-purple-900/50 text-white"
                        : "border-gray-700 bg-black text-gray-400"
                    }`}
                  >
                    <span className="text-sm font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>

                {/* Desktop Title */}
                <h3 className="text-xl font-bold text-white mb-3 hidden md:block">{step.title}</h3>

                {/* Icon and Description */}
                <div className={`flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      activeStep === step.number
                        ? "bg-gradient-to-r " + step.color + " text-white shadow-lg"
                        : "bg-purple-900/30 text-purple-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-gray-300 mb-4 text-lg">{step.description}</p>

                    {/* Expanded Details (only visible for active step) */}
                    {activeStep === step.number && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-3"
                      >
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <p className="text-gray-300">{detail}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </ContentCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Investment Calculator */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="inline-block mb-4 p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Calculator className="h-6 w-6 text-blue-400" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">INVESTMENT </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              CALCULATOR
            </span>
          </motion.h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Calculate your potential earnings with 5PT Finance
          </motion.p>
        </div>

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
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => setDepositTax(value[0])}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>10%</span>
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
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => setClaimTax(value[0])}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>10%</span>
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
                <span className="text-blue-400 font-bold">{investmentAmount.toLocaleString()} 5PT</span>
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
                <span className="text-blue-400 font-bold">{referralVolume.toLocaleString()} 5PT</span>
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
                <p className="text-3xl font-bold text-white">{lastDayResult?.dailyReward.toFixed(2)} 5PT</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">
                    <span className="text-blue-400">•</span> Base (0.35%): {lastDayResult?.baseReward.toFixed(2)} 5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-purple-400">•</span> Pools: {lastDayResult?.poolRewards.toFixed(2)} 5PT
                  </div>
                </div>
              </div>

              {/* Investment Growth */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-300">Investment Growth</h4>
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{results.currentInvestment.toFixed(2)} 5PT</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">
                    <span className="text-blue-400">•</span> Initial: {results.afterTaxInvestment.toFixed(2)} 5PT
                  </div>
                  <div className="text-gray-400">
                    <span className="text-green-400">•</span> Growth:{" "}
                    {(results.currentInvestment - results.afterTaxInvestment).toFixed(2)} 5PT
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
                    <span className="text-green-400 font-bold">{results.totalEarnings.toFixed(2)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Reinvested:</span>
                    <span className="text-blue-400">{results.totalReinvested.toFixed(2)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Claimed:</span>
                    <span className="text-purple-400">{results.totalClaimed.toFixed(2)} 5PT</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Deposit Tax Paid:</span>
                    <span className="text-red-400">{results.depositTaxPaid.toFixed(2)} 5PT</span>
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
      >
        <Link href="/dashboard">
          <CyberButton variant="primary" size="lg" className="animate-pulse">
            Start Your Investment Journey
          </CyberButton>
        </Link>
        <p className="text-gray-400 mt-4">Join now and be among the first investors</p>
      </motion.div>
    </SectionContainer>
  )
}

export default OnboardingGuide
