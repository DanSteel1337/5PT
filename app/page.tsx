import { FuturisticHero } from "@/components/landing/futuristic-hero"
import { CompactFeatures } from "@/components/landing/compact-features"
import { CompactTokenomics } from "@/components/landing/compact-tokenomics"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <div className="flex flex-col">
      <FuturisticHero />
      <CompactFeatures />
      <CompactTokenomics />
      <InvestmentCTA />
    </div>
  )
}
