"use client"

import { useState, useEffect } from "react"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { InvestmentCalculator } from "@/components/landing/investment-calculator"
import { TrendingUp, Users, Zap } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"

export function CalculatorSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SectionContainer
      id="calculator"
      title="EARNINGS"
      subtitle="See how your investment can grow with our revolutionary DeFi protocol. Adjust parameters to visualize your potential returns."
    >
      <ParallaxLayer speed={0.2} direction="up">
        <InvestmentCalculator />
      </ParallaxLayer>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <ParallaxLayer speed={0.3} direction="up">
          <ContentCard>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Compound Growth</h3>
            <p className="text-gray-400">
              Reinvest your daily earnings to leverage the power of compound interest and maximize your returns over
              time.
            </p>
          </ContentCard>
        </ParallaxLayer>

        <ParallaxLayer speed={0.4} direction="up">
          <ContentCard>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Referral Network</h3>
            <p className="text-gray-400">
              Boost your earnings by building a referral network. Earn up to 15% commission on your referrals'
              investments.
            </p>
          </ContentCard>
        </ParallaxLayer>

        <ParallaxLayer speed={0.5} direction="up">
          <ContentCard>
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Multiple Pools</h3>
            <p className="text-gray-400">
              Choose from different investment pools based on your risk tolerance and investment goals, with daily
              returns from 5% to 15%.
            </p>
          </ContentCard>
        </ParallaxLayer>
      </div>
    </SectionContainer>
  )
}

export default CalculatorSection
