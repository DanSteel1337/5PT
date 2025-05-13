"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { TiltCard } from "@/components/parallax/tilt-card"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"
import { PieChart, Layers, Coins, Shield } from "lucide-react"

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

  // Updated tokenomics data from contract documentation
  const tokenDistribution = [
    { name: "Airdrop Campaign", percentage: 29.7, color: "bg-purple-500" },
    { name: "Presale + Referral", percentage: 5.0, color: "bg-blue-500" },
    { name: "DEX Liquidity", percentage: 5.0, color: "bg-cyan-500" },
    { name: "Treasury", percentage: 10.0, color: "bg-indigo-500" },
    { name: "CEX / Marketing", percentage: 20.0, color: "bg-violet-500" },
    { name: "Reserve", percentage: 30.3, color: "bg-fuchsia-500" },
  ]

  return (
    <SectionContainer id="tokenomics" title="5PT TOKENOMICS" ref={containerRef}>
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

              {/* Logo with rotation based on scroll */}
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
            <ContentCard>
              <h4 className="card-title">TOKEN DETAILS</h4>
              <div className="grid grid-cols-2 gap-4">
                <TokenDetail label="Name" value="Five Pillars Token" />
                <TokenDetail label="Symbol" value="5PT" />
                <TokenDetail label="Total Supply" value="100,000,000,000" />
                <TokenDetail label="Initial Price" value="$0.00175" />
              </div>
            </ContentCard>
          </TiltCard>

          {/* Visual token distribution chart */}
          <TiltCard>
            <ContentCard className="mt-6">
              <h4 className="card-title">TOKEN DISTRIBUTION</h4>
              <div className="mt-4">
                {/* Visual distribution bars */}
                <div className="flex h-8 w-full rounded-md overflow-hidden mb-4">
                  {tokenDistribution.map((item, index) => (
                    <div
                      key={index}
                      className={`${item.color} h-full`}
                      style={{ width: `${item.percentage}%` }}
                      title={`${item.name}: ${item.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                  {tokenDistribution.map((item, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                      <span className="text-gray-300 truncate">{item.name}</span>
                      <span className="ml-auto text-purple-400 font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </ContentCard>
          </TiltCard>
        </ParallaxLayer>

        <ParallaxLayer speed={0.3} direction="right">
          {/* Key tokenomics highlights */}
          <div className="grid grid-cols-2 gap-4">
            <TokenomicsCard
              icon={<PieChart className="h-8 w-8 text-purple-400" />}
              title="TOTAL SUPPLY"
              value="100B"
              subtitle="Fixed supply, no inflation"
            />

            <TokenomicsCard
              icon={<Layers className="h-8 w-8 text-blue-400" />}
              title="INITIAL MCAP"
              value="$10.5M"
              subtitle="At token listing"
            />

            <TokenomicsCard
              icon={<Coins className="h-8 w-8 text-cyan-400" />}
              title="AIRDROP"
              value="29.7%"
              subtitle="6-year distribution"
            />

            <TokenomicsCard
              icon={<Shield className="h-8 w-8 text-violet-400" />}
              title="LIQUIDITY"
              value="5%"
              subtitle="Locked for 3 years"
            />
          </div>

          {/* Tax structure simplified */}
          <TiltCard>
            <ContentCard className="mt-6">
              <h4 className="card-title">TAX STRUCTURE</h4>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-purple-400">10%</span>
                      </div>
                      <div>
                        <h5 className="text-purple-400 font-bold">FIXED TAX RATE</h5>
                        <p className="text-xs text-gray-400">Applied to deposits and claims</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-xs text-gray-400">Treasury</p>
                      <p className="text-sm text-white font-medium">70% of tax</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-xs text-gray-400">Secondary Treasury</p>
                      <p className="text-sm text-white font-medium">30% of tax</p>
                    </div>
                  </div>
                </div>
              </div>
            </ContentCard>
          </TiltCard>

          {/* Contract addresses */}
          <TiltCard>
            <ContentCard className="mt-6">
              <h4 className="card-title">CONTRACT ADDRESSES</h4>
              <div className="space-y-3 mt-4">
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Token Contract</p>
                  <p className="text-sm text-purple-400 font-mono break-all">
                    0x8FafdFB035C9426a50D842873D5d401C933bE09F
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Investment Manager</p>
                  <p className="text-sm text-purple-400 font-mono break-all">
                    0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc
                  </p>
                </div>
              </div>
            </ContentCard>
          </TiltCard>
        </ParallaxLayer>
      </div>
    </SectionContainer>
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

function TokenomicsCard({ icon, title, value, subtitle }) {
  return (
    <motion.div
      className="bg-black/30 p-4 rounded-lg flex flex-col items-center text-center"
      whileHover={{ y: -2, backgroundColor: "rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-2">{icon}</div>
      <h5 className="text-xs text-gray-400">{title}</h5>
      <p className="text-xl font-bold text-white my-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </motion.div>
  )
}

export default Tokenomics
