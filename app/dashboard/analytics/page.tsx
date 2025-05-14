import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import DashboardClientWrapper from "../client-wrapper"

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClientWrapper activePage="analytics" />
    </Suspense>
  )
}
