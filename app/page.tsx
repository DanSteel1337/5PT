import { Suspense } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Tokenomics } from "@/components/landing/tokenomics"
import { PoolQualification } from "@/components/landing/pool-qualification"
import { CalculatorSection } from "@/components/landing/calculator-section"
import { OnboardingGuide } from "@/components/landing/onboarding-guide"
import { ConversionSection } from "@/components/landing/conversion-section"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <main className="flex min-h-screen flex-col items-center justify-between bg-black text-white overflow-hidden">
        <Navbar />
        <Hero />
        <Features />
        <Tokenomics />
        <PoolQualification />
        <CalculatorSection />
        <OnboardingGuide />
        <RoadmapSection />
        <ConversionSection />
        <Footer />
      </main>
    </Suspense>
  )
}
