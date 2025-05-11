"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Wallet } from "lucide-react"

export function WalletPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-8">
        <Image src="/images/5pt-logo.png" alt="Five Pillars Token" width={120} height={120} className="rounded-full" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-amber-300">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Connect your wallet to view your dashboard, manage investments, and track rewards.
      </p>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center mb-6">
        <Wallet size={32} className="text-amber-500" />
      </div>
      <p className="text-amber-300/70 text-sm">
        Click the "Connect Wallet" button in the top-right corner to get started
      </p>
    </motion.div>
  )
}
