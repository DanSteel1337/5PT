"use client"

import { TrendingUp, Shield, Users, Award, Layers } from "lucide-react"
import { motion } from "framer-motion"
import { SectionContainer } from "@/components/ui/section-container"
import { FeatureCard } from "./feature-card"
import type { FeatureData } from "@/types/features"
import { useMounted } from "@/hooks/use-mounted"

const features: FeatureData[] = [
  {
    icon: <Layers className="h-8 w-8" />,
    title: "GLOBAL YIELD SYSTEM",
    description: "Earn daily rewards through our comprehensive multi-component yield system.",
    points: ["0.3% daily bonus on invested capital", "No team tokens - designed for investors"],
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "MULTI-TIER POOLS",
    description: "Access 9 different investment pools with varying qualification criteria and rewards.",
    points: [
      "Pools 1-5: 0.0175% daily pool share each",
      "Pools 6-7: 0.01% daily pool share each",
      "Pools 8-9: 0.02% daily pool share each (whitelist)",
    ],
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "REFERRAL BONUSES",
    description: "Earn additional income by referring new investors to the platform.",
    points: ["0.025% daily bonus on direct referral deposits", "0.06% daily bonus per level (levels 2-10)"],
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export function Features() {
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <SectionContainer
      id="features"
      title="INVESTMENT FEATURES"
      subtitle="The Five Pillars Token implements a comprehensive investment platform with multiple reward mechanisms"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.slice(0, 3).map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.slice(3).map((feature, index) => (
          <FeatureCard key={index + 3} feature={feature} index={index + 3} />
        ))}
      </motion.div>
    </SectionContainer>
  )
}

export default Features
