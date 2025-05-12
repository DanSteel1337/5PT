"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import components with SSR disabled
const DashboardHero = dynamic(
  () => import("@/components/dashboard/DashboardHero").then((mod) => ({ default: () => <mod.DashboardHero /> })),
  { ssr: false },
)

const EarningsOverview = dynamic(
  () => import("@/components/dashboard/EarningsOverview").then((mod) => ({ default: () => <mod.EarningsOverview /> })),
  { ssr: false },
)

const RewardsBreakdown = dynamic(
  () => import("@/components/dashboard/RewardsBreakdown").then((mod) => ({ default: () => <mod.RewardsBreakdown /> })),
  { ssr: false },
)

const RankVisualizer = dynamic(
  () => import("@/components/dashboard/RankVisualizer").then((mod) => ({ default: () => <mod.RankVisualizer /> })),
  { ssr: false },
)

const ActivePools = dynamic(
  () => import("@/components/dashboard/ActivePools").then((mod) => ({ default: () => <mod.ActivePools /> })),
  { ssr: false },
)

const AiInsights = dynamic(
  () => import("@/components/dashboard/AiInsights").then((mod) => ({ default: () => <mod.AiInsights /> })),
  { ssr: false },
)

export function DashboardHeroWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DashboardHero />
    </Suspense>
  )
}

export function EarningsOverviewWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EarningsOverview />
    </Suspense>
  )
}

export function RewardsBreakdownWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RewardsBreakdown />
    </Suspense>
  )
}

export function RankVisualizerWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RankVisualizer />
    </Suspense>
  )
}

export function ActivePoolsWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ActivePools />
    </Suspense>
  )
}

export function AiInsightsWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AiInsights />
    </Suspense>
  )
}
