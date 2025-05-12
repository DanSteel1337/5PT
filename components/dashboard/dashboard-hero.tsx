import { Suspense } from "react"
import { DashboardHeroServer } from "./dashboard-hero-server"
import { DashboardHeroClient } from "./dashboard-hero-client"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHero() {
  return (
    <div className="space-y-6">
      <DashboardHeroServer />
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[140px] rounded-xl" />
              ))}
          </div>
        }
      >
        <DashboardHeroClient />
      </Suspense>
    </div>
  )
}
