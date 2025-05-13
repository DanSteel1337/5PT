"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Shield, Users, Award, ChevronRight, Layers } from "lucide-react"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { TiltCard } from "@/components/parallax/tilt-card"

export function Features() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const features = [
    {
      icon: <Layers className="h-8 w-8" />,
      title: "GLOBAL YIELD SYSTEM",
      description: "Earn daily rewards through our comprehensive multi-component yield system.",
      points: ["0.35% daily bonus on invested capital", "No team tokens - designed for investors"],
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "MULTI-TIER POOLS",
      description: "Access 9 different investment pools with varying qualification criteria and rewards.",
      points: ["Pools 1-5: 0.035% daily pool share each", "Pools 6-9: 0.02% daily pool share each"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "REFERRAL BONUSES",
      description: "Earn additional income by referring new investors to the platform.",
      points: ["0.05% daily bonus on direct referral deposits", "0.0135% daily bonus per level (levels 2-10)"],
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "POOL QUALIFICATION",
      description: "Unlock higher pools by meeting investment and referral criteria.",
      points: ["Personal investment thresholds", "Direct partner requirements", "Total turnover volume targets"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "EXCLUSIVE WHITELIST",
      description: "Special access to Pools 8 & 9 for early supporters and strategic partners.",
      points: ["Whitelist-only access with 0.02% daily share", "Rewards for platform contributors"],
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                INVESTMENT
              </span>{" "}
              <span className="text-white">FEATURES</span>
            </motion.h2>

            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The Five Pillars Token implements a comprehensive investment platform with multiple reward mechanisms
            </motion.p>
          </motion.div>
        </ParallaxSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.slice(0, 3).map((feature, index) => (
            <ParallaxLayer key={index} speed={0.2 + index * 0.1} direction="up" offset={index * 10}>
              <TiltCard>
                <FeatureCard feature={feature} index={index} />
              </TiltCard>
            </ParallaxLayer>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {features.slice(3).map((feature, index) => (
            <ParallaxLayer key={index + 3} speed={0.2 + index * 0.1} direction="up" offset={(index + 3) * 10}>
              <TiltCard>
                <FeatureCard feature={feature} index={index + 3} />
              </TiltCard>
            </ParallaxLayer>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      className="relative bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        borderColor: "rgba(139, 92, 246, 0.5)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500"></div>

      {/* Glowing dot */}
      <div className="absolute top-4 right-4">
        <motion.div
          className="w-2 h-2 bg-purple-500 rounded-full"
          animate={{
            boxShadow: [
              "0 0 5px rgba(139, 92, 246, 0.5)",
              "0 0 15px rgba(139, 92, 246, 0.8)",
              "0 0 5px rgba(139, 92, 246, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
        />
      </div>

      {/* Icon */}
      <motion.div
        className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center mb-6 text-purple-400"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
      >
        {feature.icon}
      </motion.div>

      {/* Content */}
      <motion.h3
        className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        {feature.title}
      </motion.h3>

      <motion.p
        className="text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
      >
        {feature.description}
      </motion.p>

      <motion.ul
        className="space-y-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
      >
        {feature.points.map((point, i) => (
          <li key={i} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
            <ChevronRight className="h-4 w-4 text-purple-400 mr-2" />
            {point}
          </li>
        ))}
      </motion.ul>

      {/* Bottom border animation */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 to-blue-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
    </motion.div>
  )
}

export default Features
