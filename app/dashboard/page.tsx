import { Suspense } from "react"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { ContractStatisticsCard } from "@/components/dashboard/contract-statistics-card"
import { InvestmentStats } from "@/components/dashboard/investment-stats"
import { SmartReferralSystem } from "@/components/dashboard/smart-referral-system"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-8">
      <DashboardHero />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
          <ContractStatisticsCard />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
          <InvestmentStats />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
          <SmartReferralSystem />
        </Suspense>
      </div>
    </div>
  )
}
