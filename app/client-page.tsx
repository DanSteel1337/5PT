"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Tokenomics } from "@/components/landing/tokenomics"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/layout/footer"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { SocialProof } from "@/components/landing/social-proof"
import { OnboardingGuide } from "@/components/landing/onboarding-guide"
import { CalculatorSection } from "@/components/landing/calculator-section"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function ClientPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("ClientPage mounted")
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-purple-500/20"></div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <ErrorBoundary fallback={<div>Something went wrong with the page</div>}>
        <Navbar />
        {/* Removed ClientOnly wrapper to ensure Hero is always rendered */}
        <Hero />
        <Features />
        <SocialProof />
        <Tokenomics />
        <CalculatorSection />
        <OnboardingGuide />
        <CTA />
        <Footer />
        <ScrollIndicator />
      </ErrorBoundary>
    </main>
  )
}

function HeroLoadingFallback() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="animate-pulse w-32 h-32 rounded-full bg-purple-500/20"></div>
    </section>
  )
}
