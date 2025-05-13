"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { PoolQualification } from "@/components/landing/pool-qualification"
import { Tokenomics } from "@/components/landing/tokenomics"
import { OnboardingGuide } from "@/components/landing/onboarding-guide"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/layout/footer"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { PageLoading } from "@/components/ui/page-loading"

export default function ClientPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for smoother transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <PoolQualification />
      <Tokenomics />
      <OnboardingGuide />
      <CTA />
      <Footer />
      <ScrollIndicator />
    </main>
  )
}
