import { Suspense } from "react"
import { DashboardOverviewClient } from "./dashboard-overview-client"

export function DashboardOverview() {
  return (
    <Suspense fallback={<div className="min-h-screen">Loading dashboard overview...</div>}>
      <DashboardOverviewClient />
    </Suspense>
  )
}
