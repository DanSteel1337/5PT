"use client"

import { motion } from "framer-motion"
import { ConnectKitButton } from "connectkit"
import { Wallet } from "lucide-react"

export function ConnectWalletPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center mb-6">
        <Wallet size={32} className="text-gold" />
      </div>
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
        Connect Your Wallet
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Connect your wallet to view available investment pools and their requirements.
      </p>
      <ConnectKitButton
        customTheme={{
          "--ck-connectbutton-background": "linear-gradient(to right, #b8860b, #d4af37)",
          "--ck-connectbutton-color": "#000",
          "--ck-connectbutton-hover-background": "linear-gradient(to right, #d4af37, #f5d76e)",
        }}
      />
    </motion.div>
  )
}
