"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useInvestmentData } from "@/providers/InvestmentDataProvider"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Clock, DollarSign, Zap } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import { CardHeader } from "@/components/ui/CardHeader"
import { DataItem } from "@/components/ui/DataGrid"
import { useMounted } from "@/hooks/useMounted"

export function RealTimeEarnings() {
  // Use the centralized data provider
  const {
    userTotalDeposits = 0,
    tokenSymbol = "5PT",
    dailyRatePercent = 0,
    projectedEarnings,
    isLoading,
    isConnected,
  } = useInvestmentData()

  // Use the custom mounting hook
  const mounted = useMounted()

  // Local state for the real-time counter
  const [earnings, setEarnings] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [startTime, setStartTime] = useState(Date.now())
  const [viewMode, setViewMode] = useState<"realtime" | "projected">("realtime")

  // Animation references
  const pulseRef = useRef<HTMLDivElement>(null)

  // Calculate earnings per second based on daily rate
  // Added null checking to prevent TypeError
  const calculateEarningsPerSecond = () => {
    // Ensure we have valid numbers to calculate with
    if (typeof userTotalDeposits !== "number" || typeof dailyRatePercent !== "number") {
      return 0
    }

    // Daily rate converted to per second (daily rate / seconds in a day)
    return (userTotalDeposits * (dailyRatePercent / 100)) / (24 * 60 * 60)
  }

  // Initialize on mount
  useEffect(() => {
    if (mounted) {
      setStartTime(Date.now())
    }
    return () => setIsRunning(false)
  }, [mounted])

  // Update earnings in real-time
  useEffect(() => {
    if (!mounted || !isRunning) return

    const earningsPerSecond = calculateEarningsPerSecond()

    // Don't proceed if we can't calculate earnings
    if (earningsPerSecond <= 0) return

    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const newEarnings = earningsPerSecond * elapsedSeconds

      // Ensure we're setting a valid number
      if (!isNaN(newEarnings)) {
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
      }
    }, 100)

    return () => clearInterval(interval)
  }, [mounted, isRunning, startTime, userTotalDeposits, dailyRatePercent])

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

  // Don't render during SSR
  if (!mounted) return null

  // Show loading state
  if (isLoading) {
    return (
      <Card className="glass-card-purple p-6 relative overflow-hidden">
        <CardHeader title="Earnings" icon={<Zap className="h-5 w-5 text-yellow-400" />} />
        <div className="space-y-4">
          <div className="h-32 bg-purple-900/30 animate-pulse rounded-lg"></div>
          <div className="h-20 bg-purple-900/30 animate-pulse rounded-lg"></div>
        </div>
      </Card>
    )
  }

  // Show not connected state
  if (!isConnected) {
    return (
      <Card className="glass-card-purple p-6 relative overflow-hidden">
        <CardHeader title="Earnings" icon={<Zap className="h-5 w-5 text-yellow-400" />} />
        <div className="text-center py-8">
          <p className="text-gray-400">Connect your wallet to see earnings</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass-card-purple p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      <CardHeader
        title={viewMode === "realtime" ? "Real-Time Earnings" : "Projected Earnings"}
        icon={
          viewMode === "realtime" ? (
            <Zap className="h-5 w-5 text-yellow-400" />
          ) : (
            <TrendingUp className="h-5 w-5 text-green-400" />
          )
        }
        action={
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
              <>
                <CyberButton variant="outline" size="sm" onClick={toggleCounter} className="flex items-center gap-1">
                  {isRunning ? <span>Pause</span> : <span>Resume</span>}
                </CyberButton>
                <CyberButton variant="outline" size="sm" onClick={resetCounter} className="flex items-center gap-1">
                  <span>Reset</span>
                </CyberButton>
              </>
            )}
          </div>
        }
      />

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
              <DataItem label="Investment Amount:" value={formatCrypto(userTotalDeposits, tokenSymbol)} />
              <DataItem
                label="Earnings Per Day:"
                value={formatCrypto(projectedEarnings?.daily ?? 0, tokenSymbol)}
                className="mt-2"
              />
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
              <p className="text-2xl font-bold text-green-400">
                {formatCrypto(projectedEarnings?.hourly ?? 0, tokenSymbol)}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Daily Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCrypto(projectedEarnings?.daily ?? 0, tokenSymbol)}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Weekly Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCrypto(projectedEarnings?.weekly ?? 0, tokenSymbol)}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Monthly Earnings</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCrypto(projectedEarnings?.monthly ?? 0, tokenSymbol)}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-black/30 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Yearly Earnings Potential</p>
            <p className="text-3xl font-bold text-gradient-green">
              {formatCrypto(projectedEarnings?.yearly ?? 0, tokenSymbol)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on current daily rate of {dailyRatePercent}%</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <DataItem label="Investment Amount:" value={formatCrypto(userTotalDeposits, tokenSymbol)} />
            <DataItem
              label="Annual Percentage Yield:"
              value={`${formatNumber(dailyRatePercent * 365, 2)}%`}
              className="mt-2"
            />
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
