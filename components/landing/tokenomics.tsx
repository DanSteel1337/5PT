"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { TiltCard } from "@/components/parallax/tilt-card"

export function Tokenomics() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Create rotation animation based on scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const tokenDistribution = [
    { name: "Liquidity Pool", percentage: 40 },
    { name: "Staking Rewards", percentage: 30 },
    { name: "Team & Development", percentage: 15 },
    { name: "Marketing", percentage: 10 },
    { name: "Community Rewards", percentage: 5 },
  ]

  const rewardMechanisms = [
    { title: "DAILY BONUS", description: "Earn 0.35% daily on your invested capital with no team tokens." },
    {
      title: "REFERRAL BONUS",
      description: "Gain an additional 0.05% daily bonus on deposits made by direct referrals.",
    },
    {
      title: "DOWNLINE BONUS",
      description: "Receive 0.0135% per level (up to levels 2–10) from your extended network.",
    },
    {
      title: "POOL BONUS",
      description: "Nine pools filled daily with a percentage of the total deposit volume.",
    },
  ]

  return (
    <section id="tokenomics" className="py-20 md:py-32 relative overflow-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <ParallaxSection intensity={0.3}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">5PT</span>{" "}
              <span className="text-white">TOKENOMICS</span>
            </motion.h2>

            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>
          </motion.div>
        </ParallaxSection>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ParallaxLayer speed={0.3} direction="left">
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="relative w-64 h-64">
                {/* Animated rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-purple-500/30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>

                <motion.div
                  className="absolute inset-2 rounded-full border border-purple-500/20"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                ></motion.div>

                <motion.div
                  className="absolute inset-4 rounded-full border border-purple-500/10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                ></motion.div>

                {/* Logo with rotation based on scroll - Fixed orientation by removing style rotation */}
                <motion.div
                  className="absolute inset-8 rounded-full bg-black/50 flex items-center justify-center"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.7))",
                  }}
                >
                  <Image
                    src="/images/5pt-logo.png"
                    alt="5PT Logo"
                    width={160}
                    height={160}
                    className="object-contain"
                    style={{ filter: "hue-rotate(60deg)" }}
                  />
                </motion.div>

                {/* Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-500 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.7)",
                    }}
                    animate={{
                      x: [0, Math.cos((i * Math.PI) / 4) * 120, 0],
                      y: [0, Math.sin((i * Math.PI) / 4) * 120, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <TiltCard>
              <motion.div
                className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  TOKEN DETAILS
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <TokenDetail label="Name" value="Five Pillars Token" />
                  <TokenDetail label="Symbol" value="5PT" />
                  <TokenDetail label="Total Supply" value="1,000,000,000" />
                  <TokenDetail label="Blockchain" value="Binance Smart Chain" />
                  <TokenDetail label="Contract" value="0x8FafdFB035C9426a50D842873D5d401C933bE09F" />
                  <TokenDetail label="Investment Manager" value="0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" />
                </div>
              </motion.div>
            </TiltCard>
          </ParallaxLayer>

          <ParallaxLayer speed={0.3} direction="right">
            <TiltCard>
              <motion.div
                className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  GLOBAL YIELD SYSTEM
                </h3>

                <p className="text-gray-300 mb-6">
                  The Five Pillars Token implements a comprehensive global yield system with multiple reward components:
                </p>

                <div className="space-y-6">
                  {rewardMechanisms.map((item, index) => (
                    <RewardMechanismItem
                      key={index}
                      title={item.title}
                      description={item.description}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            </TiltCard>

            <TiltCard>
              <motion.div
                className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  POOL DISTRIBUTION
                </h4>
                <div className="space-y-4">
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-gray-400 text-xs mb-1">Pools 1-5</p>
                    <p className="font-medium text-purple-400">0.035% Daily Share Each</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-gray-400 text-xs mb-1">Pools 6-9</p>
                    <p className="font-medium text-purple-400">0.02% Daily Share Each</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-gray-400 text-xs mb-1">Pools 8-9 Access</p>
                    <p className="font-medium text-purple-400">Whitelist Only</p>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  )
}

function TokenDetail({ label, value }) {
  return (
    <motion.div className="bg-black/50 p-3 rounded group hover:bg-black/70 transition-colors" whileHover={{ y: -2 }}>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-medium group-hover:text-purple-400 transition-colors text-sm truncate">{value}</p>
    </motion.div>
  )
}

function RewardMechanismItem({ title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-black/30 p-4 rounded-lg"
    >
      <h4 className="text-purple-400 font-bold mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  )
}

export default Tokenomics
