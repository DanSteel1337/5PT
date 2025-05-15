"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SoundEffects } from "@/lib/sound-effects"
import { useAccount } from "wagmi"
import { CustomConnectButton } from "../ui/custom-connect-button"

interface ControlPanelProps {
  onDeposit?: () => void
  onClaim?: () => void
  className?: string
}

export function ControlPanel({ onDeposit, onClaim, className = "" }: ControlPanelProps) {
  const { isConnected } = useAccount()
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const handleButtonClick = (action: string) => {
    // Play button click sound
    SoundEffects.play("button-click", 0.2)

    setActiveButton(action)

    if (action === "deposit" && onDeposit) {
      onDeposit()
    } else if (action === "claim" && onClaim) {
      onClaim()
    }

    // Reset active button after animation
    setTimeout(() => setActiveButton(null), 300)
  }

  return (
    <div className={`bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-purple-300 mb-1">Control Panel</h3>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-4"></div>
        </div>

        {!isConnected ? (
          <div className="flex justify-center py-2">
            <CustomConnectButton />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              className={`bg-gradient-to-r from-purple-900/80 to-purple-700/80 hover:from-purple-800 hover:to-purple-600 text-white py-3 px-4 rounded-lg border border-purple-500/50 shadow-lg shadow-purple-900/20 transition-all duration-200 ${activeButton === "deposit" ? "scale-95 opacity-90" : ""}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick("deposit")}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-purple-300">Action</span>
                <span className="font-bold">Deposit</span>
              </div>
            </motion.button>

            <motion.button
              className={`bg-gradient-to-r from-blue-900/80 to-blue-700/80 hover:from-blue-800 hover:to-blue-600 text-white py-3 px-4 rounded-lg border border-blue-500/50 shadow-lg shadow-blue-900/20 transition-all duration-200 ${activeButton === "claim" ? "scale-95 opacity-90" : ""}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick("claim")}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider text-blue-300">Action</span>
                <span className="font-bold">Claim</span>
              </div>
            </motion.button>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 mt-2">
          {isConnected ? "System Ready" : "Connect Wallet to Access Controls"}
        </div>
      </div>
    </div>
  )
}
