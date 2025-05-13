"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { ClientOnly } from "@/components/ClientOnly"

// Dynamic imports for performance optimization
const Navbar = dynamic(() => import("@/components/Navbar"), {
  // Don't use ssr: false here, use ClientOnly wrapper instead
  loading: () => <div className="h-16 w-full bg-black/80"></div>,
})

const Hero = dynamic(() => import("@/components/landing/hero"))
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

export default function ClientPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <ClientOnly fallback={<div className="h-16 w-full bg-black/80"></div>}>
        <Navbar />
      </ClientOnly>

      <Suspense fallback={<LoadingFallback />}>
        <ClientOnly fallback={<LoadingFallback />}>
          <Hero />
        </ClientOnly>
      </Suspense>

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
