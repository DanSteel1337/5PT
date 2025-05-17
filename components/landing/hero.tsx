/**
 * Hero Component
 *
 * The main hero section for the 5PT Investment Platform landing page.
 * Features animated elements, parallax effects, and call-to-action buttons.
 */

"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, Target, Users } from "lucide-react"
import { ParallaxBackground } from "@/components/parallax/parallax-background"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
// Import the useMounted hook
import { useMounted } from "@/hooks/use-mounted"
import React from "react"

export function Hero() {
  // Replace the useState and useEffect for mounting with the hook
  // Replace:
  // const [mounted, setMounted] = useState(false)
  // useEffect(() => {
  //   setMounted(true)
  // }, [])
  // With:
  const mounted = useMounted()

  // Reference to the hero section for scroll functionality
  const heroRef = useRef<HTMLDivElement>(null)

  // Don't render until client-side to prevent hydration issues
  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden" ref={heroRef}>
      {/* Animated parallax background */}
      <ParallaxBackground />

      {/* Floating particles for visual effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Reduce the number of floating particles */}
        {/* Replace: */}
        {/* {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
            aria-hidden="true"
          />
        ))} */}
        {/* With: */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              willChange: "transform",
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Badge - Network indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center self-start px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-medium mb-2"
              style={{ willChange: "transform, opacity" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Now Live on Binance Smart Chain
            </motion.div>

            {/* Main headline with animated gradient */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ willChange: "transform, opacity" }}
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

            {/* Feature list with icons */}
            <motion.ul
              className="space-y-5 text-gray-200 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{ willChange: "transform, opacity" }}
            >
              {/* Feature 1 - Daily rewards */}
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Stake 5PT tokens and earn daily rewards</span>
              </li>

              {/* Feature 2 - Reward pools */}
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Target className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Qualify for exclusive reward pools</span>
              </li>

              {/* Feature 3 - Referral commissions */}
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-lg">Earn referral commissions up to 10 levels deep</span>
              </li>
            </motion.ul>

            {/* Call-to-action button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ willChange: "transform, opacity" }}
            >
              <Link href="/dashboard">
                <button className="group relative overflow-hidden rounded-lg" aria-label="Launch App">
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
                  <div
                    className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-[30deg] group-hover:animate-shine"
                    aria-hidden="true"
                  ></div>
                </button>
              </Link>
            </motion.div>

            {/* Stats section - Key metrics */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              style={{ willChange: "transform, opacity" }}
            >
              <StatCard value="0.3%" label="Daily Return" icon={<Zap className="w-5 h-5" />} />
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
            style={{ willChange: "transform, opacity" }}
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glowing background effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full filter blur-3xl animate-pulse-slow"
                aria-hidden="true"
              ></div>

              {/* Rotating circles for visual effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-full h-full border border-purple-500/30 rounded-full animate-spin-slow"
                  aria-hidden="true"
                ></div>
                <div
                  className="absolute w-[80%] h-[80%] border border-blue-500/20 rounded-full animate-spin-slow-reverse"
                  aria-hidden="true"
                ></div>
                <div
                  className="absolute w-[60%] h-[60%] border border-purple-500/10 rounded-full animate-spin-slow"
                  aria-hidden="true"
                ></div>
              </div>

              {/* Token logo with glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[50%] h-[50%] animate-float">
                  <div
                    className="absolute inset-0 bg-purple-500/30 rounded-full filter blur-xl animate-pulse"
                    aria-hidden="true"
                  ></div>
                  <Image
                    src="/images/5pt-logo.png"
                    alt="5PT Token"
                    width={200}
                    height={200}
                    className="relative z-10"
                    priority
                  />
                </div>
              </div>

              {/* Particle effects */}
              {/* Reduce the number of particle effects in the token visualization */}
              {/* Replace: */}
              {/* {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full animate-particle-flow"
                  style={{
                    top: `${50 + (Math.random() * 20 - 10)}%`,
                    left: `${50 + (Math.random() * 20 - 10)}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                  aria-hidden="true"
                />
              ))} */}
              {/* With: */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full animate-particle-flow"
                  style={{
                    top: `${50 + (Math.random() * 20 - 10)}%`,
                    left: `${50 + (Math.random() * 20 - 10)}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Floating data cards with feature highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute top-[20%] right-[5%] bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-3 max-w-[180px] animate-float"
              style={{ animationDelay: "1s", willChange: "transform, opacity" }}
            >
              <div className="text-sm font-medium text-purple-300">Pool Rewards</div>
              <div className="text-xs text-gray-400 mt-1">
                Qualify for exclusive pools with up to 0.0175% daily share
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-[20%] left-[5%] bg-black/40 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 max-w-[180px] animate-float"
              style={{ animationDelay: "1.5s", willChange: "transform, opacity" }}
            >
              <div className="text-sm font-medium text-blue-300">Referral Network</div>
              <div className="text-xs text-gray-400 mt-1">Earn 0.025% on direct referrals and 0.06% on downline</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator at the bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ScrollIndicator targetId="features" />
      </div>
    </div>
  )
}

/**
 * StatCard Component
 *
 * Displays a key statistic with an icon, value, and label.
 * Features hover animations and gradient effects.
 */
// Memoize StatCard for better performance
const StatCard = React.memo(function StatCard({ value, label, icon }) {
  return (
    <motion.div
      className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 group hover:border-purple-500/40 transition-all duration-300"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)" }}
      style={{ willChange: "transform" }}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      ></div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"
        aria-hidden="true"
      ></div>

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
})

export default Hero
