"use client"

import { motion } from "framer-motion"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { Wallet, TrendingUp, Users, DollarSign } from "lucide-react"

export function ConnectWalletPrompt() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950/20 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full rounded-2xl bg-gradient-to-br from-black/80 to-purple-950/20 border border-purple-500/30 p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-purple-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
        <p className="text-purple-300/80 mb-6">
          Connect your wallet to access your 5PT Investment Dashboard and track your earnings in real-time.
        </p>

        <div className="mb-8 flex justify-center">
          <CustomConnectButton />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-900/10 rounded-lg p-3 border border-purple-500/20">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-purple-300/70">Track Investments</p>
          </div>

          <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-500/20">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-blue-300/70">Monitor Growth</p>
          </div>

          <div className="bg-green-900/10 rounded-lg p-3 border border-green-500/20">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-green-300/70">Manage Referrals</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
