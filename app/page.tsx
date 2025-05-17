import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Tokenomics } from "@/components/landing/tokenomics"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { OnboardingGuide } from "@/components/landing/onboarding-guide"
import { PoolQualification } from "@/components/landing/pool-qualification"
import { CalculatorSection } from "@/components/landing/calculator-section"
import { ConversionSection } from "@/components/landing/conversion-section"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <Hero />
      <Features />
      <OnboardingGuide />
      <PoolQualification />
      <Tokenomics />
      <CalculatorSection />
      <ConversionSection />
      <RoadmapSection />
    </>
  )
}
