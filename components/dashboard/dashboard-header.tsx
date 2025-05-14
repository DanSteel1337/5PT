"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Logo } from "@/components/shared/logo"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { useInvestment } from "./investment-context"
import { formatNumber } from "@/lib/utils"

export function DashboardHeader() {
  const { userRank, formattedTotalDeposits, isLoading } = useInvestment()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const rankNames = [
    "Novice",
    "Apprentice",
    "Adept",
    "Expert",
    "Master",
    "Grandmaster",
    "Legend",
    "Mythic",
    "Divine",
    "Immortal",
  ]

  const rankName = rankNames[userRank] || "Investor"

  return (
    <motion.header
      className="bg-black/60 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo href="/" size={36} />

            <div className="hidden md:flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm">
                <span className="font-semibold">{rankName}</span> Investor
              </div>

              {!isLoading && (
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
                  <span className="font-semibold">{formatNumber(formattedTotalDeposits)} 5PT</span> Invested
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors">
              Share Success
            </button>
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
