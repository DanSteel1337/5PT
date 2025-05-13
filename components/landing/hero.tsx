"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Zap, Shield, TrendingUp, Award } from "lucide-react"
import { motion } from "framer-motion"
import { ParallaxBackground } from "@/components/parallax/parallax-background"
import { TiltCard } from "@/components/parallax/tilt-card"
import { FloatingObject } from "@/components/parallax/floating-object"
import { Logo } from "@/components/shared/logo"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("Hero component mounted")

    return () => {
      console.log("Hero component unmounted")
    }
  }, [])

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-purple-500/20"></div>
      </section>
    )
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-40 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <FloatingObject>
            <Logo size={120} animated={true} className="mb-8" />
          </FloatingObject>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              REVOLUTIONARY
            </span>
            <br />
            <span className="text-white text-shadow-lg">YIELD PROTOCOL</span>
          </motion.h1>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>

          <motion.p
            className="text-xl text-white max-w-3xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            The Five Pillars Token (5PT) introduces a groundbreaking investment platform with a global yield system
            offering <span className="text-purple-400 font-bold">daily rewards</span> across multiple investment pools.
          </motion.p>

          <motion.p
            className="text-lg text-purple-300 max-w-2xl mb-12 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Be among the first to access our multi-tier investment ecosystem with daily bonuses and exclusive pool
            incentives.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/dashboard">
              <button className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-50 transition-opacity"></span>
                <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-8 h-8 bg-white/20 rounded-full animate-ping"></span>
                </span>
                <span className="relative flex items-center justify-center text-white font-bold">
                  Launch App
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            <Link href="/#features">
              <button className="px-8 py-4 bg-transparent border border-purple-500/50 rounded-lg text-purple-400 font-bold hover:bg-purple-500/10 transition-colors">
                Explore Features
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <TiltCard>
            <BenefitCard
              value="0.35%"
              label="Daily Base Bonus"
              icon={<Zap className="h-6 w-6 text-purple-400" />}
              delay={0}
            />
          </TiltCard>

          <TiltCard>
            <BenefitCard
              value="9 Pools"
              label="Investment Options"
              icon={<TrendingUp className="h-6 w-6 text-purple-400" />}
              delay={0.1}
            />
          </TiltCard>

          <TiltCard>
            <BenefitCard
              value="Multi-Tier"
              label="Referral System"
              icon={<Shield className="h-6 w-6 text-purple-400" />}
              delay={0.2}
            />
          </TiltCard>

          <TiltCard>
            <BenefitCard
              value="Exclusive"
              label="Whitelist Pools"
              icon={<Award className="h-6 w-6 text-purple-400" />}
              delay={0.3}
            />
          </TiltCard>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border border-purple-500/20 animate-rotate opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-[10%] w-48 h-48 rounded-full border border-blue-500/20 animate-rotate opacity-20 pointer-events-none"></div>
      </div>
    </section>
  )
}

function BenefitCard({ value, label, icon, delay = 0 }) {
  return (
    <motion.div
      className="relative bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-300"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">{icon}</div>
        <div className="w-8 h-8 flex items-center justify-center">
          <motion.div
            className="w-1 h-1 bg-purple-500 rounded-full"
            animate={{
              boxShadow: [
                "0 0 5px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.8)",
                "0 0 5px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </div>

      <motion.p
        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {value}
      </motion.p>

      <motion.p
        className="text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {label}
      </motion.p>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 to-blue-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
    </motion.div>
  )
}

export default Hero
