"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Zap, Target, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { ParallaxBackground } from "@/components/parallax/parallax-background"
import { FloatingObject } from "@/components/parallax/floating-object"
import GradientText from "@/components/ui/gradient-text"

export function Hero() {
  const mounted = useMounted()
  const [isHovered, setIsHovered] = useState(false)

  if (!mounted) return null

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      <ParallaxBackground />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 mr-2 animate-pulse"></span>
              Now Live on Binance Smart Chain
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Revolutionize <br />
              Your <br />
              <GradientText className="text-5xl md:text-6xl lg:text-7xl">Crypto Investment</GradientText>
            </motion.h1>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-purple-900/50 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-lg text-gray-300">Stake 5PT tokens and earn daily rewards</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-900/50 p-2 rounded-full">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-lg text-gray-300">Qualify for exclusive reward pools</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-900/50 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-lg text-gray-300">Earn referral commissions up to 10 levels deep</p>
              </div>
            </motion.div>

            {/* Launch App button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative z-50" // Added higher z-index
            >
              <Link
                href="/app/dashboard"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                  "inline-flex items-center px-8 py-3 rounded-lg text-white font-medium transition-all duration-300",
                  "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400",
                  "shadow-lg hover:shadow-purple-500/30",
                  "relative z-50", // Added higher z-index
                  "cursor-pointer", // Explicitly set cursor
                  "pointer-events-auto", // Ensure pointer events are enabled
                )}
                onClick={(e) => {
                  // Add click logging for debugging
                  console.log("Launch App button clicked")
                }}
              >
                <span>Launch App</span>
                <ArrowRight
                  className={cn(
                    "ml-2 h-5 w-5 transition-transform duration-300",
                    isHovered ? "transform translate-x-1" : "",
                  )}
                />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-8"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-2xl font-bold">0.3%</span>
                </div>
                <p className="text-sm text-gray-400">Daily Return</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-2xl font-bold">9</span>
                </div>
                <p className="text-sm text-gray-400">Reward Pools</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-2xl font-bold">10%</span>
                </div>
                <p className="text-sm text-gray-400">Referral Bonus</p>
              </div>
            </motion.div>
          </div>

          <div className="relative hidden lg:block pointer-events-none">
            {" "}
            {/* Added pointer-events-none */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <img src="/images/5pt-logo.png" alt="5PT Token" className="w-80 h-80 mx-auto object-contain" />

              <FloatingObject className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" delay={0}>
                <div className="bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 w-64">
                  <h3 className="text-lg font-semibold mb-1">Pool Rewards</h3>
                  <p className="text-sm text-gray-300">Qualify for exclusive pools with up to 0.0175% daily share</p>
                </div>
              </FloatingObject>

              <FloatingObject
                className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2"
                delay={0.2}
              >
                <div className="bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 w-64">
                  <h3 className="text-lg font-semibold mb-1">Referral Network</h3>
                  <p className="text-sm text-gray-300">Earn 0.025% on direct referrals and 0.06% on downline</p>
                </div>
              </FloatingObject>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 flex flex-col items-center animate-bounce-slow pointer-events-none">
        {" "}
        {/* Added pointer-events-none */}
        <p className="text-sm mb-2">Scroll</p>
        <p className="text-sm">Down</p>
      </div>
    </section>
  )
}

export default Hero
