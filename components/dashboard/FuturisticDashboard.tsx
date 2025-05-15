"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount } from "wagmi"
import { DigitalGauge } from "./DigitalGauge"
import { HolographicDisplay } from "./HolographicDisplay"
import { ControlPanel } from "./ControlPanel"
import { PerformanceMetrics } from "./PerformanceMetrics"
import { PoolRadar } from "./PoolRadar"
import { ReferralNetwork } from "./ReferralNetwork"
import { InvestmentAnalytics } from "./InvestmentAnalytics"
import { SystemStatus } from "./SystemStatus"
import { SoundEffects } from "@/lib/sound-effects"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { CustomConnectButton } from "../ui/custom-connect-button"

export function FuturisticDashboard() {
  const { isConnected } = useAccount()
  const { data, isLoading, error } = useInvestmentData()
  const [isBooted, setIsBooted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDeposit, setShowDeposit] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  // Boot sequence
  useEffect(() => {
    const bootTimeout = setTimeout(() => {
      setIsBooted(true)
      // Play engine start sound when dashboard boots
      SoundEffects.play("engine-start", 0.3)
    }, 2000)

    return () => clearTimeout(bootTimeout)
  }, [])

  const handleTabChange = (tab: string) => {
    SoundEffects.play("button-click", 0.2)
    setActiveTab(tab)
  }

  const handleDeposit = () => {
    setShowDeposit(true)
    setShowClaim(false)
  }

  const handleClaim = () => {
    setShowClaim(true)
    setShowDeposit(false)
  }

  if (!isBooted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-blue-400 font-mono">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
        <div className="text-xl mb-2">System Initializing</div>
        <div className="text-sm text-blue-500">Loading Investment Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-90 text-blue-100 p-4 md:p-6 overflow-hidden relative">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/dashboard-grid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Dashboard header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 relative z-10">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
            <span className="text-white font-bold">5PT</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Investment Dashboard
            </h1>
            <p className="text-xs text-blue-300">Five Pillars Token • BSC Network</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {!isConnected && <CustomConnectButton />}

          <div className="flex bg-black/40 backdrop-blur-md rounded-lg border border-blue-500/30 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm ${activeTab === "overview" ? "bg-blue-900/50 text-blue-100" : "text-blue-400 hover:bg-blue-900/20"}`}
              onClick={() => handleTabChange("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm ${activeTab === "analytics" ? "bg-blue-900/50 text-blue-100" : "text-blue-400 hover:bg-blue-900/20"}`}
              onClick={() => handleTabChange("analytics")}
            >
              Analytics
            </button>
            <button
              className={`px-4 py-2 text-sm ${activeTab === "system" ? "bg-blue-900/50 text-blue-100" : "text-blue-400 hover:bg-blue-900/20"}`}
              onClick={() => handleTabChange("system")}
            >
              System
            </button>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"
          >
            {/* Left column - gauges and controls */}
            <div className="md:col-span-1 space-y-6">
              <DigitalGauge
                title="Token Balance"
                value={data?.tokenBalance || 0}
                maxValue={100000}
                symbol="5PT"
                color="purple"
              />

              <DigitalGauge
                title="Total Rewards"
                value={data?.totalRewards || 0}
                maxValue={10000}
                symbol="5PT"
                color="blue"
              />

              <ControlPanel onDeposit={handleDeposit} onClaim={handleClaim} />
            </div>

            {/* Middle column - main display */}
            <div className="md:col-span-2 space-y-6">
              <HolographicDisplay
                poolData={data?.pools || []}
                userStats={data?.userStats}
                showDeposit={showDeposit}
                showClaim={showClaim}
              />

              <PerformanceMetrics metrics={data?.performanceMetrics} />
            </div>

            {/* Right column - radar and network */}
            <div className="md:col-span-1 space-y-6">
              <PoolRadar pools={data?.pools || []} userQualifications={data?.userQualifications} />

              <ReferralNetwork referrals={data?.referrals || []} totalCommission={data?.totalCommission || 0} />
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <InvestmentAnalytics investmentData={data} />
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <SystemStatus />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard footer */}
      <div className="mt-8 text-center text-xs text-blue-400/60 relative z-10">
        <p>Five Pillars Token Investment Dashboard • v1.0.0</p>
      </div>
    </div>
  )
}
