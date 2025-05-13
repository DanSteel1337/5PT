"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Rocket, TrendingUp, Award } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"

export function EarlyInvestor() {
  return (
    <SectionContainer
      id="early-investor"
      title="EARLY INVESTOR"
      subtitle="Join the Five Pillars Token investment platform at launch and position yourself for maximum rewards."
    >
      <ContentCard className="md:p-12">
        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Early Access */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Early Access</h3>
            <p className="text-gray-300">Be first to access all 9 investment pools</p>
          </motion.div>

          {/* Referral Advantage */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Referral Advantage</h3>
            <p className="text-gray-300">Build your network from day one</p>
          </motion.div>

          {/* Whitelist Potential */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Whitelist Potential</h3>
            <p className="text-gray-300">Opportunity for exclusive pool access</p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/dashboard">
            <CyberButton variant="primary" size="lg" className="min-w-[180px]">
              Launch App <span className="ml-2">→</span>
            </CyberButton>
          </Link>
          <Link href="https://t.me/5ptfinance" target="_blank" rel="noopener noreferrer">
            <CyberButton variant="outline" size="lg" className="min-w-[180px]">
              Join Community
            </CyberButton>
          </Link>
        </div>
      </ContentCard>
    </SectionContainer>
  )
}

export default EarlyInvestor
