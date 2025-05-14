import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import DashboardClientWrapper from "../client-wrapper"

export default function ReferralsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClientWrapper activePage="referrals" />
    </Suspense>
  )
}
