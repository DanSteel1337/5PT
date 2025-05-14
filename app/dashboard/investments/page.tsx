import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import DashboardClientWrapper from "../client-wrapper"

export default function InvestmentsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClientWrapper activePage="investments" />
    </Suspense>
  )
}
