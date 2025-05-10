import { InvestmentCalculator } from "@/components/calculator/investment-calculator"
import { StableParticleBackground } from "@/components/ui/stable-particle-background"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-black text-white py-16">
      <StableParticleBackground />
      <div className="container mx-auto px-4">
        <InvestmentCalculator />
      </div>
    </div>
  )
}
