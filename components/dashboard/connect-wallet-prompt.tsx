"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, TrendingUp, Users, Zap } from "lucide-react"
import { CyberCard } from "@/components/ui/cyber-card"
import { CustomConnectButton } from "@/components/web3/ConnectButton"

export function ConnectWalletPrompt() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      title: "Track Your Investments",
      description: "Monitor your deposits, earnings, and ROI in real-time with detailed analytics.",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Manage Referrals",
      description: "View your referral network, track commissions, and generate referral links.",
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      title: "Claim Rewards",
      description: "See your accumulated rewards and claim them with a single click.",
    },
  ]

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CyberCard variant="panel" glowing={true} scanline={true} className="p-8 md:p-10">
          <div className="text-center mb-10">
            <motion.div
              className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Wallet className="h-8 w-8 text-purple-400" />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Connect Your Wallet
            </motion.h1>

            <motion.p
              className="text-gray-400 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Connect your wallet to access your 5PT investment dashboard, track your earnings, and manage your
              referrals.
            </motion.p>
          </div>

          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <CustomConnectButton />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-black/40 rounded-lg p-6 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CyberCard>
      </motion.div>
    </div>
  )
}
