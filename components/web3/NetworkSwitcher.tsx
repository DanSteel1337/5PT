/**
 * @file NetworkSwitcher.tsx
 * @description Network display and switching component for BSC networks
 *
 * ⚠️ IMPORTANT ARCHITECTURE NOTES ⚠️
 *
 * 1. NETWORK DISPLAY RESPONSIBILITY:
 *    - This component is the ONLY component that should display network information
 *    - The CustomConnectButton has been modified to NOT display network info
 *    - This prevents duplication of network information in the UI
 *
 * 2. COMPONENT RELATIONSHIPS:
 *    - Used alongside CustomConnectButton in the DashboardHeader
 *    - This component handles ONLY network display/switching
 *    - CustomConnectButton handles wallet connection and account display
 *
 * 3. USAGE GUIDELINES:
 *    - Always use alongside CustomConnectButton
 *    - Do not create alternative network display components
 *    - Do not modify CustomConnectButton to also display network info
 *
 * 4. VISUAL STYLING:
 *    - Uses purple styling for correct networks
 *    - Uses red styling for incorrect/unsupported networks
 *    - Includes a colored dot indicator for network status
 *
 * @dependencies
 * - wagmi: Provides chain detection and switching hooks
 * - framer-motion: For animations
 */

"use client"

import { useState, useEffect } from "react"
import { useChainId, useSwitchChain } from "wagmi"
import { motion } from "framer-motion"

/**
 * NetworkSwitcher Component
 *
 * Displays the current network and allows switching between networks.
 * This is the ONLY component that should display network information.
 */
export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine if we're on BSC Testnet (chainId 97) or BSC Mainnet (chainId 56)
  const isBscTestnet = chainId === 97
  const isBscMainnet = chainId === 56
  const isCorrectNetwork = isBscTestnet || isBscMainnet

  const handleSwitchNetwork = (targetChainId: number) => {
    try {
      switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error("Error switching network:", error)
    }
  }

  return (
    <motion.div
      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
        isCorrectNetwork
          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
          : "bg-red-500/20 text-red-300 border border-red-500/30"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isCorrectNetwork ? (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
          {isBscTestnet ? "BINANCE SMART CHAIN TESTNET" : "BINANCE SMART CHAIN"}
        </div>
      ) : (
        <button onClick={() => handleSwitchNetwork(97)} className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
          Switch to BSC Testnet
        </button>
      )}
    </motion.div>
  )
}
