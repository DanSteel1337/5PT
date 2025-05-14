"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Clock, DollarSign, Zap } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"

export function RealTimeEarnings() {
  const { userTotalDeposits, tokenSymbol, dailyRatePercent, isConnected } = useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const [earnings, setEarnings] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())
  const [viewMode, setViewMode] = useState<"realtime" | "projected">("realtime")

  // Animation references
  const pulseRef = useRef<HTMLDivElement>(null)

  // Calculate earnings per second based on daily rate
  const calculateEarningsPerSecond = () => {
    // Daily rate converted to per second (daily rate / seconds in a day)
    return (userTotalDeposits * (dailyRatePercent / 100)) / (24 * 60 * 60)
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

    const earningsPerSecond = calculateEarningsPerSecond()

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
  }, [mounted, isRunning, startTime, userTotalDeposits, dailyRatePercent])

  // Calculate projected earnings for different time periods
  const projectedEarnings = {
    hourly: (userTotalDeposits * (dailyRatePercent / 100)) / 24,
    daily: userTotalDeposits * (dailyRatePercent / 100),
    weekly: userTotalDeposits * (dailyRatePercent / 100) * 7,
    monthly: userTotalDeposits * (dailyRatePercent / 100) * 30,
    yearly: userTotalDeposits * (dailyRatePercent / 100) * 365,
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
    setViewMode(viewMode === "realtime" ? "projected" : "realtime")
  }

  if (!mounted) return null

  return (
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
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Projected Earnings
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
                  {formatNumber(calculateEarningsPerSecond(), 8)} {tokenSymbol}
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">Daily Rate</p>
                <p className="text-lg font-medium text-green-400">{dailyRatePercent}% / day</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Investment Amount:</span>
                <span className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">Earnings Per Day:</span>
                <span className="font-medium text-green-400">{formatCrypto(projectedEarnings.daily, tokenSymbol)}</span>
              </div>
            </div>
          </div>

          {/* Animated particles to show earnings accumulating */}
          <AnimatedParticles isActive={isRunning} />
        </div>
      ) : (
        <div className="bg-black/40 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Hourly Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatCrypto(projectedEarnings.hourly, tokenSymbol)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Daily Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatCrypto(projectedEarnings.daily, tokenSymbol)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Weekly Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatCrypto(projectedEarnings.weekly, tokenSymbol)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Monthly Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCrypto(projectedEarnings.monthly, tokenSymbol)}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Yearly Earnings Potential</p>
            <p className="text-3xl font-bold text-gradient-green">
              {formatCrypto(projectedEarnings.yearly, tokenSymbol)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on current daily rate of {dailyRatePercent}%</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Investment Amount:</span>
              <span className="font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">Annual Percentage Yield:</span>
              <span className="font-medium text-green-400">{formatNumber(dailyRatePercent * 365, 2)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Earnings are calculated based on your current investment and the platform's daily rate.
        </p>
      </div>
    </Card>
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
