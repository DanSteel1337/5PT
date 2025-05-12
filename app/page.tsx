import { ModernHero } from "@/components/landing/modern-hero"
import { Features } from "@/components/landing/features"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernHero />
      <Features />

      {/* TODO: Fix Tokenomics component - potentially causing build errors
         Temporary commented out for diagnostic purposes */}
      {/* import { Tokenomics } from "@/components/landing/tokenomics" */}
      {/* <Tokenomics /> */}

      <InvestmentCTA />
    </main>
  )
}
