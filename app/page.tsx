// DIAGNOSTIC VERSION - Comment out components to isolate the issue
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Test 1: Empty page */}
      <div>Diagnostic page - all components disabled</div>

      {/* Uncomment these one by one to identify the problematic component */}
      {/* import { ModernHero } from "@/components/landing/modern-hero" */}
      {/* <ModernHero /> */}

      {/* import { Features } from "@/components/landing/features" */}
      {/* <Features /> */}

      {/* import { Tokenomics } from "@/components/landing/tokenomics" */}
      {/* <Tokenomics /> */}

      {/* import { InvestmentCTA } from "@/components/landing/investment-cta" */}
      {/* <InvestmentCTA /> */}
    </main>
  )
}
