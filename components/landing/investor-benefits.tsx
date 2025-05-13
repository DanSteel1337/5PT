"use client"

import Link from "next/link"
import { Rocket, TrendingUp, Award } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"

export function InvestorBenefits() {
  return (
    <section id="early-investor" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient - exactly matching other sections */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              EARLY INVESTOR
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"></div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the Five Pillars Token investment platform at launch and position yourself for maximum rewards.
          </p>
        </div>

        {/* Content card - using inline styles to avoid CSS conflicts */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            borderRadius: "0.75rem",
            padding: "2rem",
            overflow: "hidden",
          }}
        >
          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Early Access */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Early Access</h3>
              <p className="text-gray-300">Be first to access all 9 investment pools</p>
            </div>

            {/* Referral Advantage */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">Referral Advantage</h3>
              <p className="text-gray-300">Build your network from day one</p>
            </div>

            {/* Whitelist Potential */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Whitelist Potential</h3>
              <p className="text-gray-300">Opportunity for exclusive pool access</p>
            </div>
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
        </div>
      </div>

      {/* Background elements - matching other sections */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border border-purple-500/20 animate-rotate"></div>
        <div className="absolute bottom-1/4 left-[10%] w-48 h-48 rounded-full border border-blue-500/20 animate-rotate"></div>
        <div className="absolute top-1/3 left-[20%] w-4 h-4 rounded-full bg-purple-500/20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-[20%] w-4 h-4 rounded-full bg-blue-500/20 animate-pulse"></div>
      </div>
    </section>
  )
}

export default InvestorBenefits
