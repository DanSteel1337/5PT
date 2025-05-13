"use client"

import { Suspense, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ClientOnly } from "@/components/ClientOnly"
import ErrorBoundary from "@/components/ErrorBoundary"

// Dynamic imports for performance optimization
const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => <div className="h-16 w-full bg-black/80"></div>,
})

// Import Hero with error handling
const Hero = dynamic(() => import("@/components/landing/hero"), {
  loading: () => <HeroLoadingFallback />,
  ssr: false,
})

const Features = dynamic(() => import("@/components/landing/features"))
const CalculatorSection = dynamic(() => import("@/components/landing/calculator-section"))
const SocialProof = dynamic(() => import("@/components/landing/social-proof"))
const OnboardingGuide = dynamic(() => import("@/components/landing/onboarding-guide"))
const Tokenomics = dynamic(() => import("@/components/landing/tokenomics"))
const CTA = dynamic(() => import("@/components/landing/cta"))
const Footer = dynamic(() => import("@/components/layout/footer"))

// Loading fallbacks
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

// Specific loading fallback for Hero section
const HeroLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="text-white text-xl">Loading 5PT Investment Platform...</div>
    </div>
  </div>
)

export default function ClientPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("ClientPage mounted")
  }, [])

  if (!mounted) {
    return <LoadingFallback />
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <ClientOnly fallback={<div className="h-16 w-full bg-black/80"></div>}>
        <Navbar />
      </ClientOnly>

      <ErrorBoundary fallback={<HeroLoadingFallback />}>
        <ClientOnly fallback={<HeroLoadingFallback />}>
          <Hero />
        </ClientOnly>
      </ErrorBoundary>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <Features />
        </ClientOnly>
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <CalculatorSection />
        </ClientOnly>
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <SocialProof />
        </ClientOnly>
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <OnboardingGuide />
        </ClientOnly>
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <Tokenomics />
        </ClientOnly>
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <CTA />
        </ClientOnly>
      </Suspense>

      <ClientOnly fallback={<div className="h-64 w-full bg-black"></div>}>
        <Footer />
      </ClientOnly>
    </main>
  )
}
