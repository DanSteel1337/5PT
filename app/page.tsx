import { ModernHero } from "@/components/landing/modern-hero"
import { Features } from "@/components/landing/features"
import { Tokenomics } from "@/components/landing/tokenomics-fixed"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ModernHero />
      <Features />
      <Tokenomics />
      <InvestmentCTA />
    </main>
  )
}
