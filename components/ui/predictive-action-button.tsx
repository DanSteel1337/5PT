"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useInvestmentManager, useInvestorInfo, useAccumulatedRewards } from "@/lib/hooks/use-investment-manager"
import { formatEther } from "ethers"
import { Sparkles, TrendingUp, Users, Award, RefreshCw } from "lucide-react"

interface PredictiveAction {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  action: () => void
  priority: number
  condition: boolean
}

export function PredictiveActionButton() {
  const { address, isConnected } = useAccount()
  const { claimReward } = useInvestmentManager()
  const { data: investorInfo, isLoading: isInfoLoading } = useInvestorInfo(address)
  const { data: rewards, isLoading: isRewardsLoading } = useAccumulatedRewards(address)

  const [suggestedActions, setSuggestedActions] = useState<PredictiveAction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dataProcessedRef = useRef(false)

  // Generate predictive actions based on user data
  useEffect(() => {
    // Skip if we're still loading or don't have an address
    if (!isConnected || !address) {
      setIsLoading(false)
      return
    }

    // Skip if we've already processed the data or if data is still loading
    if (dataProcessedRef.current || isInfoLoading || isRewardsLoading) return

    const totalDeposit = investorInfo ? Number(formatEther(investorInfo[0])) : 0
    const referralCount = investorInfo ? Number(investorInfo[1]) : 0
    const pendingRewards = rewards ? Number(formatEther(rewards)) : 0

    const actions: PredictiveAction[] = []

    // Claim rewards action
    actions.push({
      id: "claim-rewards",
      icon: <Award size={16} />,
      label: "Claim Rewards",
      description: `Claim ${pendingRewards.toFixed(2)} 5PT in pending rewards`,
      action: claimReward,
      priority: pendingRewards > 5 ? 100 : pendingRewards > 0 ? 80 : 0,
      condition: pendingRewards > 0,
    })

    // Deposit more action
    actions.push({
      id: "deposit-more",
      icon: <TrendingUp size={16} />,
      label: "Increase Investment",
      description: "Boost your rewards by increasing your stake",
      action: () => {
        // Open deposit modal
        const event = new CustomEvent("open-deposit-modal")
        window.dispatchEvent(event)
      },
      priority: totalDeposit === 0 ? 90 : totalDeposit < 10 ? 70 : 30,
      condition: true,
    })

    // Refer friends action
    actions.push({
      id: "refer-friends",
      icon: <Users size={16} />,
      label: "Refer Friends",
      description: "Grow your network and earn referral bonuses",
      action: () => {
        window.location.href = "/referrals"
      },
      priority: referralCount === 0 ? 85 : referralCount < 3 ? 60 : 20,
      condition: true,
    })

    // Auto-compound action
    actions.push({
      id: "auto-compound",
      icon: <RefreshCw size={16} />,
      label: "Enable Auto-Compound",
      description: "Automatically reinvest your rewards",
      action: () => {
        // Open settings modal
        window.location.href = "/settings"
      },
      priority: pendingRewards > 10 ? 75 : 40,
      condition: pendingRewards > 0,
    })

    // Sort actions by priority
    const filteredActions = actions.filter((action) => action.condition).sort((a, b) => b.priority - a.priority)

    setSuggestedActions(filteredActions)
    setIsLoading(false)
    dataProcessedRef.current = true
  }, [address, isConnected, investorInfo, rewards, isInfoLoading, isRewardsLoading, claimReward])

  // Reset the data processed flag when dependencies change
  useEffect(() => {
    dataProcessedRef.current = false
  }, [address, isConnected])

  // Get the top suggested action
  const topAction = suggestedActions.length > 0 ? suggestedActions[0] : null

  if (isLoading || !isConnected) return null

  return (
    <div className="relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {topAction && (
          <Button
            className="relative bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold group"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <Sparkles size={16} className="mr-2 animate-pulse" />
            <span>Suggested Action</span>

            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 rounded-md pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(212, 175, 55, 0)",
                  "0 0 10px rgba(212, 175, 55, 0.7)",
                  "0 0 0px rgba(212, 175, 55, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {showSuggestions && suggestedActions.length > 0 && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-64 bg-black/90 border border-gold/30 rounded-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {suggestedActions.map((action) => (
                <motion.button
                  key={action.id}
                  className="w-full text-left p-3 hover:bg-gold/10 rounded-md flex items-start gap-3 transition-colors"
                  onClick={() => {
                    action.action()
                    setShowSuggestions(false)
                  }}
                  whileHover={{ x: 5 }}
                >
                  <div className="mt-0.5 bg-gold/20 p-1.5 rounded-full">{action.icon}</div>
                  <div>
                    <div className="font-medium text-gold">{action.label}</div>
                    <div className="text-xs text-gray-400">{action.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
