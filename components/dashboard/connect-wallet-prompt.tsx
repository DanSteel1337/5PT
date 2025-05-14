"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { ParallaxBackground } from "@/components/parallax/parallax-background"

export function ConnectWalletPrompt() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Background */}
      <ParallaxBackground />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full mx-auto px-4"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
            <p className="text-gray-300">
              Please connect your wallet to access the 5PT Investment Dashboard and view your investments.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <CustomConnectButton />
          </div>

          <div className="text-sm text-gray-400 text-center">
            <p className="mb-4">
              New to crypto? You'll need a wallet like MetaMask or Trust Wallet to interact with the 5PT platform.
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
