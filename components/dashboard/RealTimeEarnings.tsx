"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Clock, DollarSign, Zap, Info } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import { REWARD_SYSTEM } from "@/lib/contracts"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

export function RealTimeEarnings() {
  const { userTotalDeposits, tokenSymbol, userReferralVolume, lastRoundRewards, isConnected } = useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const [earnings, setEarnings] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())
  const [viewMode, setViewMode] = useState<"realtime" | "projected" | "breakdown">("realtime")

  // Animation references
  const pulseRef = useRef<HTMLDivElement>(null)

  // Calculate earnings per second based on daily rate
  const calculateEarningsPerSecond = () => {
    // Base deposit earnings (0.3% daily)
    const depositEarningsPerSecond = (userTotalDeposits * REWARD_SYSTEM.dailyBonus) / (24 * 60 * 60)

    // Referral earnings (0.025% of direct referrals + 0.06% of downline)
    const referralEarningsPerSecond =
      (userReferralVolume * (REWARD_SYSTEM.directReferralBonus + REWARD_SYSTEM.downlineReferralBonus)) / (24 * 60 * 60)

    // Pool earnings (from last round data)
    const poolEarningsPerSecond = (lastRoundRewards?.poolsReward || 0) / 10 ** 18 / (24 * 60 * 60)

    return {
      total: depositEarningsPerSecond + referralEarningsPerSecond + poolEarningsPerSecond,
      deposit: depositEarningsPerSecond,
      referral: referralEarningsPerSecond,
      pool: poolEarningsPerSecond,
    }
  }

  // Initialize on mount
  useEffect(() => {
    setMounted(true)
    setStartTime(Date.now())
    return () => setIsRunning(false)
  }, [])

  // Update earnings in real-time
  useEffect(() => {
    if (!mounted || !isRunning) return

    const earningsPerSecond = calculateEarningsPerSecond().total

    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const newEarnings = earningsPerSecond * elapsedSeconds
      setEarnings(newEarnings)

      // Add a small pulse effect every time a significant amount is earned
      if (Math.floor(newEarnings * 100) % 10 === 0 && pulseRef.current) {
        pulseRef.current.classList.add("pulse-effect")
        setTimeout(() => {
          if (pulseRef.current) {
            pulseRef.current.classList.remove("pulse-effect")
          }
        }, 500)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [mounted, isRunning, startTime, userTotalDeposits, userReferralVolume, lastRoundRewards])

  // Calculate projected earnings for different time periods with 50% reinvestment
  const calculateCompoundedYield = (days: number) => {
    let total = 0
    let currentDeposit = userTotalDeposits
    const earningsPerDay = calculateEarningsPerSecond().total * 24 * 60 * 60

    for (let i = 0; i < days; i++) {
      // Calculate daily earnings
      const dailyEarning =
        currentDeposit * REWARD_SYSTEM.dailyBonus +
        userReferralVolume * (REWARD_SYSTEM.directReferralBonus + REWARD_SYSTEM.downlineReferralBonus) +
        (lastRoundRewards?.poolsReward || 0) / 10 ** 18

      // Apply 50% reinvestment after 10% claim tax
      const reinvestedAmount = dailyEarning * REWARD_SYSTEM.reinvestmentPercent
      const claimedAmount = dailyEarning * (1 - REWARD_SYSTEM.reinvestmentPercent) * (1 - REWARD_SYSTEM.claimTaxPercent)

      total += claimedAmount
      currentDeposit += reinvestedAmount
    }

    return total
  }

  const projectedEarnings = {
    hourly: calculateEarningsPerSecond().total * 60 * 60,
    daily: calculateEarningsPerSecond().total * 24 * 60 * 60,
    weekly: calculateCompoundedYield(7),
    monthly: calculateCompoundedYield(30),
    yearly: calculateCompoundedYield(365),
  }

  // Reset counter
  const resetCounter = () => {
    setStartTime(Date.now())
    setEarnings(0)
  }

  // Toggle counter
  const toggleCounter = () => {
    if (isRunning) {
      setIsRunning(false)
      setTotalEarnings(totalEarnings + earnings)
    } else {
      setIsRunning(true)
      setStartTime(Date.now())
    }
  }

  // Toggle view mode
  const toggleViewMode = () => {
    if (viewMode === "realtime") {
      setViewMode("projected")
    } else if (viewMode === "projected") {
      setViewMode("breakdown")
    } else {
      setViewMode("realtime")
    }
  }

  if (!mounted) return null

  // Calculate earnings breakdown
  const earningsBreakdown = calculateEarningsPerSecond()
  const depositPercentage =
    earningsBreakdown.total > 0 ? (earningsBreakdown.deposit / earningsBreakdown.total) * 100 : 0
  const referralPercentage =
    earningsBreakdown.total > 0 ? (earningsBreakdown.referral / earningsBreakdown.total) * 100 : 0
  const poolPercentage = earningsBreakdown.total > 0 ? (earningsBreakdown.pool / earningsBreakdown.total) * 100 : 0

  return (
    <TooltipProvider>
      <Card className="glass-card-purple p-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gradient flex items-center">
            {viewMode === "realtime" ? (
              <>
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                Real-Time Earnings
              </>
            ) : viewMode === "projected" ? (
              <>
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Projected Earnings
              </>
            ) : (
              <>
                <Info className="mr-2 h-5 w-5 text-blue-400" />
                Earnings Breakdown
              </>
            )}
          </h3>
          <div className="flex gap-2">
            <CyberButton variant="outline" size="sm" onClick={toggleViewMode} className="flex items-center gap-1">
              {viewMode === "realtime" ? (
                <>
                  <TrendingUp className="h-3 w-3" />
                  <span className="hidden sm:inline">Projections</span>
                </>
              ) : viewMode === "projected" ? (
                <>
                  <Info className="h-3 w-3" />
                  <span className="hidden sm:inline">Breakdown</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline">Real-Time</span>
                </>
              )}
            </CyberButton>

            {viewMode === "realtime" && (
              <CyberButton variant="outline" size="sm" onClick={toggleCounter} className="flex items-center gap-1">
                {isRunning ? <span>Pause</span> : <span>Resume</span>}
              </CyberButton>
            )}

            {viewMode === "realtime" && (
              <CyberButton variant="outline" size="sm" onClick={resetCounter} className="flex items-center gap-1">
                <span>Reset</span>
              </CyberButton>
            )}
          </div>
        </div>

        {viewMode === "realtime" ? (
          <div className="relative">
            <div className="bg-black/40 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm mb-1">Earnings Since {new Date(startTime).toLocaleTimeString()}</p>
                <div className="relative">
                  <div
                    ref={pulseRef}
                    className="text-4xl md:text-5xl font-bold text-gradient-green flex items-center justify-center"
                  >
                    <DollarSign className="h-8 w-8 mr-1 text-green-400" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={Math.floor(earnings * 10000)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {formatNumber(earnings, 6)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="ml-2 text-xl text-green-400">{tokenSymbol}</span>
                  </div>

                  {/* Pulse effect overlay */}
                  <div className="absolute inset-0 bg-green-500/0 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">Rate Per Second</p>
                  <p className="text-lg font-medium text-green-400">
                    {formatNumber(earningsBreakdown.total, 8)} {tokenSymbol}
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">Daily Rate</p>
                  <p className="text-lg font-medium text-green-400">0.3% / day</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Investment Amount:</span>
                  <span className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Earnings Per Day:</span>
                  <span className="font-medium text-green-400">
                    {formatCrypto(projectedEarnings.daily, tokenSymbol)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Auto-Reinvestment:</span>
                  <span className="font-medium text-purple-400">50% of rewards</span>
                </div>
              </div>
            </div>

            {/* Animated particles to show earnings accumulating */}
            <AnimatedParticles isActive={isRunning} />
          </div>
        ) : viewMode === "projected" ? (
          <div className="bg-black/40 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Hourly Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCrypto(projectedEarnings.hourly, tokenSymbol)}
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Daily Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCrypto(projectedEarnings.daily, tokenSymbol)}
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Weekly Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCrypto(projectedEarnings.weekly, tokenSymbol)}
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Monthly Earnings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCrypto(projectedEarnings.monthly, tokenSymbol)}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Yearly Earnings Potential (with 50% Reinvestment)</p>
              <p className="text-3xl font-bold text-gradient-green">
                {formatCrypto(projectedEarnings.yearly, tokenSymbol)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on current daily rate of 0.3% with compound growth</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Investment Amount:</span>
                <span className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Annual Percentage Yield:</span>
                <span className="font-medium text-green-400">{formatNumber(0.3 * 365, 2)}%</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Effective APY with Reinvestment:</span>
                <TooltipProvider>
                  <Tooltip content="Higher due to compound effect of 50% reinvestment">
                    <TooltipTrigger>
                      <span className="font-medium text-green-400 flex items-center">
                        {formatNumber(0.3 * 365 * 1.5, 2)}%
                        <Info className="h-3 w-3 ml-1 text-gray-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Higher due to compound effect of 50% reinvestment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black/40 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-center">Earnings Sources</h4>
              <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div className="absolute h-full bg-green-500" style={{ width: `${depositPercentage}%` }}></div>
                <div
                  className="absolute h-full bg-blue-500"
                  style={{ width: `${referralPercentage}%`, left: `${depositPercentage}%` }}
                ></div>
                <div
                  className="absolute h-full bg-purple-500"
                  style={{ width: `${poolPercentage}%`, left: `${depositPercentage + referralPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Deposit: {formatNumber(depositPercentage, 1)}%</span>
                <span>Referrals: {formatNumber(referralPercentage, 1)}%</span>
                <span>Pools: {formatNumber(poolPercentage, 1)}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-gray-300">Deposit Rewards (0.3%)</p>
                  </div>
                  <p className="font-medium text-green-400">
                    {formatCrypto(earningsBreakdown.deposit * 24 * 60 * 60, tokenSymbol)}/day
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Base rewards from your {formatCrypto(userTotalDeposits, tokenSymbol)} investment
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <p className="text-gray-300">Referral Rewards</p>
                  </div>
                  <p className="font-medium text-blue-400">
                    {formatCrypto(earningsBreakdown.referral * 24 * 60 * 60, tokenSymbol)}/day
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-black/20 rounded p-2">
                    <p className="text-xs text-gray-400">Direct (0.025%)</p>
                    <p className="text-sm">
                      {formatCrypto(earningsBreakdown.referral * 0.3 * 24 * 60 * 60, tokenSymbol)}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded p-2">
                    <p className="text-xs text-gray-400">Downline (0.06%)</p>
                    <p className="text-sm">
                      {formatCrypto(earningsBreakdown.referral * 0.7 * 24 * 60 * 60, tokenSymbol)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <p className="text-gray-300">Pool Rewards</p>
                  </div>
                  <p className="font-medium text-purple-400">
                    {formatCrypto(earningsBreakdown.pool * 24 * 60 * 60, tokenSymbol)}/day
                  </p>
                </div>
                <p className="text-xs text-gray-500">Additional rewards from qualified investment pools</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Daily Earnings:</span>
                <span className="font-medium text-green-400">
                  {formatCrypto(earningsBreakdown.total * 24 * 60 * 60, tokenSymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">After 10% Claim Tax:</span>
                <span className="font-medium text-green-400">
                  {formatCrypto(earningsBreakdown.total * 24 * 60 * 60 * 0.9, tokenSymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">To Wallet (50%):</span>
                <span className="font-medium text-green-400">
                  {formatCrypto(earningsBreakdown.total * 24 * 60 * 60 * 0.9 * 0.5, tokenSymbol)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Auto-Reinvested (50%):</span>
                <span className="font-medium text-purple-400">
                  {formatCrypto(earningsBreakdown.total * 24 * 60 * 60 * 0.9 * 0.5, tokenSymbol)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Earnings are calculated based on your current investment, referrals, and pool qualifications. 50% of rewards
            are automatically reinvested after the {REWARD_SYSTEM.claimTaxPercent * 100}% claim tax.
          </p>
        </div>
      </Card>
    </TooltipProvider>
  )
}

// Animated particles component to visualize earnings
function AnimatedParticles({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (!isActive) return

    // Create new particles at random intervals
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 0,
      }

      setParticles((prev) => [...prev, newParticle])

      // Remove particles after they've animated
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 3000)
    }, 300)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
          initial={{ x: `${particle.x}%`, y: "0%", opacity: 0 }}
          animate={{
            y: "100%",
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{ duration: 3, ease: "easeOut" }}
          style={{ left: `${particle.x}%` }}
        />
      ))}
    </div>
  )
}
