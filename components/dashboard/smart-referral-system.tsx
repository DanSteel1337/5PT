"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { shouldUseMockData } from "@/lib/environment"
import { Skeleton } from "@/components/ui/skeleton"

// Import the mock version directly
import { MockReferralSystem } from "./mock-referral-system"

// Dynamically import the real component with no SSR
const RealReferralSystem = dynamic(
  () => import("./enhanced-referral-system").then((mod) => ({ default: mod.EnhancedReferralSystem })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
    ),
  },
)

export function SmartReferralSystem() {
  const [mounted, setMounted] = useState(false)
  const useMockData = shouldUseMockData()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always use mock version in preview mode or before mounting
  if (!mounted || useMockData) {
    return <MockReferralSystem />
  }

  // Use real version in production mode after mounting
  return <RealReferralSystem />
}
