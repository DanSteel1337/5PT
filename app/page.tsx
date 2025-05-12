import { ModernHero } from "@/components/landing/modern-hero"
import { Tokenomics } from "@/components/landing/tokenomics"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernHero />

      {/* TODO: Fix Features component - potentially causing build errors
         Temporary commented out for diagnostic purposes */}
      {/* import { Features } from "@/components/landing/features" */}
      {/* <Features /> */}

      <Tokenomics />
      <InvestmentCTA />
    </main>
  )
}
