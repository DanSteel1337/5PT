"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Target, Users } from "lucide-react"
import { ParallaxBackground } from "@/components/parallax/parallax-background"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden" ref={heroRef}>
      {/* Animated background */}
      <ParallaxBackground />

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

      {/* Main content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center self-start px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-medium mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Now Live on Binance Smart Chain
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-white mb-2">Revolutionize</span>
              <span className="block text-white mb-2">Your</span>
              <div className="relative">
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                  Crypto Investment
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
            </motion.h1>

            {/* Feature list */}
            <motion.ul
              className="space-y-5 text-gray-200 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Stake 5PT tokens and earn daily rewards</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Target className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Qualify for exclusive reward pools</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Earn referral commissions up to 10 levels deep</span>
              </li>
            </motion.ul>

            {/* CTA button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Link href="/dashboard">
                <button className="group relative overflow-hidden rounded-lg">
                  {/* Button background with animated gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 group-hover:from-purple-700 group-hover:via-purple-600 group-hover:to-blue-700 transition-all duration-500 animate-gradient-x"></div>

                  {/* Button content */}
                  <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg">
                    <span>Launch App</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Animated shine effect */}
                  <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[30deg] group-hover:animate-shine"></div>
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <StatCard value="0.35%" label="Daily Return" icon={<Zap className="w-5 h-5" />} />
              <StatCard value="9" label="Reward Pools" icon={<Target className="w-5 h-5" />} />
              <StatCard value="10%" label="Referral Bonus" icon={<Users className="w-5 h-5" />} />
            </motion.div>
          </motion.div>

          {/* Right column - 3D Token Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>

              {/* Rotating circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border border-purple-500/30 rounded-full animate-spin-slow"></div>
                <div className="absolute w-[80%] h-[80%] border border-blue-500/20 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute w-[60%] h-[60%] border border-purple-500/10 rounded-full animate-spin-slow"></div>
              </div>

              {/* Token logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[50%] h-[50%] animate-float">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-full filter blur-xl animate-pulse"></div>
                  <Image
                    src="/images/5pt-logo.png"
                    alt="5PT Token"
                    width={200}
                    height={200}
                    className="relative z-10"
                  />
                </div>
              </div>

              {/* Particle effects */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full animate-particle-flow"
                  style={{
                    top: `${50 + (Math.random() * 20 - 10)}%`,
                    left: `${50 + (Math.random() * 20 - 10)}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Floating data cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute top-[20%] right-[5%] bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-3 max-w-[180px] animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-sm font-medium text-purple-300">Pool Rewards</div>
              <div className="text-xs text-gray-400 mt-1">
                Qualify for exclusive pools with up to 0.035% daily share
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-[20%] left-[5%] bg-black/40 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 max-w-[180px] animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="text-sm font-medium text-blue-300">Referral Network</div>
              <div className="text-xs text-gray-400 mt-1">Earn 0.05% on direct referrals and 0.0135% on downline</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ScrollIndicator targetId="features" />
      </div>
    </div>
  )
}

function StatCard({ value, label, icon }) {
  return (
    <motion.div
      className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 group hover:border-purple-500/40 transition-all duration-300"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>

      {/* Icon */}
      <div className="absolute top-3 right-3 text-purple-400/70 group-hover:text-purple-400 transition-colors duration-300">
        {icon}
      </div>

      {/* Content */}
      <div className="pt-2">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors duration-300">
          {value}
        </div>
        <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">
          {label}
        </div>
      </div>
    </motion.div>
  )
}

// Add this to your globals.css or define it inline
const animationStyles = `
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.animate-shine {
  animation: shine 1.5s ease-in-out;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-slow-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}

.animate-spin-slow-reverse {
  animation: spin-slow-reverse 20s linear infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

@keyframes particle-flow {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(cos(var(--angle, 45deg)) * 100px), calc(sin(var(--angle, 45deg)) * 100px));
    opacity: 0;
  }
}

.animate-particle-flow {
  --angle: 45deg;
  animation: particle-flow 3s ease-out infinite;
}
`

// Add the styles to the document
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = animationStyles
  document.head.appendChild(style)
}
