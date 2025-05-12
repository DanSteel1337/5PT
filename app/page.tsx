import { Features } from "@/components/landing/features"
import { Tokenomics } from "@/components/landing/tokenomics"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* TODO: Fix ModernHero component - currently causing build errors
         Likely issue: Web3 integration causing "Super expression must either be null or a function" error
         Temporary commented out for diagnostic purposes */}
      {/* <ModernHero /> */}

      <Features />
      <Tokenomics />
      <InvestmentCTA />
    </main>
  )
}
