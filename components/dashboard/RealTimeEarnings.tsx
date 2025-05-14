"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { formatCrypto, formatNumber } from "@/lib/utils"
import { Play, Pause, RefreshCw, Clock, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type EarningParticle = {
  id: number
  value: number
  x: number
  opacity: number
}

export function RealTimeEarnings() {
  const { userTotalDeposits, tokenSymbol, dailyRatePercent } = useInvestmentData()
  const [mounted, setMounted] = useState(false)
  const [isRunning, setIsRunning] = useState(true)
  const [showProjections, setShowProjections] = useState(false)
  const [earnings, setEarnings] = useState(0)
  const [particles, setParticles] = useState<EarningParticle[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())
  const particleIdRef = useRef(0)
  const requestRef = useRef<number | null>(null)

  // Calculate earnings per second based on daily rate
  const earningsPerSecond = (userTotalDeposits * (dailyRatePercent / 100)) / (24 * 60 * 60)

  // Calculate APY (Annual Percentage Yield)
  const apy = Math.pow(1 + dailyRatePercent / 100, 365) - 1

  // Animation frame callback
  const animate = () => {
    const now = Date.now()
    const deltaTime = (now - lastUpdateTime) / 1000 // in seconds

    if (isRunning) {
      // Update earnings based on time passed
      setEarnings((prev) => {
        const newEarnings = prev + earningsPerSecond * deltaTime

        // Create a new particle every 2 seconds or when earnings increase significantly
        if (deltaTime > 2 || newEarnings - prev > earningsPerSecond * 2) {
          const particleValue = earningsPerSecond * deltaTime
          const newParticle: EarningParticle = {
            id: particleIdRef.current++,
            value: particleValue,
            x: Math.random() * 80 + 10, // Random position between 10% and 90%
            opacity: 1,
          }

          setParticles((prev) => [...prev.slice(-5), newParticle]) // Keep only the last 6 particles
        }

        return newEarnings
      })
    }

    // Update particles (fade out and move up)
    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          opacity: p.opacity - 0.01,
        }))
        .filter((p) => p.opacity > 0),
    )

    setLastUpdateTime(now)
    requestRef.current = requestAnimationFrame(animate)
  }

  // Initialize animation
  useEffect(() => {
    setMounted(true)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Handle running state changes
  useEffect(() => {
    if (isRunning) {
      setLastUpdateTime(Date.now())
      requestRef.current = requestAnimationFrame(animate)
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isRunning])

  if (!mounted) return null

  // Calculate projections
  const hourlyEarnings = earningsPerSecond * 60 * 60
  const dailyEarnings = hourlyEarnings * 24
  const weeklyEarnings = dailyEarnings * 7
  const monthlyEarnings = dailyEarnings * 30
  const yearlyEarnings = dailyEarnings * 365

  return (
    <Card className="glass-card-purple p-6 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gradient">Real-Time Earnings</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20"
            onClick={() => setShowProjections(!showProjections)}
          >
            {showProjections ? <TrendingUp className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">{showProjections ? "Live View" : "Projections"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20"
            onClick={() => setEarnings(0)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6 relative">
        {/* Investment info */}
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm">Current Investment</p>
          <p className="text-lg font-medium">{formatCrypto(userTotalDeposits, tokenSymbol)}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs text-gray-400">Daily Rate: {dailyRatePercent.toFixed(2)}%</p>
            <span className="text-xs text-gray-500">|</span>
            <p className="text-xs text-gray-400">APY: {(apy * 100).toFixed(2)}%</p>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: -20, opacity: particle.opacity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute text-green-400 font-medium text-sm"
                style={{ left: `${particle.x}%`, bottom: "40%" }}
              >
                +{formatCrypto(particle.value, tokenSymbol)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {showProjections ? (
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Hourly</p>
                <p className="text-lg font-bold text-green-400">+{formatCrypto(hourlyEarnings, tokenSymbol)}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Daily</p>
                <p className="text-lg font-bold text-green-400">+{formatCrypto(dailyEarnings, tokenSymbol)}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Weekly</p>
                <p className="text-lg font-bold text-green-400">+{formatCrypto(weeklyEarnings, tokenSymbol)}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">Monthly</p>
                <p className="text-lg font-bold text-green-400">+{formatCrypto(monthlyEarnings, tokenSymbol)}</p>
              </div>
            </div>
            <div className="mt-4 bg-black/30 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Yearly Projection</p>
              <p className="text-2xl font-bold text-gradient">+{formatCrypto(yearlyEarnings, tokenSymbol)}</p>
              <p className="text-xs text-gray-400 mt-1">≈ ${formatNumber(yearlyEarnings * 1.25)}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Earnings Since Viewing</p>
              <div className="text-4xl md:text-5xl font-bold text-gradient glow-text-strong animate-pulse-subtle">
                +{formatCrypto(earnings, tokenSymbol)}
              </div>
              <p className="text-xs text-gray-400 mt-2">≈ ${formatNumber(earnings * 1.25)}</p>
            </div>

            <div className="w-full max-w-md mt-6">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min((earnings / dailyEarnings) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">0%</p>
                <p className="text-xs text-gray-400">Daily Target: {formatPercent(dailyRatePercent)}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 mt-4">
        {isRunning ? (
          <p>Live calculation based on {formatPercent(dailyRatePercent)} daily rate</p>
        ) : (
          <p>Counter paused. Press play to resume earnings calculation.</p>
        )}
      </div>
    </Card>
  )
}

export default RealTimeEarnings

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}
