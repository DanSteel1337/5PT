"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import components with SSR disabled
const RewardsOverview = dynamic(
  () => import("@/components/rewards/RewardsOverview").then((mod) => ({ default: () => <mod.RewardsOverview /> })),
  { ssr: false },
)

const RewardsClaimer = dynamic(
  () => import("@/components/rewards/RewardsClaimer").then((mod) => ({ default: () => <mod.RewardsClaimer /> })),
  { ssr: false },
)

const RewardsHistory = dynamic(
  () => import("@/components/rewards/RewardsHistory").then((mod) => ({ default: () => <mod.RewardsHistory /> })),
  { ssr: false },
)

const RewardsStats = dynamic(
  () => import("@/components/rewards/RewardsStats").then((mod) => ({ default: () => <mod.RewardsStats /> })),
  { ssr: false },
)

export function RewardsOverviewWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RewardsOverview />
    </Suspense>
  )
}

export function RewardsClaimerWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RewardsClaimer />
    </Suspense>
  )
}

export function RewardsHistoryWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RewardsHistory />
    </Suspense>
  )
}

export function RewardsStatsWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RewardsStats />
    </Suspense>
  )
}
